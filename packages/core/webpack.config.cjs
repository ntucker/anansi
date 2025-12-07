const { makeConfig } = require('@anansi/webpack-config');
const nodeExternals = require('webpack-node-externals');

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
  inJSOptions: false,
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
  };
  config.externals = [
    nodeExternals({
      allowlist: [/@babel\/runtime/],
      additionalModuleDirs: ['../../node_modules'],
    }),
  ];
  return config;
};
