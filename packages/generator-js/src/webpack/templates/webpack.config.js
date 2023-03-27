const { makeConfig } = require('@anansi/webpack-config');

const options = {
  basePath: '<%= rootPath %>',
  buildDir: '<%= assetPath %>/',
  serverDir: '<%= serverPath %>/',
  <% if (!features.includes('SSR')) { %>
  htmlOptions: { title: '<%= appName %>', scriptLoading: 'defer', template: 'index.ejs' },<% } %>
  globalStyleDir: 'style',
  <% if (style === 'sass') { %>
  sassResources: [`${__dirname}/src/style/export.scss`],
  <% } %>
};

const generateConfig = makeConfig(options);

module.exports = (env, argv) => {
  const config = generateConfig(env, argv);
  if (!config.experiments) config.experiments = {};
  config.experiments.backCompat = false;

  return config;
};

module.exports.options = options;
