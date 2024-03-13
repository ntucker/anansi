module.exports = {
  stories: ['../<%= rootPath %>/**/*.stories.@(tsx)'],
  addons: [
    '@storybook/addon-essentials', '@storybook/addon-links'
  ],
  framework: {
    name: '@anansi/storybook'
  },
  docs: {
    autodocs: true
  },
  typescript: {
    reactDocgen: 'react-docgen-typescript',
  }
};
