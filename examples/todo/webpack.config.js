const { makeConfig } = require('@anansi/webpack-config');

const options = {
  libraryInclude: /node_modules\/(@anansi\/)/,
  libraryExclude: /node_modules(?!\/(@anansi\/))/,
  basePath: 'src',
  buildDir: 'generated_assets/',
};

const generateConfig = makeConfig(options);

module.exports = (env, argv) => {
  const config = generateConfig(env, argv);
  if (config.optimization.splitChunks) {
    config.optimization.splitChunks.cacheGroups.router = {
      test: /[\\/]node_modules[\\/](react-router|history|resolve-pathname|value-equal)[\\/]/,
      name: 'router',
      chunks: 'all',
    };
  }
  return config;
};
