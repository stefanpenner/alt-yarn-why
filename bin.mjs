#!/usr/bin/env node

import { whoDependsOn } from './index.mjs';
import fs from 'fs';
import meow from 'meow';
import chalk from 'chalk';

const cli = meow(
  chalk`
  {bold Usage}
    {gray $} {blue alt-yarn-why} {gray <command> <lock-file> <package-name>}

  {bold Commands:}
    {bold who-depends-on}

    This command helps you understand which dependencies depend on a given
    package-name, by telling you both all the versions of this dependency
    present, and it's dependents.

    Example
      {gray $} {italic {blue alt-yarn-why who-depends-on}  {cyan ./yarn.lock fs-extra}}
      {gray
      > \{
           "fs-extra@0.24.0": \{
             "broccoli-config-replace@1.1.2": 1
           \},
           "fs-extra@0.30.0": \{
             "ember-cli-internal-test-helpers@0.9.1": 1,
             "fixturify@0.3.4": 1
           \},
           ...
           "fs-extra@9.0.1": \{\}
      \}
      }

    Other Examples
      {gray $} {italic {blue alt-yarn-why who-depends-on} {cyan yarn.lock 'ember-cli-version-checker'}}
      {gray $} {italic {blue alt-yarn-why who-depends-on} {cyan yarn.lock 'ember-cli-version-checker@4'}}
      {gray $} {italic {blue alt-yarn-why who-depends-on} {cyan yarn.lock 'ember-cli-version-checker@4 || 5'}}
`,
  {},
);

const command = cli.input[0];
const lockfilePath = cli.input[1];
const targetName = cli.input[2];

if (command === 'who-depends-on' && cli.input.length === 3) {
  if (!targetName || !lockfilePath) {
    throw new Error(`alt-yarn-why <yarn.lock> <package-name>`);
  }

  if (!fs.existsSync(lockfilePath)) {
    throw new Error(`${lockfilePath} is not present`);
  }

  console.log(JSON.stringify(whoDependsOn(lockfilePath, targetName), null, 2));
} else {
  cli.showHelp();
}
