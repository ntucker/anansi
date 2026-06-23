module.exports = {
  presets: [['@anansi', { reactCompiler: {} }]],
  assumptions: {
    noDocumentAll: true,
    noClassCalls: true,
    constantReexports: true,
    objectRestNoSymbols: true,
    pureGetters: true,
  },
};
