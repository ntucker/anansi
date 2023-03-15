module.exports = {
  stories: ['../**/*.stories.tsx'],
  addons: ['@storybook/addon-essentials', '@storybook/addon-mdx-gfm'],
  typescript: {
    reactDocgen: 'react-docgen-typescript'
  },
  framework: {
    name: '@storybook/react-webpack5',
    options: {
      fastRefresh: true
    }
  },
  docs: {
    autodocs: true
  }
};