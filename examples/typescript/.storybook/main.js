const { dirname, join } = require('path');

const wrapForPnP = (input) => dirname(require.resolve(join(input, 'package.json')));

module.exports = {
  stories: ['../**/*.stories.tsx'],
  addons: ['@storybook/addon-essentials', '@storybook/addon-mdx-gfm'],
  typescript: {
    reactDocgen: 'react-docgen-typescript'
  },
  framework: {
    name: wrapForPnP('@anansi/storybook'),
    options: {
      fastRefresh: true
    }
  },
  docs: {
    autodocs: true
  }
};
