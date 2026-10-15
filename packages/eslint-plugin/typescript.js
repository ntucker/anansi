import tsParser from '@typescript-eslint/parser';
import { createRequire } from 'module';

import baseConfig from './base.js';

// Resolvers by path, as eslint-plugin-import can't load our dependencies by
// name under Yarn PnP
const require = createRequire(import.meta.url);

let rules = {
  'react/prop-types': 'off',
  'react/jsx-uses-react': 'off',
  'react/react-in-jsx-scope': 'off',
  '@typescript-eslint/no-require-imports': 'off',
  '@typescript-eslint/explicit-function-return-type': 'off',
  '@typescript-eslint/no-explicit-any': 'off',
  '@typescript-eslint/explicit-member-accessibility': 'off',
  '@typescript-eslint/explicit-module-boundary-types': 'off',
  '@typescript-eslint/no-use-before-define': 'off',
  '@typescript-eslint/no-unused-vars': [
    'warn',
    // ignoreRestSiblings is disabled by default
    {
      vars: 'all',
      args: 'after-used',
      ignoreRestSiblings: true,
      argsIgnorePattern: '^_',
    },
  ],
  '@typescript-eslint/ban-ts-comment': [
    'error',
    {
      'ts-expect-error': false,
      'ts-ignore': true,
      'ts-nocheck': true,
      'ts-check': false,
    },
  ],
  '@typescript-eslint/no-empty-object-type': 'off',
};
export default [
  ...baseConfig,
  {
    files: ['**/*.?(m|c)ts?(x)'],
    languageOptions: {
      parser: tsParser,
    },
    settings: {
      'import/resolver': {
        [require.resolve('eslint-import-resolver-typescript')]: {},
      },
    },
    rules,
  },
];
