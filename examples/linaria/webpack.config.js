const { makeConfig } = require('@anansi/webpack-config');

const options = {
  basePath: 'src',
  buildDir: 'dist/',
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
  config.module.rules[1].use.push({
    loader: 'linaria/loader',
    options: {
      sourceMap: argv && argv.mode !== 'production',
    },
  });
  return config;
};

module.exports.options = options;
