const path = require('path');
const { makeConfig } = require('@anansi/webpack-config');

const generateConfig = makeConfig({
  basePath: 'src',
  buildDir: 'dist/',
  fontPreload: 'prefetch',
  libraryInclude: /(@pojo-router\/core|@anansi\/router)/,
  babelLoader: {
    rootMode: 'upward',
  },
});

module.exports = (env, argv) => {
  const config = generateConfig(env, argv);
  if (!config.experiments) config.experiments = {};
  config.experiments.backCompat = false;
  return config;
};
