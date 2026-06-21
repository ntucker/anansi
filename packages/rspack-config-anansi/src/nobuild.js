// nobuild mode: validate the config without producing output.
export function applyNobuild(config) {
  config.output ||= {};
  config.output.distPath = { root: '/tmp/anansi-build' };
  config.splitChunks = false;
  config.tools ||= {};
  const prev = config.tools.rspack;
  config.tools.rspack = (rspackConfig, utils) => {
    if (typeof prev === 'function') prev(rspackConfig, utils);
    else if (prev && typeof prev === 'object')
      Object.assign(rspackConfig, prev);
    rspackConfig.bail = true;
    rspackConfig.optimization ||= {};
    rspackConfig.optimization.removeAvailableModules = false;
    rspackConfig.optimization.removeEmptyChunks = false;
    rspackConfig.optimization.splitChunks = false;
    return rspackConfig;
  };
  config.performance ||= {};
  config.performance.printFileSize = false;
  return config;
}
