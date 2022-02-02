module.exports = function (api) {
  api.cache.using(() => process.env.NODE_ENV);
  return {
    // TODO: grab this from current package.json engine target
    targets: { node: '12.13.0' },
    presets: [
      [
        '@anansi',
        {
          typing: 'typescript',
          loose: true,
        },
      ],
    ],
    // allows us to load .babelrc in addition to this
    babelrcRoots: ['packages/*', 'examples/*'],
  };
};
