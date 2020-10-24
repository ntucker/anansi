const path = require('path');

/*
options:
  targets,
  nodeTarget,
  modules,
  useESModules,
  typing,
  useBuiltIns,
  corejs,
  minify,
  loose
*/
function buildPreset(api, options = {}) {
  const env = api.env();
  const supportsModules = api.caller(
    caller => caller && caller.supportsStaticESM,
  );
  const nodeTarget = api.caller(caller => caller && caller.target === 'node')
    ? 'current'
    : undefined;
  const hasJsxRuntime = Boolean(
    api.caller(
      caller => (!!caller && caller.hasJsxRuntime) || options.hasJsxRuntime,
    ),
  );
  options = {
    minify: false,
    typing: false,
    loose: false,
    rootPathSuffix: './src',
    rootPathPrefix: '~/',
    reactRequire: !hasJsxRuntime,
    useBuiltIns: 'entry',
    corejs: { version: 3, proposals: true },
    hotReloader: false,
    reactConstantElementsOptions: {},
    nodeTarget,
    ...options,
  };
  const modules =
    env === 'test' || options.nodeTarget
      ? options.modules || (supportsModules ? false : 'auto')
      : // if supportsModules is undefined or true then assume it can handle es modules.
        options.modules || (supportsModules === false ? 'auto' : false);
  // We should turn this on by default once the lowest version of Node LTS
  // supports ES Modules.
  const useESModules =
    options.useESModules === undefined
      ? !(env === 'test' || options.nodeTarget)
      : options.useESModules;

  let absoluteRuntimePath = undefined;
  let runtimeVersion = undefined;
  try {
    // TODO: investigate if using this is useful in @babel/plugin-transform-runtime
    absoluteRuntimePath = path.dirname(
      require.resolve('@babel/runtime/package.json'),
    );
    runtimeVersion = require('@babel/runtime/package.json').version;
  } catch (e) {}

  const preset = {
    presets: [
      [
        require('@babel/preset-react').default,
        {
          development: env !== 'production',
          ...(hasJsxRuntime
            ? { runtime: 'automatic' }
            : { runtime: 'classic', useSpread: true, pragma: '__jsx' }),
        },
      ],
    ],
    plugins: [
      [
        require('babel-plugin-root-import').default,
        {
          root: process.env.ROOT_PATH_ROOT || options.rootPathRoot,
          rootPathSuffix:
            process.env.ROOT_PATH_SUFFIX || options.rootPathSuffix,
          rootPathPrefix:
            process.env.ROOT_PATH_PREFIX || options.rootPathPrefix,
        },
      ],
      absoluteRuntimePath &&
        runtimeVersion && [
          require('@babel/plugin-transform-runtime').default,
          {
            corejs: false,
            helpers: true,
            regenerator: true,
            useESModules,
            version: require('@babel/runtime/package.json').version,
          },
        ],
      //stage 1
      options.typing !== 'typescript' &&
        require('@babel/plugin-proposal-export-default-from').default,
      require('@babel/plugin-proposal-export-namespace-from').default,
      //stage 3
      require('@babel/plugin-syntax-top-level-await').default,
      // Get "Module parse failed: Unexpected token" when targetting newer browsers without this
      require('@babel/plugin-proposal-optional-chaining').default,
    ],
  };
  preset.plugins = preset.plugins.filter(v => v);
  if (options.reactRequire && !hasJsxRuntime) {
    preset.plugins.unshift(require('babel-plugin-react-require').default);
  }

  switch (env) {
    case 'production':
      preset.plugins.unshift(
        require('@babel/plugin-transform-react-inline-elements').default,
      );
      if (typeof options.reactConstantElementsOptions === 'object') {
        preset.plugins.unshift([
          require('@babel/plugin-transform-react-constant-elements').default,
          options.reactConstantElementsOptions,
        ]);
      }
      // for compile performance, don't include this if they are using typing language instead of proptypes
      if (!options.typing) {
        preset.plugins.unshift(
          require('babel-plugin-transform-react-remove-prop-types').default,
        );
      }
      break;
    case 'development':
      try {
        if (options.hotReloader) {
          preset.plugins.push(require('react-hot-loader/babel'));
        } else {
          preset.plugins.push(require('react-refresh/babel'));
        }
      } catch (e) {}
      break;
  }

  if (!options.nodeTarget && env === 'production') {
    preset.plugins.unshift(
      require('babel-plugin-ramda').default,
      require('babel-plugin-lodash'),
    );
  }

  if (env === 'test' || options.nodeTarget) {
    preset.presets.unshift([
      require('@babel/preset-env').default,
      {
        targets: {
          node: options.nodeTarget || 'current',
        },
        bugfixes: true,
        modules,
        // maximum compatibility since we don't care about bundle size
        useBuiltIns: false,
      },
    ]);
  } else {
    preset.presets.unshift([
      require('@babel/preset-env').default,
      {
        targets: options.targets,
        bugfixes: true,
        modules,
        useBuiltIns: options.useBuiltIns,
        corejs: options.corejs,
        loose: options.loose,
        // Exclude transforms that make all code slower
        exclude: ['transform-typeof-symbol'],
      },
    ]);
  }
  if (options.minify && env === 'production') {
    try {
      preset.presets.unshift(require('babel-minify'));
    } catch (e) {
      console.log('Minify enabled, but babel-minify not installed.');
    }
  }

  /*  block is at the end so they are unshifted to the start of plugins  */
  preset.plugins.unshift(require('babel-plugin-macros'));
  const decoratorsOptions = {
    legacy: options.loose,
  };
  if (!options.loose) {
    decoratorsOptions.decoratorsBeforeExport = true;
  }
  const classPropertiesOptions = { loose: options.loose };
  const classPlugins = [
    // must come before all other class plugins
    require('@babel/plugin-proposal-class-static-block').default,
    // stage 3, but must come before class-properties
    [require('@babel/plugin-proposal-decorators').default, decoratorsOptions],
    // stage 3 but must come before flow
    [
      require('@babel/plugin-proposal-class-properties').default,
      classPropertiesOptions,
    ],
    // stage 3, but must come after typescript, and after other class transforms
    [
      require('@babel/plugin-proposal-private-methods').default,
      { loose: options.loose },
    ],
  ];
  if (options.typing === 'typescript') {
    // using plugin so it can be placed before class transforms
    const transformTypeScript = require('@babel/plugin-transform-typescript')
      .default;
    const pluginOptions = isTSX => ({
      isTSX,
      allowDeclareFields: true,
      allowNamespaces: true,
    });
    preset.overrides = [
      {
        test: /\.ts$/,
        plugins: [[transformTypeScript, pluginOptions(false)], ...classPlugins],
      },
      {
        test: /\.tsx$/,
        plugins: [[transformTypeScript, pluginOptions(true)], ...classPlugins],
      },
      {
        test: /\.(js|jsx)$/,
        plugins: classPlugins,
      },
    ];
  } else {
    if (options.typing === 'flow') {
      // using the plugin so we can place after decorators and class properties
      preset.plugins.unshift(
        require('@babel/plugin-transform-flow-strip-types').default,
      );
    }
    preset.plugins.unshift(...classPlugins);
  }
  /*         end block        */
  return preset;
}

module.exports = buildPreset;
