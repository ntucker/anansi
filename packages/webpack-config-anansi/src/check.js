import CircularDependencyPlugin from 'circular-dependency-plugin';
import DuplicatePackageCheckerPlugin from 'duplicate-package-checker-webpack-plugin';

export default function makeCheckConfig(
  baseConfig,
  { libraryExclude },
  checkArg,
) {
  const config = { ...baseConfig };
  baseConfig.plugins.unshift(
    new DuplicatePackageCheckerPlugin(),
    new CircularDependencyPlugin({
      // searching external libraries for circles is pointless
      exclude: libraryExclude,
      failOnError: checkArg === 'nobuild',
    }),
  );
  return config;
}
