module.exports = {
  stories: ['../<%= rootPath %>/**/*.stories.@(tsx)'],
  addons: [
    '@storybook/addon-essentials', '@storybook/addon-links', '@storybook/addon-mdx-gfm'
  ],
  framework: {
    name: '@anansi/storybook',
    options: {
      fastRefresh: true
    }
  },
  docs: {
    autodocs: true
  },
  typescript: {
    reactDocgen: 'react-docgen-typescript',
  }
};
