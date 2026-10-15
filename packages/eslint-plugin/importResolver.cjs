// eslint-plugin-import loads resolvers by name from its own location, which
// can't reach our dependencies under Yarn PnP, so pass their paths there.
// Elsewhere keep the name, so consumers' `typescript: { project }` style
// settings merge into ours rather than adding a second resolver.
module.exports = function importResolver(name) {
  return process.versions.pnp ?
      require.resolve(`eslint-import-resolver-${name}`)
    : name;
};
