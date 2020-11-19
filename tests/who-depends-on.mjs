import chai from 'chai'; // eslint-disable-line node/no-unpublished-import
import execa from 'execa'; // eslint-disable-line node/no-unpublished-import
const { expect } = chai;

import { whoDependsOn } from '../index.mjs';
describe('alt-yarn-why who-depends-on', function () {
  describe('acceptance', function () {
    it('valid args', async function () {
      const child = await execa(
        './bin.mjs',
        ['who-depends-on', './yarn.lock', '@yarnpkg/lockfile'],
        {
          reject: false,
        },
      );
      expect(child.exitCode).to.eql(0);
      expect(JSON.parse(child.stdout)).to.eql({
        '@yarnpkg/lockfile@1.1.0': {},
      });
      expect(child.stderr).to.eql('');
    });

    it('no args', async function () {
      const child = await execa('./bin.mjs', ['who-depends-on'], {
        reject: false,
      });
      expect(child.exitCode).to.eql(2);
      expect(child.stdout).to.match(/\$ alt-yarn-why <...args/);
      expect(child.stderr).to.eql('');
    });

    it('missing package-name', async function () {
      const child = await execa('./bin.mjs', ['./yarn.lock'], {
        reject: false,
      });
      expect(child.exitCode).to.eql(2);
      expect(child.stdout).to.match(/\$ alt-yarn-why <...args/);
      expect(child.stderr).to.eql('');
    });

    it('invalid lockfile path', async function () {
      const child = await execa('./bin.mjs', ['./yarn-invalid.lock'], {
        reject: false,
      });
      expect(child.exitCode).to.eql(2);
      expect(child.stdout).to.match(/\$ alt-yarn-why <...args/);
      expect(child.stderr).to.eql('');
    });
  });

  it('works', function () {
    expect(whoDependsOn('./yarn.lock', 'something-non-existent')).to.eql({});
    expect(whoDependsOn('./yarn.lock', '@yarnpkg/lockfile')).to.eql({
      '@yarnpkg/lockfile@1.1.0': {},
    });

    expect(whoDependsOn('./yarn.lock', '@yarnpkg/lockfile@1.1.0')).to.eql({
      '@yarnpkg/lockfile@1.1.0': {},
    });

    expect(whoDependsOn('./yarn.lock', '@yarnpkg/lockfile@^1.0.0')).to.eql({
      '@yarnpkg/lockfile@1.1.0': {},
    });

    expect(whoDependsOn('./yarn.lock', '@yarnpkg/lockfile@2.0.0')).to.eql({});
    expect(whoDependsOn('./yarn.lock', '@yarnpkg/lockfile@^2.0.0')).to.eql({});

    expect(whoDependsOn('./fixtures/ember-cli.lock', '@yarnpkg/lockfile')).to.eql({});
    expect(whoDependsOn('./fixtures/ember-cli.lock', 'fs-extra')).to.eql({
      'fs-extra@0.24.0': { 'broccoli-config-replace@1.1.2': 1 },
      'fs-extra@0.30.0': { 'ember-cli-internal-test-helpers@0.9.1': 1, 'fixturify@0.3.4': 1 },
      'fs-extra@4.0.3': { 'yam@1.0.0': 1 },
      'fs-extra@5.0.0': { 'fast-sourcemap-concat@2.1.0': 1 },
      'fs-extra@7.0.1': { 'ember-cli-blueprint-test-helpers@0.19.2': 1 },
      'fs-extra@8.1.0': {
        'broccoli-concat@4.2.4': 1,
        'broccoli-output-wrapper@3.2.1': 1,
        'broccoli-stew@3.0.0': 1,
        'fixturify@2.1.0': 1,
        'fs-merger@3.1.0': 1,
      },
      'fs-extra@9.0.1': {},
    });

    expect(whoDependsOn('./fixtures/ember-cli.lock', '@types/fs-extra')).to.eql({
      '@types/fs-extra@8.1.0': { 'fixturify@2.1.0': 1 },
    });
  });
});
