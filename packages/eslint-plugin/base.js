import babelParser from '@babel/eslint-parser';
import babelPlugin from '@babel/eslint-plugin';
import { fixupConfigRules, fixupPluginRules } from '@eslint/compat';
import js from '@eslint/js';
import prettierConfig from 'eslint-config-prettier';
import importPluginRaw from 'eslint-plugin-import';
import prettierPlugin from 'eslint-plugin-prettier';
import reactPluginRaw from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import globals from 'globals';
import tsPlugin from 'typescript-eslint';

import resolverKey from './resolverKey.cjs';
import isInstalled from './isInstalled.cjs';

// eslint-plugin-import 2.32 and eslint-plugin-react 7.37 call context and
// SourceCode methods ESLint 10 removed; drop the shim once releases with
// import-js/eslint-plugin-import's getTokenOrComment fix and
// jsx-eslint/eslint-plugin-react#3979 ship
const importPlugin = fixupPluginRules(importPluginRaw);
const reactPlugin = fixupPluginRules(reactPluginRaw);
const [reactRecommended] = fixupConfigRules(
  reactPluginRaw.configs.flat.recommended,
);

const generalRules = {
  // TODO: instead of including TS stuff, just have the base, but then programatically order things
  // properly in the extends
  languageOptions: {
    globals: {
      ...globals.browser,
      ...globals.es2024,
    },
  },
  plugins: {
    prettier: prettierPlugin,
    'react-hooks': reactHooksPlugin,
    import: importPlugin,
    react: reactPlugin,
  },
  rules: {
    'prettier/prettier': 'error',
    '@typescript-eslint/no-empty-function': 'off',
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
    'react/react-in-jsx-scope': 'off',
    'react/jsx-uses-react': 'off',
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
        pathGroups: [
          {
            pattern: '@/**',
            group: 'internal',
          },
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
      '@typescript-eslint/parser': [
        '.ts',
        '.tsx',
        '.cts',
        '.mts',
        '.ctsx',
        '.mtsx',
      ],
    },
    // Yarn PnP resolves packages into .yarn (cache and __virtual__)
    'import/external-module-folders': ['node_modules', '.yarn'],
  },
};

const jsOnlyRules = {
  files: ['**/*.?(m|c)js?(x)'],
  languageOptions: {
    parser: babelParser,
    sourceType: 'module',
    // allowImportExportEverywhere: true,
    ecmaVersion: 2024,
    // ecmaFeatures: {
    //   jsx: true,
    //   experimentalObjectRestSpread: true,
    // },
    // requireConfigFile: false,
  },
  plugins: { babel: babelPlugin },
  rules: {
    'no-unused-vars': 'warn',
  },
  settings: {},
};

const config = [
  {
    ...js.configs.recommended,
    files: ['**/*.?(m|c)ts?(x)'],
  },
  ...tsPlugin.configs.recommended.map(config => ({
    ...config,
    files: ['**/*.?(m|c)ts?(x)'],
  })),
  {
    ...reactRecommended,
    files: ['**/*.?(m|c)ts?(x)'],
  },
  {
    ...prettierConfig.flat,
    files: ['**/*.?(m|c)ts?(x)'],
  },
  {
    ...js.configs.recommended,
    files: ['**/*.?(m|c)js?(x)'],
  },
  {
    ...reactRecommended,
    files: ['**/*.?(m|c)js?(x)'],
  },
  {
    ...prettierConfig.flat,
    files: ['**/*.?(m|c)js?(x)'],
  },
  jsOnlyRules,
  generalRules,
  {
    files: ['**/*.(server|node).?(m|c)jss?(x)'],
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
  },
  {
    files: [
      '**/__tests__/**/*.?(m|c)js?(x)',
      '**/*.(test|spec)?(.*).?(m|c)js?(x)',
    ],
    languageOptions: {
      globals: {
        ...globals.jest,
        ...globals.node,
      },
    },
  },
];
if (isInstalled('webpack')) {
  jsOnlyRules.settings['import/resolver'] = {
    [resolverKey('webpack')]: {},
  };
}
export default config;
