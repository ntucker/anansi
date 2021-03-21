module.exports = {
  core: {
    builder: "webpack5",
  },
  stories: ['../<%= rootPath %>/**/*.stories.@(tsx)'],
  addons: [
    '@storybook/addon-essentials'
  ],
  typescript: {
    reactDocgen: 'react-docgen-typescript',
  },
  reactOptions: {
    fastRefresh: true,
  },
};
