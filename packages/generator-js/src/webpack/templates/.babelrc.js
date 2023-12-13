module.exports = {
  presets: [['@anansi', { typing: 'typescript' }]<% if (features.includes('testing')) { %>, '@wyw-in-js'<% } %>],
};
