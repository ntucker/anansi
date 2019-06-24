const { makeStorybookConfigGenerator } = require('@anansi/webpack-config');
const { options } = require('../webpack.config');

module.exports = makeStorybookConfigGenerator(options);
