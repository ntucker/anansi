const { makeConfig } = require('../../../lib/index');

module.exports = makeConfig({
  basePath: 'src',
  buildDir: 'dist',
  tsconfigPathsOptions: false,
});

