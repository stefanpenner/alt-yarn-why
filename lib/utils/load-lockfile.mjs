import lockfile from '@yarnpkg/lockfile';
import fs from 'fs';

export default function loadLockfile(lockfilePath) {
  const yarn = lockfile.parse(fs.readFileSync(lockfilePath, 'utf8'));
  if (!yarn.type === 'success') {
    throw new Error(`@yarnpkg/lockfile unable to parse ${lockfilePath}`);
  }
  return yarn;
}
