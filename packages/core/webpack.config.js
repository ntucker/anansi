const { makeConfig } = require('@anansi/webpack-config');

const generateConfig = makeConfig({
  basePath: 'src',
  serverDir: 'dist',
  babelLoader: {
    rootMode: 'upward',
  },
  pkg: require('./package.json'),
});

module.exports = (env, argv) => {
  const config = generateConfig(env, argv);
  if (!config.experiments) config.experiments = {};
  config.experiments.backCompat = false;

  config.entry = {
    server: {
      import: './src/index.server.ts',
      library: {
        type: 'commonjs2',
      },
    },
    client: {
      import: './src/index.ts',
      library: {
        type: 'commonjs2',
      },
    },
  };
  return config;
};
