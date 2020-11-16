# alt-yarn-why ![CI](https://github.com/stefanpenner/alt-yarn-why/workflows/CI/badge.svg)

yarn why is cool, but sometimes it doesn't show what i want....

Specifically I realized, it’s a little tricky to see:

* how many versions of a given library are present
* what directly is depending on all those versions, keeping them around.


This library aims to help answer those questions.


## usage

```sh
npx alt-yarn-why ./path-to-lock-file.lock name-of-package
> { }
```

## example

```
cd ember-cli
npx alt-yarn-why ./yarn.lock fs-extra
> {
  "fs-extra@0.24.0": [
    "broccoli-config-replace@1.1.2"
  ],
  "fs-extra@0.30.0": [
    "ember-cli-internal-test-helpers@0.9.1",
    "fixturify@0.3.4"
  ],
  "fs-extra@4.0.3": [
    "yam@1.0.0"
  ],
  "fs-extra@5.0.0": [
    "fast-sourcemap-concat@2.1.0"
  ],
  "fs-extra@7.0.1": [
    "ember-cli-blueprint-test-helpers@0.19.2"
  ],
  "fs-extra@8.1.0": [
    "broccoli-concat@4.2.4",
    "broccoli-output-wrapper@3.2.1",
    "broccoli-stew@3.0.0",
    "fixturify@2.1.0",
    "fs-merger@3.1.0"
  ],
  "fs-extra@9.0.1": []
}
```

## Advanced Features:

* Semver version constraints (works with any semver constraints):   `npx alt-yarn-why ./path-to-lock-file.lock name-of-package@^1.0.2`

## as a library

```sh
yarn add alt-yarn-why
```

```js
// index.mjs
import altYarnWhy from 'alt-yarn-why';

altYarnWhy(pathToLockFile, packageNameOrRegexp) === { /* dictionary of <matched> to [...retainers] */ }
```
