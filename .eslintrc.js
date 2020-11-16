module.exports = {
  root: true,
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
  },
  plugins: ['node', 'prettier'],
  extends: ['eslint:recommended', 'plugin:node/recommended', 'plugin:prettier/recommended'],
  env: {
    node: true,
  },
  overrides: [
    {
      env: { mocha: true },
      files: 'test.mjs',
      plugins: ['mocha'],
      extends: ['plugin:mocha/recommended'],
      rules: {
        'node/no-unpublished-require': 'off',
      },
    },
  ],
};
