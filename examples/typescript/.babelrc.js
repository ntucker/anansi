module.exports = {
  presets: [['@anansi', { loose: true, reactCompiler: {} }]],
  assumptions: {
    noDocumentAll: true,
    noClassCalls: true,
    constantReexports: true,
    objectRestNoSymbols: true,
    pureGetters: true,
  },
};
