module.exports = {
  presets: [['@anansi', { typing: 'typescript', loose: true }]],
  assumptions: {
    noDocumentAll: true,
    noClassCalls: true,
    constantReexports: true,
    objectRestNoSymbols: true,
    pureGetters: true,
  },
};
