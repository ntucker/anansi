import anansiPlugin from '@anansi/eslint-plugin';
import path from 'path';

export default [
  ...anansiPlugin.configs.typescript,
  {
    settings: {
      'import/resolver': {
        typescript: {
          project: path.resolve(import.meta.dirname, './tsconfig.json'),
        },
      },
    },
  },
];
