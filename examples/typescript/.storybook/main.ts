const config = {
  stories: ['../**/*.stories.tsx'],
  addons: ['@storybook/addon-docs'],
  typescript: {
    reactDocgen: 'react-docgen-typescript',
  },
  framework: {
    name: '@anansi/storybook',
  },
};

export default config;
