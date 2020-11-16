import chai from 'chai'; // eslint-disable-line node/no-unpublished-import
import execa from 'execa'; // eslint-disable-line node/no-unpublished-import
const { expect } = chai;

import lib from './index.mjs';

describe('alt-yarn-why', function () {
  describe('acceptance', function () {
    it('valid args', async function () {
      const child = await execa('./bin.mjs', ['./yarn.lock', '@yarnpkg/lockfile'], {
        reject: false,
      });
      expect(child.exitCode).to.eql(0);
      expect(JSON.parse(child.stdout)).to.eql({
        '@yarnpkg/lockfile@1.1.0': [],
      });
      expect(child.stderr).to.eql('');
    });

    it('no args', async function () {
      const child = await execa('./bin.mjs', [], {
        reject: false,
      });
      expect(child.exitCode).to.eql(1);
      expect(child.stdout).to.eql('');
      expect(child.stderr).to.match(/alt-yarn-why <yarn.lock> <package-name>/);
    });

    it('missing package-name', async function () {
      const child = await execa('./bin.mjs', ['./yarn.lock'], {
        reject: false,
      });
      expect(child.exitCode).to.eql(1);
      expect(child.stdout).to.eql('');
      expect(child.stderr).to.match(/alt-yarn-why <yarn.lock> <package-name>/);
    });

    it('invalid lockfile path', async function () {
      const child = await execa('./bin.mjs', ['./yarn-invalid.lock'], {
        reject: false,
      });
      expect(child.exitCode).to.eql(1);
      expect(child.stdout).to.eql('');
      expect(child.stderr).to.match(/alt-yarn-why <yarn.lock> <package-name>/);
    });
  });

  it('works', function () {
    expect(lib('./yarn.lock', 'something-non-existent')).to.eql({});
    expect(lib('./yarn.lock', '@yarnpkg/lockfile')).to.eql({
      '@yarnpkg/lockfile@1.1.0': [],
    });

    expect(lib('./fixtures/ember-cli.lock', '@yarnpkg/lockfile')).to.eql({});
    expect(lib('./fixtures/ember-cli.lock', 'fs-extra')).to.eql({
      'fs-extra@0.24.0': ['broccoli-config-replace@1.1.2'],
      'fs-extra@0.30.0': ['ember-cli-internal-test-helpers@0.9.1', 'fixturify@0.3.4'],
      'fs-extra@4.0.3': ['yam@1.0.0'],
      'fs-extra@5.0.0': ['fast-sourcemap-concat@2.1.0'],
      'fs-extra@7.0.1': ['ember-cli-blueprint-test-helpers@0.19.2'],
      'fs-extra@8.1.0': [
        'broccoli-concat@4.2.4',
        'broccoli-output-wrapper@3.2.1',
        'broccoli-stew@3.0.0',
        'fixturify@2.1.0',
        'fs-merger@3.1.0',
      ],
      'fs-extra@9.0.1': [],
    });

    expect(lib('./fixtures/ember-cli.lock', '@types/fs-extra')).to.eql({
      '@types/fs-extra@8.1.0': ['fixturify@2.1.0'],
    });
  });
});
