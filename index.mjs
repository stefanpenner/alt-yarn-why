import lockfile from '@yarnpkg/lockfile';
import fs from 'fs';
import parsePackageName from 'parse-package-name';

function filterVariants(variant, depMap) {
  const name = parsePackageName(variant).name;
  const byName = _name => parsePackageName(_name).name === name;

  return Object.keys(depMap).filter(byName);
}

export default function (lockfilePath, targetName) {
  const yarn = lockfile.parse(fs.readFileSync(lockfilePath, 'utf8'));
  if (!yarn.type === 'success') {
    throw new Error(`@yarnpkg/lockfile unable to parse ${lockfilePath}`);
  }

  const depMap = yarn.object;
  const variants = filterVariants(targetName, depMap);

  const output = Object.create(null);

  for (const variant of variants) {
    output[variant] = [];
  }

  for (const name of Object.keys(depMap)) {
    const dep = depMap[name];
    const dependencies = dep.dependencies;
    if (typeof dependencies === 'object' && dependencies !== null) {
      const currentVariant = dependencies[targetName];
      if (currentVariant) {
        output[targetName + '@' + currentVariant].push(name);
      }
    }
  }

  return output;
}
