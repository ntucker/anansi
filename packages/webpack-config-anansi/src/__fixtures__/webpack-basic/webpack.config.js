const { makeConfig } = require('../../../src/index');

const fixtureRoot = __dirname;

// Wrap makeConfig to inject entrypath into env
const baseConfig = makeConfig({
  rootPath: fixtureRoot,
  basePath: 'src',
  buildDir: 'dist',
  tsconfigPathsOptions: false,
  babelLoader: {
    rootMode: 'upward',
  },
});

module.exports = (env = {}, argv) => {
  // Set explicit entry path relative to rootPath with full extension
  const envWithEntry = {
    ...env,
    entrypath: env.entrypath || './src/index.js',
  };
  return baseConfig(envWithEntry, argv);
};
