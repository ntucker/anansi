const { makeConfig } = require('@anansi/webpack-config');


const options = {
  libraryInclude: /node_modules\/(@anansi\/)/,
  libraryExclude: /node_modules(?!\/(@anansi\/))/,
  basePath: 'src',
  buildDir: 'generated_assets/',
};

module.exports = makeConfig(options);
