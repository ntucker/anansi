import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const resolvePackageDir = (specifier: string) =>
  dirname(fileURLToPath(import.meta.resolve(`${specifier}/package.json`)));

const config = {
  stories: ['../**/*.stories.tsx'],
  addons: ['@storybook/addon-docs'],
  typescript: {
    reactDocgen: 'react-docgen-typescript',
  },
  framework: {
    name: resolvePackageDir('@anansi/storybook'),
  },
};

export default config;
