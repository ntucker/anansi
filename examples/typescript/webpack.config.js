const { makeConfig } = require('@anansi/webpack-config');

const options = {
  basePath: 'src',
  buildDir: 'dist/',
  sassResources: [`${__dirname}/src/style/export.scss`],
  fontPreload: 'prefetch',
  inJSOptions: false,
  svgrOptions: {
    replaceAttrValues: { '#f00': 'currentColor', red: 'currentColor' },
  },
};

const generateConfig = makeConfig(options);

module.exports = (env, argv) => {
  const config = generateConfig(env, argv);
  if (
    config.optimization &&
    config.optimization.splitChunks &&
    config.optimization.splitChunks.cacheGroups
  ) {
    config.optimization.splitChunks.cacheGroups.router = {
      test: /[\\/]node_modules[\\/](react-router|react-router-dom|history|resolve-pathname|value-equal|path-to-regexp|scroll-behavior|react-router-scroll-4)[\\/].*/,
      name: 'router',
      chunks: 'all',
    };
  }
  return config;
};

module.exports.options = options;
