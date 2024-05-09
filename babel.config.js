const { resolvePath } = require('babel-plugin-module-resolver');

module.exports = function (api) {
  api.cache.using(() => process.env.NODE_ENV + process.env.BROWSERSLIST_ENV);
  const options = { loose: true };
  if (process.env.NODE_ENV === 'test') {
    options.resolver = {
      resolvePath(sourcePath, currentFile, opts) {
        if (
          sourcePath.startsWith('.') &&
          (sourcePath.endsWith('.js') || sourcePath.endsWith('.cjs'))
        ) {
          const removedExt = sourcePath.substring(
            0,
            sourcePath.lastIndexOf('.'),
          );
          return resolvePath(removedExt, currentFile, opts);
        }
      },
      root: [],
    };
  }
  return {
    presets: [['@anansi', options]],
    assumptions: {
      noDocumentAll: true,
      noClassCalls: true,
      constantReexports: true,
      objectRestNoSymbols: true,
      pureGetters: true,
    },
    // allows us to load .babelrc in addition to this
    babelrcRoots: ['packages/*', 'examples/*'],
  };
};
