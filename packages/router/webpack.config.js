const { makeConfig } = require('@anansi/webpack-config');

const generateConfig = makeConfig({
  basePath: 'src',
  babelLoader: {
    rootMode: 'upward',
  },
  pkg: require('./package.json'),
});

module.exports = (env, argv) => {
  const config = generateConfig(env, argv);
  if (!config.experiments) config.experiments = {};
  config.experiments.backCompat = false;

  return config;
};
