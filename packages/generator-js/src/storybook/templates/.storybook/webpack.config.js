
const { makeStorybookConfigGenerator } = require('@anansi/webpack-config');

module.exports = makeStorybookConfigGenerator(require('../webpack.config'));
