// Jest's default resolver handles Yarn PnP, but its not-found errors there
// lack `code`, which breaks code probing for optional modules
module.exports = function resolver(request, options) {
  try {
    return options.defaultResolver(request, options);
  } catch (error) {
    error.code ??= 'MODULE_NOT_FOUND';
    throw error;
  }
};
