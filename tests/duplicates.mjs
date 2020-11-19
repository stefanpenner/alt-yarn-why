import chai from 'chai'; // eslint-disable-line node/no-unpublished-import
import execa from 'execa'; // eslint-disable-line node/no-unpublished-import
const { expect } = chai;
import { dirname } from 'mjs-dirname';
import { duplicates } from '../index.mjs';

const __dirname = dirname(import.meta.url);
const ROOT = `${__dirname}/../`;

describe('alt-yarn-why duplicates', function () {
  describe('acceptance', function () {
    it('valid args', async function () {
      const child = await execa('./bin.mjs', ['duplicates', './yarn.lock'], {
        cwd: ROOT,
        reject: false,
      });
      expect(child.exitCode).to.eql(0);
      expect(JSON.parse(child.stdout).length).to.eql(27);
      expect(child.stderr).to.eql('');
    });

    it('no args', async function () {
      const child = await execa('./bin.mjs', ['duplicates'], {
        cwd: ROOT,
        reject: false,
      });
      expect(child.exitCode).to.eql(2);
      expect(child.stdout).to.match(/\$ alt-yarn-why <...args/);
      expect(child.stderr).to.eql('');
    });
  });

  it('it works', function () {
    expect(duplicates(`${ROOT}/yarn.lock`).length).to.eql(27);
    expect(duplicates(`${ROOT}/yarn.lock`)[0]).to.eql({
      name: 'strip-ansi',
      total: 5,
      versions: {
        '4.0.0': 1,
        '5.2.0': 3,
        '6.0.0': 1,
      },
    });
    expect(duplicates(`${__dirname}/fixtures/ember-cli/yarn.lock`).length).to.eql(157);
    expect(duplicates(`${__dirname}/fixtures/ember-cli/yarn.lock`)[0]).to.eql({
      name: 'debug',
      total: 17,
      versions: {
        '2.6.9': 7,
        '3.1.0': 1,
        '3.2.6': 4,
        '4.1.1': 1,
        '4.2.0': 4,
      },
    });
  });
});
