module.exports = {
  presets: ['@anansi'<% if (features.includes('testing')) { %>, '@wyw-in-js'<% } %>],
};
