import { always } from 'ramda';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';

import makeBaseConfig from './base';
import makeDevConfig from './dev';
import makeProdConfig from './prod';
import makeCheckConfig from './check';
import makeNobuildConfig from './nobuild';


export * from './base';
export makeStorybookConfigGenerator from './storybook';

export function makeConfig(options) {
  // eslint-disable-next-line no-param-reassign
  options = Object.assign(
    {
      basePath: 'src',
      libraryInclude: always(false),
      libraryExclude: /node_modules/,
      buildDir: 'generated_assets/',
    },
    options,
  );
  const baseConfig = makeBaseConfig(options);
  return (env, argv) => {
    if (!process.env.NODE_ENV) {
      process.env.NODE_ENV = argv?.mode;
    }
    let config;
    if (argv?.check === 'nobuild') {
      config = makeNobuildConfig(baseConfig, options);
    } else {
      switch (argv?.mode || process.env.NODE_ENV) {
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
    if (argv?.check) {
      config = makeCheckConfig(config, options, argv?.check);
    }
    if (argv?.analyze || process.env.WEBPACK_ANALYZE === 'true') {
      config.plugins.push(
        new BundleAnalyzerPlugin({
          analyzerMode: 'static',
          generateStatsFile: false,
        }),
      );
    }
    return config;
  };
}
