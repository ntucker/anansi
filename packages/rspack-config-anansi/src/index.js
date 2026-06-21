import { pluginBabel } from '@rsbuild/plugin-babel';
import { pluginNodePolyfill } from '@rsbuild/plugin-node-polyfill';
import { pluginReact } from '@rsbuild/plugin-react';
import { pluginSass } from '@rsbuild/plugin-sass';
import { pluginSvgr } from '@rsbuild/plugin-svgr';
import { always } from 'ramda';

import { generateBabelOptions } from './babel';
import { makeBase, ROOT_PATH } from './base';
import { applyCheck } from './check';
import { buildCssOptions } from './css';
import { applyDev } from './dev';
import { applyLibrary } from './library';
import { applyNobuild } from './nobuild';
import { applyNode } from './node';
import { applyProd } from './prod';
import { buildWywChain } from './wyw';

export { ROOT_PATH };
export { default as makeStorybookRsbuildConfig } from './storybook';

const DEFAULT_OPTIONS = {
  basePath: 'src',
  babelRoot: '',
  globalStyleDir: 'style',
  buildDir: 'generated_assets/',
  serverDir: 'server_assets/',
  manifestFilename: 'manifest.json',
  libraryInclude: always(false),
  libraryExclude: /node_modules/,
};

export function makeConfig(userOptions = {}) {
  const options = {
    rootPath: ROOT_PATH,
    ...DEFAULT_OPTIONS,
    ...userOptions,
  };
  const mode = options.mode ?? process.env.NODE_ENV ?? 'production';
  options.mode = mode;
  const isAnalyze =
    options.analyze ??
    (process.env.RSBUILD_ANALYZE === 'true' ||
      process.env.WEBPACK_ANALYZE === 'true');
  options.analyze = isAnalyze;
  options.nohash = options.nohash ?? isAnalyze;
  options.target =
    options.target ?? normalizeTarget(process.env.RSBUILD_TARGET);
  options.profile = options.profile ?? process.env.RSBUILD_PROFILE === 'true';
  options.check = options.check ?? normalizeCheck(process.env.RSBUILD_CHECK);

  validateOptions(options);
  applySvgoDefaults(options);

  // Build the base RsbuildConfig
  const config = makeBase(options);

  // Plugins (rsbuild plugins, not rspack plugins)
  const plugins = [];

  // Always add the Rspack-side react refresh + JSX runtime, but defer the
  // refresh transform to babel since we keep @anansi/babel-preset's pipeline.
  plugins.push(
    pluginReact({
      // Babel handles JSX and Fast Refresh injection; SWC just downlevels.
      // We still want the rspack runtime side of fast refresh so we keep
      // fastRefresh: true (which registers @rspack/plugin-react-refresh).
      fastRefresh: mode === 'development' && options.target !== 'node',
      swcReactOptions: {
        runtime: 'automatic',
        // SWC-side refresh would conflict with babel-side refresh markers
        refresh: false,
      },
    }),
  );

  // Babel pipeline (preserves @anansi/babel-preset, react-refresh/babel)
  const babelOptions = generateBabelOptions({
    rootPath: options.rootPath,
    babelRoot: options.babelRoot,
    target: options.target,
    mode,
    babelLoaderOptions: options.babelLoader,
    library: options.library,
  });
  plugins.push(
    pluginBabel({
      babelLoaderOptions: babelOptions,
      exclude: options.libraryExclude,
    }),
  );

  // Node polyfills for browser builds
  if (options.target !== 'node') {
    plugins.push(pluginNodePolyfill());
  }

  // SVGR with mixed-import support so existing
  // `import Url, { ReactComponent } from './x.svg'` keeps working.
  // Exclude CSS importers so SVGs referenced via `url(...)` in CSS go
  // through Rsbuild's default static-asset path (returns a plain URL string)
  // instead of the SVGR module shape, which css-loader stringifies as
  // `[object Module]`.
  if (options.svgrOptions !== false) {
    plugins.push(
      pluginSvgr({
        mixedImport: true,
        excludeImporter: /\.(s?css|less|stylus|wyw-in-js\.css)$/,
        svgrOptions: {
          exportType: 'named',
          svgoConfig: options.svgoOptions,
          ...options.svgrOptions,
        },
      }),
    );
    // SVG imports issued by css-loader (`url(...)` references from
    // wyw-in-js extracted CSS, regular CSS, etc.) carry a
    // `dependency: 'url'` marker. We add a high-priority oneOf that
    // catches those and emits them as a plain URL via `asset/resource`,
    // ensuring rspack exports a plain string rather than an ES module
    // namespace (which css-loader otherwise stringifies as
    // `[object Module]`).
    const prevChain = config.tools?.bundlerChain;
    config.tools = config.tools || {};
    config.tools.bundlerChain = async (chain, utils) => {
      if (typeof prevChain === 'function') await prevChain(chain, utils);
      const { CHAIN_ID } = utils;
      const svgRuleId = CHAIN_ID.RULE.SVG;
      if (svgRuleId && chain.module.rules.has(svgRuleId)) {
        const svgRule = chain.module.rule(svgRuleId);
        const oneOf = svgRule
          .oneOf('svg-css-url')
          .before(CHAIN_ID.ONE_OF.SVG_URL || 'svg-asset-url')
          .type('asset/resource')
          .set('generator', {
            filename: 'static/svg/[name].[contenthash:8].svg',
          });
        oneOf.dependency('url');
      }
    };
  }

  if (options.sassOptions !== false) {
    plugins.push(
      pluginSass({
        sassLoaderOptions: { sassOptions: options.sassOptions },
      }),
    );
  }

  if (Array.isArray(options.extraPlugins)) {
    plugins.push(...options.extraPlugins);
  }

  config.plugins = plugins;

  // CSS
  const cssOptions = buildCssOptions({
    cssModulesOptions: options.cssModulesOptions,
    cssExtractOptions: options.cssExtractOptions,
    mode,
  });
  config.tools = config.tools || {};
  Object.assign(config.tools, cssOptions.tools);
  config.output = {
    ...config.output,
    ...cssOptions.output,
    cssModules: {
      ...(config.output?.cssModules ?? {}),
      ...(cssOptions.output?.cssModules ?? {}),
    },
  };

  // Mode-specific
  if (mode === 'development') {
    applyDev(config, options);
  } else if (mode === 'production') {
    applyProd(config, options);
  }

  // Target-specific
  if (options.target === 'node') {
    applyNode(config, options);
  }

  // Library
  if (options.library) {
    applyLibrary(config, options);
  }

  // Check / nobuild
  if (options.check) {
    applyCheck(config, options);
  }
  if (options.check === 'nobuild') {
    applyNobuild(config);
  }

  // Wyw-in-js (Linaria) loader via tools.bundlerChain
  if (options.inJSOptions !== false) {
    const inJSOptions = options.inJSOptions ?? {
      sourceMap: mode !== 'production',
    };
    const wywChain = buildWywChain({
      inJSOptions,
      babelOptions: stripCacheKeys(babelOptions),
      hasBabel: true,
    });
    const prev = config.tools.bundlerChain;
    config.tools.bundlerChain = async (chain, utils) => {
      if (typeof prev === 'function') {
        await prev(chain, utils);
      }
      wywChain(chain, utils);
    };
  }

  // Sass-resources via tools.bundlerChain (sass-resources-loader is appended
  // after sass-loader in execution order, i.e. earlier in the chain).
  if (options.sassResources && options.sassOptions !== false) {
    const prevChain = config.tools.bundlerChain;
    config.tools.bundlerChain = async (chain, utils) => {
      if (typeof prevChain === 'function') await prevChain(chain, utils);
      const { CHAIN_ID } = utils;
      const sassRule = CHAIN_ID.RULE.SASS;
      if (sassRule && chain.module.rules.has(sassRule)) {
        chain.module
          .rule(sassRule)
          .use('sass-resources-loader')
          .loader(require.resolve('sass-resources-loader'))
          .options({
            resources: options.sassResources,
            hoistUseStatements: true,
          });
      }
    };
  }

  // Bundle analyzer when requested. Prefer Rsdoctor if installed, fall back
  // to webpack-bundle-analyzer registered via tools.rspack.
  if (isAnalyze) {
    const prev = config.tools.rspack;
    config.tools.rspack = (rspackConfig, utils) => {
      if (typeof prev === 'function') prev(rspackConfig, utils);
      else if (prev && typeof prev === 'object')
        Object.assign(rspackConfig, prev);
      rspackConfig.plugins ||= [];
      try {
        const { RsdoctorRspackPlugin } = require('@rsdoctor/rspack-plugin');
        rspackConfig.plugins.push(new RsdoctorRspackPlugin());
      } catch {
        try {
          const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
          rspackConfig.plugins.push(
            new BundleAnalyzerPlugin({
              analyzerMode: 'static',
              generateStatsFile: false,
              defaultSizes: 'gzip',
              ...options.bundleAnalyzerOptions,
            }),
          );
        } catch {
          console.warn(
            '[anansi/rspack-config] analyze requested but neither @rsdoctor/rspack-plugin nor webpack-bundle-analyzer is installed.',
          );
        }
      }
      return rspackConfig;
    };
  }

  return config;
}

function stripCacheKeys(opts) {
  const cleaned = { ...opts };
  delete cleaned.cacheDirectory;
  delete cleaned.cacheIdentifier;
  delete cleaned.cacheCompression;
  return cleaned;
}

function normalizeTarget(target) {
  return target === 'node' || target === 'web-worker' ? target : 'web';
}

function normalizeCheck(check) {
  if (check === 'true') return true;
  if (check === 'nobuild') return 'nobuild';
  return false;
}

function applySvgoDefaults(options) {
  // Note: In SVGO v4, removeTitle and removeViewBox are no longer part of
  // preset-default and are disabled by default, so we don't override them.
  options.svgoOptions = {
    plugins: [
      {
        name: 'preset-default',
        params: {
          overrides: {
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
}

function validateOptions(options) {
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
  if ('inJSOptions' in options && options.inJSOptions === undefined) {
    throw new Error(
      'Undefined is not a valid option for inJSOptions. To disable use `false`',
    );
  }
  if (
    'cssExtractOptions' in options &&
    options.cssExtractOptions === undefined
  ) {
    throw new Error(
      'Undefined is not a valid option for cssExtractOptions. To disable use `false`',
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
}
