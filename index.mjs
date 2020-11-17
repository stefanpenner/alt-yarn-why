import lockfile from '@yarnpkg/lockfile';
import fs from 'fs';
import parsePackageName from 'parse-package-name';
import semver from 'semver';

function filterVariants(variant, depMap) {
  const name = parsePackageName(variant).name;
  const byName = _name => parsePackageName(_name).name === name;

  return Object.keys(depMap).filter(byName);
}
function loadLockfile(lockfilePath) {
  const yarn = lockfile.parse(fs.readFileSync(lockfilePath, 'utf8'));
  if (!yarn.type === 'success') {
    throw new Error(`@yarnpkg/lockfile unable to parse ${lockfilePath}`);
  }
  return yarn;
}

export function whoDependsOn(lockfilePath, _targetName) {
  const yarn = loadLockfile(lockfilePath);
  const { name: targetName, version: versionConstraint } = parsePackageName(_targetName);
  const depMap = yarn.object;
  const intermediate = Object.create(null);

  for (const variant of filterVariants(targetName, depMap)) {
    const resolvedVersion = depMap[variant].version;
    if (semver.satisfies(resolvedVersion, versionConstraint) === false) {
      continue;
    }

    intermediate[targetName + '@' + resolvedVersion] = {};
  }

  for (const depName of Object.keys(depMap)) {
    const dep = depMap[depName];
    const version = dep.version;
    const name = parsePackageName(depName).name;
    const dependencies = dep.dependencies;
    if (typeof dependencies === 'object' && dependencies !== null) {
      const currentVariant = dependencies[targetName];
      if (currentVariant) {
        const resolvedVersion = depMap[targetName + '@' + currentVariant].version;
        const key = targetName + '@' + resolvedVersion;
        if (typeof intermediate[key] === 'object' && intermediate[key] !== null) {
          const resolvedTarget = intermediate[key];
          const depKey = name + '@' + version;
          resolvedTarget[depKey] = resolvedTarget[depKey] || 0;
          resolvedTarget[depKey]++;
        }
      }
    }
  }

  const output = Object.create(null);
  for (const name of Object.keys(intermediate)) {
    output[name] = intermediate[name];
  }

  return output;
}

export function duplicates(lockfilePath) {
  const yarn = loadLockfile(lockfilePath);
  const intermediate = Object.create(null);
  for (const packageName of Object.keys(yarn.object)) {
    const dep = yarn.object[packageName];
    const { name } = parsePackageName(packageName);
    intermediate[name] = intermediate[name] || Object.create(null);
    intermediate[name][dep.version] = intermediate[name][dep.version] || 0;
    intermediate[name][dep.version]++;
  }

  for (const name of Object.keys(intermediate)) {
    if (Object.keys(intermediate[name]).length === 1) {
      delete intermediate[name];
    }
  }
  const result = [];

  for (const name of Object.keys(intermediate)) {
    const versions = intermediate[name];
    result.push({
      name,
      versions,
      total: sumVersions(versions),
    });
  }

  result.sort((a, b) => b.total - a.total);

  return result;
}

function sumVersions(versions) {
  let sum = 0;
  for (const count of Object.values(versions)) {
    sum += count;
  }
  return sum;
}
