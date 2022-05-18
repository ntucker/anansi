const { makeConfig } = require('@anansi/webpack-config');
const nodeExternals = require('webpack-node-externals');

const generateConfig = makeConfig({
  basePath: 'src',
  buildDir: 'dist/',
  serverDir: 'dist-server/',
  fontPreload: 'prefetch',
  libraryInclude: /(@pojo-router\/core|@anansi\/router)/,
  babelLoader: {
    rootMode: Object.prototype.hasOwnProperty.call(
      process.versions,
      'webcontainer',
    )
      ? 'root'
      : 'upward',
  },
});

module.exports = (env, argv) => {
  const config = generateConfig(env, argv);
  if (!config.experiments) config.experiments = {};
  config.experiments.backCompat = false;

  if (env.entrypoint) {
    config.entry = env.entrypoint;
  }
  if (env.name) {
    config.name = env.name;
  }

  return config;
};
