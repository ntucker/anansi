// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format
import storybook from "eslint-plugin-storybook";

import anansiPlugin from '@anansi/eslint-plugin';
import path from 'path';

export default [...anansiPlugin.configs.typescript, {
  settings: {
    'import/resolver': {
      typescript: {
        project: path.resolve(import.meta.dirname, './tsconfig.json'),
      },
    },
  },
}, ...storybook.configs["flat/recommended"]];
