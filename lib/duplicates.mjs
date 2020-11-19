import parsePackageName from 'parse-package-name';
import loadLockfile from './utils/load-lockfile.mjs';

export default function duplicates(lockfilePath) {
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
