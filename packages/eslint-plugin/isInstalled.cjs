module.exports = function isInstalled(pkgName) {
  try {
    return require.resolve(pkgName);
  } catch {
    return false;
  }
};
