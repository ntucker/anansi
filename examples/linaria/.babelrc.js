module.exports = {
  presets: [['@anansi', { loose: true }]],
  assumptions: {
    noDocumentAll: true,
    noClassCalls: true,
    constantReexports: true,
    objectRestNoSymbols: true,
    pureGetters: true,
  },
};
