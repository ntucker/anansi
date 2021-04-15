module.exports = function (api) {
  api.cache.using(() => process.env.NODE_ENV);
  return {
    presets: [
      [
        '@anansi',
        {
          typing: 'typescript',
          loose: true,
          nodeTarget: '10.13.0',
        },
      ],
    ],
    // allows us to load .babelrc in addition to this
    babelrcRoots: ['packages/*', 'examples/*'],
  };
};
