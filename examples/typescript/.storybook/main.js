module.exports = {
  stories: ['../**/*.stories.@(tsx)'],
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
