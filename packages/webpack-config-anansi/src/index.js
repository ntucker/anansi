import { always } from 'ramda';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';

import makeBaseConfig, { ROOT_PATH } from './base';
import makeDevConfig from './dev';
import makeProdConfig from './prod';
import makeCheckConfig from './check';
import makeNobuildConfig from './nobuild';
import makeNodeConfig from './node';

export * from './base';
export makeStorybookConfigGenerator from './storybook';

export function makeConfig(options) {
  return (env, argv) => {
    if (!process.env.NODE_ENV) {
      process.env.NODE_ENV = argv?.mode;
    }
    // eslint-disable-next-line no-param-reassign
    options = {
      rootPath: ROOT_PATH,
      basePath: 'src',
      libraryInclude: always(false),
      libraryExclude: /node_modules/,
      buildDir: 'generated_assets/',
      serverDir: 'server_assets/',
      hardCacheOptions: {},
      ...options,
      mode: argv?.mode || process.env.NODE_ENV,
    };
    const baseConfig = makeBaseConfig(options);

    let config;
    if (argv?.check === 'nobuild') {
      config = makeNobuildConfig(baseConfig, options);
    } else {
      switch (options.mode) {
        case 'development':
          config = makeDevConfig(baseConfig, options);
          break;
        case 'production':
          config = makeProdConfig(baseConfig, options);
          break;
        default:
          config = baseConfig;
          break;
      }
    }
    if (argv?.target === 'node') {
      config = makeNodeConfig(config, options);
    }
    if (argv?.check) {
      config = makeCheckConfig(config, options, argv?.check);
    }
    if (argv?.analyze || process.env.WEBPACK_ANALYZE === 'true') {
      config.plugins.push(
        new BundleAnalyzerPlugin({
          analyzerMode: 'static',
          generateStatsFile: false,
          ...options.bundleAnalyzerOptions,
        }),
      );
      delete config.output.globalObject;
    }
    return config;
  };
}
