const { makeConfig } = require('@anansi/webpack-config');

const generateConfig = makeConfig({
  basePath: 'src',
  serverDir: 'dist',
  babelLoader: {
    rootMode: 'upward',
  },
  pkg: require('./package.json'),
  library: {
    type: 'commonjs2',
  },
  // we have to explicitly disable linaria since we have it installed in the monorepo
  inJSOptions: false,
});

module.exports = (env, argv) => {
  const config = generateConfig(env, argv);
  if (!config.experiments) config.experiments = {};
  config.experiments.backCompat = false;

  return config;
};
