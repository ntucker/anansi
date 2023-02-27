const { makeConfig } = require('@anansi/webpack-config');

const generateConfig = makeConfig({
  basePath: 'src',
  buildDir: 'dist',
  serverDir: 'dist',
  babelLoader: {
    rootMode: 'upward',
  },
  library: {
    type: 'commonjs2',
  },
  // we have to explicitly disable linaria since we have it installed in the monorepo
  linariaOptions: false,
});

module.exports = (env, argv) => {
  const config = generateConfig(env, argv);
  if (!config.experiments) config.experiments = {};
  config.experiments.backCompat = false;

  config.entry = {
    server: {
      import: './src/index.server.js',
      library: {
        type: 'commonjs2',
      },
    },
    client: {
      import: './src/index.js',
      library: {
        type: 'commonjs2',
      },
    },
  };
  return config;
};
