const { makeConfig } = require('@anansi/rspack-config');
const { mergeRsbuildConfig } = require('@rsbuild/core');

const options = {
  basePath: 'src',
  buildDir: 'dist/',
  sassOptions: false,
  babelLoader: {
    rootMode: 'upward',
  },
};

module.exports = mergeRsbuildConfig(makeConfig(options), {
  splitChunks: {
    cacheGroups: {
      router: {
        test: /[\\/]node_modules[\\/](react-router|react-router-dom|history|resolve-pathname|value-equal|path-to-regexp|scroll-behavior|react-router-scroll-4)[\\/].*/,
        name: 'router',
        chunks: 'all',
      },
    },
  },
});

module.exports.options = options;
