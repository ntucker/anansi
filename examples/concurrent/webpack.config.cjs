const { makeConfig } = require('@anansi/webpack-config');
const nodeExternals = require('webpack-node-externals');

const generateConfig = makeConfig({
  basePath: 'src',
  buildDir: 'dist/',
  serverDir: 'dist-server/',
  fontPreload: 'prefetch',
  //libraryInclude: /(@pojo-router\/core|@anansi\/router)/,
  babelLoader: {
    rootMode: Object.prototype.hasOwnProperty.call(
      process.versions,
      'webcontainer')
      ? 'root'
      : 'upward',
  },
});

module.exports = (env, argv) => {
  const config = generateConfig(env, argv);
  if (!config.experiments) config.experiments = {};
  config.experiments.backCompat = false;

  if (argv?.target?.includes('node')) {
    config.externals = [
      nodeExternals({
        additionalModuleDirs: ['../../node_modules'],
        allowlist: [
          /*...(Object.prototype.hasOwnProperty.call(
            process.versions,
            'webcontainer',
          )
            ? [/^@anansi\/router/, /^@pojo-router\//]
            : []),*/
          ///^@anansi\/core\/server/,
          /^path-to-regexp/,
          /\.css$/,
        ],
      }),
    ];
  }

  return config;
};
