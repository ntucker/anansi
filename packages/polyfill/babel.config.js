module.exports = function(api) {
  api.cache(true);
  return {
    presets: [['@anansi/babel-preset', { typing: 'typescript' }]],
  };
};
