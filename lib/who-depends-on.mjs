import parsePackageName from 'parse-package-name';
import semver from 'semver';
import loadLockfile from './utils/load-lockfile.mjs';

function filterVariants(variant, depMap) {
  const name = parsePackageName(variant).name;
  const byName = _name => parsePackageName(_name).name === name;

  return Object.keys(depMap).filter(byName);
}

export default function whoDependsOn(lockfilePath, _targetName) {
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
