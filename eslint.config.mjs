import globals from 'globals';

import anansiPlugin from '@anansi/eslint-plugin';

export default [
  ...anansiPlugin.configs.typescript,
  {
    ignores: [
      'lib*/*',
      'dist*/*',
      'generators/*',
      'packages/generator-js/**/templates',
      'packages/jest-preset-anansi/**/templates',
    ],
  },
  {
    files: [
      'packages/eslint-plugin/*',
      'packages/webpack-config-anansi/**',
      'packages/jest-preset-anansi/**',
      'packages/generator-js/**',
      'packages/cli/**',
      'packages/babel-preset-anansi/*',
      'babel.config.js',
    ],
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
  },
];
