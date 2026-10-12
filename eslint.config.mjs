import anansiPlugin from '@anansi/eslint-plugin';
import globals from 'globals';

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
      'packages/browserslist-config-anansi/*',
      'babel.config.js',
      'scripts/**',
    ],
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
  },
  {
    // package pretests lint from their own directory; use this repo's babel.config.js
    files: ['**/*.?(m|c)js?(x)'],
    languageOptions: {
      parserOptions: { babelOptions: { root: import.meta.dirname } },
    },
  },
  {
    files: [
      'packages/**/*.test.{js,jsx,ts,tsx}',
      'packages/**/__tests__/**/*.{js,jsx,ts,tsx}',
    ],
    languageOptions: {
      globals: {
        ...globals.jest,
      },
    },
  },
];
