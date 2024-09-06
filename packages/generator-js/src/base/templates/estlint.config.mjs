import anansiPlugin from '@anansi/eslint-plugin';

export default [
  ...anansiPlugin.configs.typescript,
  {
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
  },
  {
    ignores: ['<%= assetPath %>'],
  },
]