'use strict';

const { configs } = require('@nullvoxpopuli/eslint-configs');

// accommodates: JS, TS, ESM, and CJS
let config = configs.node();

module.exports = {
  overrides: [
    ...config.overrides,
    {
      files: ['*.d.ts'],
      rules: {
        'n/no-unassigned-import': 'off',
        'n/no-missing-import': 'off',
        'import/no-unassigned-import': 'off',
      },
    },
    {
      files: ['./src/rollup-plugin.js'],
      rules: {
        'n/no-missing-import': 'off',
        'import/namespace': 'off',
      },
    },
  ],
};
