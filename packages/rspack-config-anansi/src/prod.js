import semver from 'semver';

// Production-mode tweaks: split-chunks cache groups (matches the React /
// polyfill / styles groups from @anansi/webpack-config), font preload, and
// the DevTools IgnorePlugin.
export function applyProd(config, options) {
  const { rootPath, globalStyleDir, fontPreload, profile, nohash, target } =
    options;
  const isNodeTarget = target === 'node';

  if (isNodeTarget) {
    return config;
  }

  config.output ||= {};
  config.output.cleanDistPath = true;

  // splitChunks: replicate webpack-config-anansi's cacheGroups via the
  // top-level Rsbuild splitChunks API. Use preset 'none' so we control
  // the groups entirely.
  config.splitChunks = {
    preset: 'default',
    chunks: 'async',
    maxInitialRequests: 30,
    maxAsyncRequests: 30,
    cacheGroups: {
      polyfill: {
        test: /[\\/]node_modules[\\/](core-js|core-js-pure|@babel\/runtime|@babel\/runtime-corejs3|regenerator-runtime|ric-shim|babel-runtime)[\\/].*/,
        name: 'polyfill',
        chunks: 'all',
      },
      styles: {
        test:
          globalStyleDir ?
            new RegExp(`${globalStyleDir}/.*\\.scss$`)
          : /\\bnever-match-anything\\b/,
        name: 'style',
        type: 'css/mini-extract',
        chunks: 'all',
      },
    },
  };
  if (nohash) {
    config.performance ||= {};
    config.performance.chunkIds = 'named';
  }

  // Font preload / prefetch via Rsbuild's performance hooks
  if (fontPreload) {
    if (!['preload', 'prefetch'].includes(fontPreload))
      throw new Error(
        `fontPreload: '${fontPreload}' is not valid.\nUse 'preload' or 'prefetch'`,
      );
    config.performance ||= {};
    config.performance[fontPreload] = {
      type: 'all-assets',
      include: /\.(otf|woff2|woff|ttf|eot)$/,
    };
  }

  // Profile mode: alias react-dom to react-dom/profiling
  if (profile) {
    let reactClient = 'react-dom/client$';
    const reactVersion = getReactVersion(rootPath);
    if (reactVersion && semver.lt(reactVersion, '19.0.0')) {
      reactClient = 'react-dom$';
    }
    config.resolve ||= {};
    config.resolve.alias = {
      ...config.resolve.alias,
      [reactClient]: 'react-dom/profiling',
      'scheduler/tracing': 'scheduler/tracing-profiling',
    };
  }

  // Bail on first error to avoid wasting CI cycles
  config.tools ||= {};
  const prevRspack = config.tools.rspack;
  config.tools.rspack = (rspackConfig, utils) => {
    if (typeof prevRspack === 'function') {
      prevRspack(rspackConfig, utils);
    } else if (prevRspack && typeof prevRspack === 'object') {
      Object.assign(rspackConfig, prevRspack);
    }
    if (utils.env === 'production') {
      rspackConfig.bail = true;
      // IgnorePlugin replacement — strip /DevTools/ resources from the bundle
      const { rspack } = utils;
      if (rspack?.IgnorePlugin) {
        rspackConfig.plugins ||= [];
        rspackConfig.plugins.push(
          new rspack.IgnorePlugin({ resourceRegExp: /DevTools/ }),
        );
      }
    }
    return rspackConfig;
  };

  return config;
}

function getReactVersion(rootPath) {
  try {
    const react = require(
      require.resolve('react', {
        paths: [rootPath],
      }),
    );
    return react ? react.version : null;
  } catch {
    return null;
  }
}
