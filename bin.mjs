#!/usr/bin/env node

import lib from './index.mjs';
import fs from 'fs';

const [, , lockfilePath, targetName] = process.argv;

if (!targetName || !lockfilePath) {
  throw new Error(`alt-yarn-why <yarn.lock> <package-name>`);
}

if (!fs.existsSync(lockfilePath)) {
  throw new Error(`${lockfilePath} is not present`);
}

console.log(JSON.stringify(lib(lockfilePath, targetName), null, 2));
