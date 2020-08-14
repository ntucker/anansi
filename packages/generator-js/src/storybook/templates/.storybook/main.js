module.exports = {
  stories: ['../<%= rootPath %>/**/*.stories.@(tsx)'],
  addons: [
    '@storybook/addon-docs'
  ],
  typescript: {
    reactDocgen: 'react-docgen-typescript',
  },
};
