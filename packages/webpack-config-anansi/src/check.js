import DuplicatePackageCheckerPlugin from 'duplicate-package-checker-webpack-plugin';
import CircularDependencyPlugin from 'circular-dependency-plugin';


export default function makeCheckConfig(baseConfig, { libraryExclude }) {
  const config = { ...baseConfig };
  // TODO: don't have it actually replace files
  baseConfig.plugins.unshift(
    new DuplicatePackageCheckerPlugin(),
    new CircularDependencyPlugin({
      // exclude detection of files based on a RegExp
      exclude: libraryExclude,
      // add errors to webpack instead of warnings
      failOnError: false,
    }),
  );
  return config;
}
