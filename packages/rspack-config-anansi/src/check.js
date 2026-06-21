// Adds CircularDependencyRspackPlugin (rspack-native) and Rsdoctor for
// duplicate-package analysis. Rsdoctor is loaded only when installed, so
// projects that don't depend on it can still use the check feature.
export function applyCheck(config, { libraryExclude, check }) {
  const failOnError = check === 'nobuild';

  config.tools ||= {};
  const prev = config.tools.rspack;
  config.tools.rspack = (rspackConfig, utils) => {
    if (typeof prev === 'function') prev(rspackConfig, utils);
    else if (prev && typeof prev === 'object')
      Object.assign(rspackConfig, prev);
    rspackConfig.plugins ||= [];

    const { rspack } = utils;
    if (rspack?.CircularDependencyRspackPlugin) {
      rspackConfig.plugins.push(
        new rspack.CircularDependencyRspackPlugin({
          exclude: libraryExclude || /node_modules/,
          failOnError,
        }),
      );
    }

    try {
      const { RsdoctorRspackPlugin } = require('@rsdoctor/rspack-plugin');
      rspackConfig.plugins.push(
        new RsdoctorRspackPlugin({
          mode: 'normal',
          features: ['plugins', 'bundle'],
          // Surface duplicate-package warnings prominently.
          linter: {
            rules: {
              'duplicate-package': failOnError ? 'Error' : 'Warn',
            },
          },
        }),
      );
    } catch {
      // Rsdoctor is optional.
    }

    return rspackConfig;
  };

  return config;
}
