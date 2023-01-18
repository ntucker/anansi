import { always } from 'ramda';
import webpack from 'webpack';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';

import makeBaseConfig, { ROOT_PATH } from './base';
import makeCheckConfig from './check';
import makeDevConfig from './dev';
import makeNobuildConfig from './nobuild';
import makeNodeConfig from './node';
import makeProdConfig from './prod';

export * from './base';
export { default as makeStorybookConfigGenerator } from './storybook';

export function makeConfig(options) {
  return (env, argv) => {
    if (argv?.mode && !process.env.NODE_ENV) process.env.NODE_ENV = argv?.mode;
    // eslint-disable-next-line no-param-reassign
    options = {
      rootPath: ROOT_PATH,
      basePath: 'src',
      babelRoot: '',
      globalStyleDir: 'style',
      libraryInclude: always(false),
      libraryExclude: /node_modules/,
      buildDir: 'generated_assets/',
      serverDir: 'server_assets/',
      manifestFilename: 'manifest.json',
      extraJsLoaders: [],
      cssExtractOptions: {},
      ...options,
      mode: argv?.mode || process.env.NODE_ENV,
      nohash:
        env?.nohash ??
        env?.analyze ??
        (process.env.WEBPACK_ANALYZE === 'true' ||
          process.env.WEBPACK_ANALYZE === true),
      argv,
      env,
      isStackblitz: Object.prototype.hasOwnProperty.call(
        process.versions,
        'webcontainer',
      ),
    };
    // option validation done here
    if ('sassOptions' in options && options.sassOptions === undefined) {
      throw new Error(
        'Undefined is not a valid option for sassOptions. To disable use `false`',
      );
    }
    if ('htmlOptions' in options && options.htmlOptions === undefined) {
      throw new Error(
        'Undefined is not a valid option for htmlOptions. To disable use `false`',
      );
    }
    if ('svgoOptions' in options && options.svgoOptions === undefined) {
      throw new Error(
        'Undefined is not a valid option for svgoOptions. To disable use `false`',
      );
    }
    if ('svgrOptions' in options && options.svgrOptions === undefined) {
      throw new Error(
        'Undefined is not a valid option for svgrOptions. To disable use `false`',
      );
    }
    if ('linariaOptions' in options && options.linariaOptions === undefined) {
      throw new Error(
        'Undefined is not a valid option for linariaOptions. To disable use `false`',
      );
    }
    if (
      'tsconfigPathsOptions' in options &&
      options.tsconfigPathsOptions === undefined
    ) {
      throw new Error(
        'Undefined is not a valid option for tsconfigPathsOptions. To disable use `false`',
      );
    }
    if ('globalStyleDir' in options && options.globalStyleDir === undefined) {
      throw new Error(
        'Undefined is not a valid option for globalStyleDir. To disable use `false`',
      );
    }
    // defaults
    options.svgoOptions = {
      plugins: [
        {
          name: 'preset-default',
          params: {
            overrides: {
              removeTitle: false,
              removeViewBox: false,
              convertShapeToPath: false,
            },
          },
        },
        'removeComments',
        'removeDesc',
        'removeUselessDefs',
        'removeDoctype',
        'removeMetadata',
        'convertColors',
        'prefixIds',
      ],
      ...options.svgoOptions,
    };

    const baseConfig = makeBaseConfig(options);

    let config;
    if (env?.check === 'nobuild') {
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
    if (argv?.target?.includes?.('node')) {
      config = makeNodeConfig(config, options);
    } else {
      config.plugins.push(
        new webpack.EnvironmentPlugin({
          NODE_DEBUG: false,
          DEBUG: false,
        }),
        new webpack.ProvidePlugin({
          Buffer: require.resolve('buffer'),
          process: require.resolve('process/browser.js'),
        }),
      );
    }
    if (env?.check) {
      config = makeCheckConfig(config, options, env?.check);
    }
    if (
      env?.analyze ||
      process.env.WEBPACK_ANALYZE === 'true' ||
      process.env.WEBPACK_ANALYZE === true
    ) {
      config.plugins.push(
        new BundleAnalyzerPlugin({
          analyzerMode: 'static',
          generateStatsFile: false,
          defaultSizes: 'gzip',
          ...options.bundleAnalyzerOptions,
        }),
      );
      delete config.output.globalObject;
    }
    return config;
  };
}
