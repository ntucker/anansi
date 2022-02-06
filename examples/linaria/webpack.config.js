const { makeConfig } = require('@anansi/webpack-config');

const options = {
  basePath: 'src',
  buildDir: 'dist/',
  sassOptions: false,
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
  if (!config.experiments) config.experiments = {};
  config.experiments.backCompat = false;
  return config;
};

module.exports.options = options;
