// Library mode: configure output for library bundles.
export function applyLibrary(config, options) {
  const { pkg, library } = options;
  config.output ||= {};
  const libraryConfig =
    library && typeof library === 'object' ? library : { type: undefined };
  config.output.library = {
    type: libraryConfig.type ?? pkg?.type ?? 'commonjs',
  };
  config.tools ||= {};
  const prev = config.tools.rspack;
  config.tools.rspack = (rspackConfig, utils) => {
    if (typeof prev === 'function') prev(rspackConfig, utils);
    else if (prev && typeof prev === 'object')
      Object.assign(rspackConfig, prev);
    rspackConfig.devtool = 'inline-source-map';
    return rspackConfig;
  };
  return config;
}
