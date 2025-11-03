const { makeConfig } = require('../../../lib/index');

module.exports = makeConfig({
  basePath: 'src',
  buildDir: 'dist',
  // This fixture has tsconfig.json so tsconfigPathsOptions should work
  // tsconfigPathsOptions: false,
});

