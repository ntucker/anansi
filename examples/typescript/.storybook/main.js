const { dirname, join } = require('path');

const wrapForPnP = input =>
  dirname(require.resolve(join(input, 'package.json')));

module.exports = {
  stories: ['../**/*.stories.tsx'],
  addons: [getAbsolutePath("@storybook/addon-docs"), getAbsolutePath("@storybook/addon-links")],

  typescript: {
    reactDocgen: 'react-docgen-typescript',
  },

  framework: {
    name: wrapForPnP('@anansi/storybook'),
  }
};

function getAbsolutePath(value) {
  return dirname(require.resolve(join(value, "package.json")));
}
