const { resolvePath } = require('babel-plugin-module-resolver');

module.exports = function (api) {
  api.cache.using(
    () =>
      process.env.NODE_ENV +
      process.env.BROWSERSLIST_ENV +
      process.env.BABEL_MODULE,
  );
  return {
    presets: [
      [
        '@anansi',
        {
          typing: 'typescript',
          loose: true,
          resolver: {
            extensions: [
              '.ts',
              '.tsx',
              '.cts',
              '.js',
              '.jsx',
              '.es',
              '.es6',
              '.mjs',
            ],
            resolvePath(sourcePath, currentFile, opts) {
              if (
                process.env.NODE_ENV === 'test' &&
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
          },
        },
      ],
    ],
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
