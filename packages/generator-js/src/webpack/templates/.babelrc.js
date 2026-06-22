module.exports = {
  presets: ['@anansi'<% if (features.includes('testing')) { %>, '@wyw-in-js'<% } %>],
  assumptions: {
    mutableTemplateObject: true,
    noClassCalls: true,
    noDocumentAll: true,
    objectRestNoSymbols: true,
    privateFieldsAsProperties: true,
    pureGetters: true,
    setClassMethods: true,
    setComputedProperties: true,
    setPublicClassFields: true,
    setSpreadProperties: true,
  },
};
