const { makeConfig } = require('@anansi/webpack-config');

const options = {
  basePath: '<%= rootPath %>',
  buildDir: '<%= assetPath %>/',
  htmlOptions: { title: '<%= appName %>' },
};

const generateConfig = makeConfig(options);


module.exports = (env, argv) => {
  const config = generateConfig(env, argv);
  return config;
};

module.exports.options = options;
