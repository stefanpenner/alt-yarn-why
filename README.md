# alt-yarn-why ![CI](https://github.com/stefanpenner/alt-yarn-why/workflows/CI/badge.svg)

yarn why is cool, but sometimes it doesn't show what i want....

Specifically I realized, it’s a little tricky to see:

* how many versions of a given library are present
* what directly is depending on all those versions, keeping them around.


This library aims to help answer those questions.


## usage
```sh
  Usage
    $ alt-yarn-why <command> <...args>

  Commands:
    who-depends-on

    This command helps you understand which dependencies depend on a given
    package-name, by telling you both all the versions of this dependency
    present, and it's dependents.

    Example
      $ alt-yarn-why who-depends-on  ./yarn.lock fs-extra
    
      > {
           "fs-extra@0.24.0": {
             "broccoli-config-replace@1.1.2": 1
           },
           "fs-extra@0.30.0": {
             "ember-cli-internal-test-helpers@0.9.1": 1,
             "fixturify@0.3.4": 1
           },
           ...
           "fs-extra@9.0.1": {}
      }
    

    Other Examples
      $ alt-yarn-why who-depends-on yarn.lock 'ember-cli-version-checker'
      $ alt-yarn-why who-depends-on yarn.lock 'ember-cli-version-checker@4'
      $ alt-yarn-why who-depends-on yarn.lock 'ember-cli-version-checker@4 || 5'


    duplicates

    This command quickly surface duplicate dependencies. These are sorted by
    most duplicated to least.

    Example
      $ alt-yarn-why duplicates  ./yarn.lock
    
      > [
          {
            "name": "debug",
            "total": 17,
            "versions": {
              "2.6.9": 7,
              "4.2.0": 4,
              "3.2.6": 4,
              "3.1.0": 1,
              "4.1.1": 1
            }
          },
          {
            "name": "rimraf",
            "total": 15,
            "versions": {
              "2.6.3": 2,
              "2.7.1": 11,
              "3.0.2": 2
            }
          }
        ]
    

    Other Examples
      $ alt-yarn-why dupcliates yarn.lock | jq '.[:5]' # Show Top 5 Duplicates


```

## as a library

```sh
yarn add alt-yarn-why
```

```js
// index.mjs
import { whoDependsOn, duplicates } from 'alt-yarn-why';

whoDependsOn(pathToLockFile, packageName) === { /* dictionary of <matched> to [...retainers] */ }
duplicates(pathToLockFile) === [ /* list of duplicates, their versions and totals */ ];
```
