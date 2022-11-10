const config = {
  // TODO: instead of including TS stuff, just have the base, but then programatically order things
  // properly in the extends
  env: {
    jest: true,
    browser: true,
    es6: true,
  },
  plugins: ['prettier', 'react-hooks', 'import', 'react'],
  rules: {
    'prettier/prettier': 'error',
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
    'react/prefer-stateless-function': 'error',
    'lines-between-class-members': [
      'warn',
      'always',
      { exceptAfterSingleLine: true },
    ],
    'import/order': [
      'warn',
      {
        groups: [
          ['builtin', 'external'],
          'internal',
          ['parent', 'sibling', 'index'],
        ],
        'newlines-between': 'always',
        alphabetize: {
          order: 'asc',
          caseInsensitive: true,
        },
      },
    ],
  },
  settings: {
    react: {
      version: 'detect',
    },
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx', '.cts', '.mts'],
    },
  },
  overrides: [
    {
      files: ['**/*.?(m|c)ts?(x)'],
      extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:react/recommended',
        'prettier',
      ],
    },
    {
      files: ['**/*.?(m)js?(x)'],
      extends: ['eslint:recommended', 'plugin:react/recommended', 'prettier'],
      parser: '@babel/eslint-parser',
      parserOptions: {
        sourceType: 'module',
        allowImportExportEverywhere: true,
        ecmaVersion: 2020,
        ecmaFeatures: {
          jsx: true,
          experimentalObjectRestSpread: true,
        },
        requireConfigFile: false,
      },
      plugins: ['babel'],
    },
  ],
};
try {
  require('webpack');
  config.settings['import/resolver'] = {
    webpack: {},
  };
  // eslint-disable-next-line no-empty
} catch (e) {}
module.exports = config;
