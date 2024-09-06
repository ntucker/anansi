

import anansiPlugin from '@anansi/eslint-plugin';

export default [
  ...anansiPlugin.configs.typescript,
  {
    files: ['./src/**'],
    languageOptions: {
      globals: {
        ...globals.browser,
      },
    },
  },
  {
    ignores: ['<%= assetPath %>'],
  },
]