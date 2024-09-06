import PreloadWebpackPlugin from '@vue/preload-webpack-plugin';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import CssMinimizerPlugin from 'css-minimizer-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import TerserPlugin from 'terser-webpack-plugin';
import webpack from 'webpack';
//import CrittersPlugin from 'critters-webpack-plugin';
import RemoveEmptyScriptsPlugin from 'webpack-remove-empty-scripts';

import { getStyleRules } from './base';

export default function makeProdConfig(
  baseConfig,
  {
    rootPath,
    basePath,
    libraryInclude,
    libraryExclude,
    argv = {},
    env = {},
    htmlOptions = { title: '', scriptLoading: 'defer' },
    terserOptions,
    sassOptions,
    sassResources,
    cssModulesOptions,
    globalStyleDir,
    fontPreload,
    svgoOptions,
    nohash,
    cssExtractOptions,
  },
) {
  const config = { ...baseConfig };

  config.mode = 'production';
  config.bail = true; // this helps automatic build tools not waste time
  if (!argv?.target?.includes?.('node')) {
    config.plugins.push(
      new webpack.IgnorePlugin({ resourceRegExp: /DevTools/ }),
      new CleanWebpackPlugin(),
      new webpack.LoaderOptionsPlugin({
        minimize: true,
        debug: false,
      }),
      new RemoveEmptyScriptsPlugin(),
    );
    if (htmlOptions) {
      config.plugins.unshift(
        new HtmlWebpackPlugin(htmlOptions),
        //new CrittersPlugin({}),
        //new InlineChunkHtmlPlugin(HtmlWebpackPlugin, [/runtime-.+[.]js/]), this is a bad idea until CSP nonce can be added
      );
      if (fontPreload) {
        if (!['preload', 'prefetch'].includes(fontPreload))
          throw new Error(
            `fontPreload: '${fontPreload}' is not valid.\nUse 'preload' or 'prefetch'`,
          );
        config.plugins.unshift(
          new PreloadWebpackPlugin({
            rel: fontPreload,
            include: 'allAssets',
            fileWhitelist: [/\.(otf|woff|ttf)/],
            as,
          }),
        );
      }
    }
  }
  if (svgoOptions !== false) {
    config.module.rules.push({
      test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
      issuer: {
        not: [/\.(j|t)sx?$/],
      },
      enforce: 'pre',
      use: [
        {
          loader: require.resolve('svgo-loader'),
          options: svgoOptions,
        },
      ],
    });
  }
  config.optimization = {
    splitChunks: {
      chunks: 'async',
      maxInitialRequests: 30,
      maxAsyncRequests: 30,
      cacheGroups: {
        react: {
          test: /[\\/]node_modules[\\/](react|react-dom|scheduler|object-assign|loose-envify)[\\/]/,
          name: 'react',
          chunks: 'all',
        },
        polyfill: {
          test: /[\\/]node_modules[\\/](core-js|@babel\/runtime|regenerator-runtime|ric-shim|babel-runtime)[\\/].*/,
          name: 'polyfill',
          chunks: 'all',
        },
        styles: {
          test: new RegExp(`${globalStyleDir}/.*\\.scss$`),
          name: 'style',
          type: 'css/mini-extract',
          chunks: 'all',
        },
      },
    },
    // https://webpack.js.org/configuration/optimization/#optimizationruntimechunk
    runtimeChunk: {
      name: 'webpack-runtime',
    },
  };
  if (nohash) {
    config.optimization.chunkIds = 'named';
  }
  if (!env?.readable) {
    config.optimization.minimizer = [
      new TerserPlugin({
        terserOptions: {
          parse: {
            ecma: 9,
          },
          compress: {
            ecma: 6,
            warnings: false,
            // Pending further investigation:
            // https://github.com/mishoo/UglifyJS2/issues/2011
            comparisons: false,
            // Pending futher investigation:
            // https://github.com/terser-js/terser/issues/120
            inline: 2,
          },
          mangle: {
            safari10: true,
          },
          output: {
            ecma: 6,
            comments: false,
            ascii_only: true,
          },
          ...terserOptions,
          keep_classnames:
            !!env?.profile || (terserOptions?.keep_classnames ?? true),
          keep_fnames: !!env?.profile || terserOptions?.keep_fnames,
        },
        extractComments: true,
      }),
      // cssnano on node_modules as well as our loaders
      new CssMinimizerPlugin(),
    ];
  } else {
    config.optimization.minimize = false;
  }
  config.performance = {
    maxEntrypointSize: 300000,
    assetFilter(assetFilename) {
      return !/\.(map|LICENSE)$/.test(assetFilename);
    },
  };

  const styleRules = getStyleRules({
    rootPath,
    basePath,
    libraryInclude,
    libraryExclude,
    sassOptions,
    sassResources,
    cssModulesOptions,
    globalStyleDir,
    target: argv?.target,
    cssExtractOptions,
  });
  config.module.rules = [...config.module.rules, styleRules];

  if (env?.profile) {
    config.resolve.alias = {
      ...config?.resolve?.alias,
      'react-dom$': 'react-dom/profiling',
      'scheduler/tracing': 'scheduler/tracing-profiling',
    };
  }
  return config;
}

function as(entry) {
  if (/\.css$/.test(entry)) return 'style';
  if (/\.(otf|eot|woff2|woff|ttf)$/.test(entry)) return 'font';
  if (/\.(svg|apng|png|jpg|gif|ico|webp|avif|cur|ani)$/.test(entry))
    return 'image';
  return 'script';
}
