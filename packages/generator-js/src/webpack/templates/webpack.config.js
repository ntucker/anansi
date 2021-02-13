const { makeConfig } = require('@anansi/webpack-config');

const options = {
  basePath: '<%= rootPath %>',
  buildDir: '<%= assetPath %>/',
  htmlOptions: { title: '<%= appName %>' },
  <% if (style === 'sass') { %>
  sassResources: [`${__dirname}/src/style/export.scss`],
  <% } else if (style === 'linaria') { %>
  extraJsLoaders: [
    {
      loader: '@linaria/webpack-loader',
      options: {
        sourceMap: true,
      },
    }
  ]
  <% } %>
};

const generateConfig = makeConfig(options);

module.exports = (env, argv) => {
  const config = generateConfig(env, argv);
  return config;
};

module.exports.options = options;
