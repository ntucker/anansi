var globToRegExp = require('glob-to-regexp');
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
  loose,
  tsConfigPath,
  corejs
*/
function buildPreset(api, options = {}) {
  api.assertVersion(7);
  const env = api.env();
  const babelTargets = typeof api.targets === 'function' ? api.targets() : {};
  const supportsModules = api.caller(
    caller => caller && caller.supportsStaticESM,
  );
  const babelNode = api.caller(
    caller => caller && caller.name === '@babel/node',
  );
  // babel cli will have no caller information, so in this case we should be aware and
  // possibly default to different options
  // (no caller info: https://github.com/babel/babel/issues/8930)
  const babelCli = api.caller(caller => caller && caller.name === '@babel/cli');
  // webpack and jest sends on context about this specific build target
  const callerTarget = api.caller(caller => caller && caller.target);
  const nodeTarget =
    callerTarget === 'node'
      ? // default to current or use node config set
        (babelTargets && babelTargets.node) || 'current'
      : callerTarget === undefined
      ? // infer based on babel target if caller doesn't send anything
        babelTargets && babelTargets.node
      : // if caller is not targetting node, we should ensure nodeTarget is not set
        undefined;
  const hasJsxRuntime = Boolean(
    api.caller(
      caller => (!!caller && caller.hasJsxRuntime) || options.hasJsxRuntime,
    ),
  );

  const explicitNodeTarget = !!options.nodeTarget;

  options = {
    minify: false,
    typing: false,
    rootPathSuffix: './src',
    rootPathPrefix: '~/',
    reactRequire: !hasJsxRuntime,
    useBuiltIns: 'entry',
    hotReloader: false,
    reactConstantElementsOptions: {},
    nodeTarget,
    resolver: { root: [], alias: {} },
    runtimePkg: '@babel/runtime',
    ...options,
  };
  const shouldHotReload =
    !babelNode &&
    !options.nodeTarget &&
    callerCouldTargetWeb(callerTarget) &&
    process.env.NO_HOT_RELOAD !== 'true' &&
    process.env.NO_HOT_RELOAD !== true &&
    api.caller(caller => !caller || !caller.noHotReload) &&
    !['commonjs', 'cjs'].includes(options.modules);

  const modules =
    // cli won't say what it supports; but we assume if they are calling without a tool they are
    // trying to make ESM
    (options.nodeTarget || babelNode) && !babelCli
      ? options.modules !== undefined
        ? options.modules
        : supportsModules
        ? false
        : 'auto'
      : // if supportsModules is undefined or true then assume it can handle es modules.
      options.modules !== undefined
      ? options.modules
      : supportsModules === false
      ? 'auto'
      : false;

  let absoluteRuntimePath = undefined;
  let runtimeVersion = undefined;

  if (!options.corejs) {
    try {
      const corejsVersion = require('core-js/package.json').version;
      if (corejsVersion) {
        options.corejs = { version: corejsVersion, proposals: true };
      }
    } catch (e) {
      options.corejs = { version: 3, proposals: true };
    }
  }

  let runtimeCoreJS = false;
  let runtimePkg = '@babel/runtime';
  try {
    if (options.runtimePkg === '@babel/runtime')
      require.resolve(`${options.runtimePkg}/package.json`);
  } catch (e) {
    // if we can't find default of @babel/runtime, fallback to something else
    options.runtimePkg = `@babel/runtime-corejs3`;
  }
  if (
    options.corejs &&
    options.corejs.version &&
    options.runtimePkg !== '@babel/runtime'
  ) {
    runtimeCoreJS = Math.floor(parseFloat(options.corejs.version));
    runtimePkg = `@babel/runtime-corejs${runtimeCoreJS}`;
  }

  try {
    // TODO: investigate if using this is useful in @babel/plugin-transform-runtime
    absoluteRuntimePath = path.dirname(
      require.resolve(`${runtimePkg}/package.json`),
    );
    runtimeVersion = require(`${runtimePkg}/package.json`).version;
  } catch (e) {
    runtimePkg = '@babel/runtime';
    runtimeCoreJS = false;
    try {
      absoluteRuntimePath = path.dirname(
        require.resolve(`${runtimePkg}/package.json`),
      );
      runtimeVersion = require(`${runtimePkg}/package.json`).version;
    } catch (e) {}
  }

  if (process.env.TS_CONFIG_PATH) {
    options.tsConfigPath = process.env.TS_CONFIG_PATH;
  }
  if (options.tsConfigPath) {
    let readTsConfig;
    try {
      readTsConfig = require('@anansi/ts-utils').readTsConfig;
    } catch (e) {
      throw new Error('tsConfigPath set, but typescript module not found');
    }
    const { dir, base } = path.parse(options.tsConfigPath);
    const tsconfig =
      base !== '.' && base !== '..'
        ? readTsConfig(dir, base)
        : readTsConfig(dir);
    if (tsconfig.options.paths) {
      for (const k in tsconfig.options.paths) {
        const key = globToRegExp(k).toString().replace('.*', '(.*)');
        options.resolver.alias[key.substring(1, key.length - 1)] =
          './' + tsconfig.options.paths[k][0].replace('*', '\\1');
      }
      options.resolver.root = [path.resolve(tsconfig.options.baseUrl)];
      options.resolver.root = [
        ...(tsconfig.options.baseUrl ? [tsconfig.options.baseUrl] : []),
        ...(tsconfig.options.rootDir
          ? [tsconfig.options.rootDir]
          : tsconfig.options.rootDirs || []),
        ...options.resolver.root,
      ];
    }
  }
  options.resolver.extensions = [
    '.ts',
    '.tsx',
    '.mts',
    '.mtsx',
    '.cts',
    '.js',
    '.jsx',
    '.es',
    '.es6',
    '.mjs',
    '.cjs',
  ];
  options.resolver.alias = {
    ...options.resolver.alias,
    ...((process.env.RESOLVER_ALIAS &&
      JSON.parse(process.env.RESOLVER_ALIAS)) ||
      options.resolverAlias),
  };
  options.resolver.root = [
    ...options.resolver.root,
    ...(process.env.RESOLVER_ROOT
      ? [process.env.RESOLVER_ROOT]
      : options.resolverRoot || []),
  ];

  const preset = {
    presets: [
      [
        require('@babel/preset-react').default,
        {
          development: env !== 'production',
          ...(hasJsxRuntime
            ? { runtime: 'automatic' }
            : { runtime: 'classic', useSpread: true }),
        },
      ],
    ],
    plugins: [
      (Object.keys(options.resolver.alias).length ||
        Object.keys(options.resolver.root).length ||
        Object.keys(options.resolver).length > 2) && [
        require('babel-plugin-module-resolver').default,
        options.resolver,
      ],
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
            corejs: runtimeCoreJS,
            helpers: true,
            regenerator: true,
            version: runtimeVersion,
          },
        ],
      //stage 1
      options.typing !== 'typescript' &&
        require('@babel/plugin-proposal-export-default-from').default,
      require('@babel/plugin-proposal-export-namespace-from').default,
      // stage 2
      [
        require('@babel/plugin-proposal-record-and-tuple').default,
        {
          importPolyfill: true,
          syntaxType: 'hash',
        },
      ],
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
  // import.meta.url doesn't work in commonjs
  if (modules !== false && supportsModules === false) {
    preset.plugins.unshift(
      require('babel-plugin-transform-import-meta').default,
    );
  }

  switch (env) {
    case 'production':
      if (!hasJsxRuntime) {
        // new jsx runtime obsoletes this optimization
        preset.plugins.unshift(
          require('@babel/plugin-transform-react-inline-elements').default,
        );
      }
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
      if (!shouldHotReload) break;
      try {
        if (options.hotReloader) {
          preset.plugins.push(require('react-hot-loader/babel'));
        } else {
          preset.plugins.push(require('react-refresh/babel'));
        }
      } catch (e) {}
      break;
  }

  // only helps if tree shaking happens
  if (supportsModules && env === 'production') {
    // only use these plugins if their respective library is installed
    try {
      require.resolve('ramda');
      preset.plugins.unshift(require('babel-plugin-ramda').default);
    } catch (e) {}
    try {
      require.resolve('lodash');
      preset.plugins.unshift(require('babel-plugin-lodash'));
    } catch (e) {}
  }

  let envOptions = {};
  if (babelNode || env === 'test' || explicitNodeTarget) {
    envOptions = {
      targets: {
        node: options.nodeTarget || 'current',
      },
      // maximum compatibility since we don't care about bundle size
      useBuiltIns: 'usage',
    };
  } else {
    envOptions = {
      targets: options.targets,
      useBuiltIns: options.useBuiltIns,
    };
  }
  preset.presets.unshift([
    require('@babel/preset-env').default,
    {
      bugfixes: true,
      modules,
      shippedProposals: true,
      corejs: options.corejs,
      loose: options.loose,
      // Exclude transforms that make all code slower
      exclude: ['transform-typeof-symbol'],
      ...envOptions,
    },
  ]);
  if (options.minify && env === 'production') {
    try {
      preset.presets.unshift(require('babel-minify'));
    } catch (e) {
      console.log('Minify enabled, but babel-minify not installed.');
    }
  }

  /*  block is at the end so they are unshifted to the start of plugins  */
  preset.plugins.unshift(require('babel-plugin-macros'));

  if (
    typeof options.decoratorsOptions !== 'object' &&
    options.decoratorsOptions !== undefined
  ) {
    throw new Error('decoratorsOptions must be an Object');
  }
  const decoratorsOptions = options.decoratorsOptions || {
    version: options.loose ? 'legacy' : '2018-09',
  };
  if (decoratorsOptions.version !== 'legacy') {
    decoratorsOptions.decoratorsBeforeExport = true;
  }

  const classPropertiesOptions = { loose: options.loose };
  const classPlugins = [
    // stage 3, but must come before class-properties
    [require('@babel/plugin-proposal-decorators').default, decoratorsOptions],
    // this is included in preset-env, but must come before class-properties
    require('@babel/plugin-proposal-class-static-block').default,
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
    const transformTypeScript =
      require('@babel/plugin-transform-typescript').default;
    const pluginOptions = isTSX => ({
      isTSX,
      allowDeclareFields: true,
      allowNamespaces: true,
      optimizeConstEnums: true,
    });
    preset.overrides = [
      {
        test: /\.(m|c)?ts$/,
        plugins: [[transformTypeScript, pluginOptions(false)], ...classPlugins],
      },
      {
        test: /\.(m|c)?tsx$/,
        plugins: [[transformTypeScript, pluginOptions(true)], ...classPlugins],
      },
      {
        test: /\.(m|c)?(js|jsx)$/,
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

function callerCouldTargetWeb(target) {
  // without a target set, we don't explicitly know what its attempting
  if (target === undefined) return true;
  if (Array.isArray(target)) {
    return target.some(callerCouldTargetWeb);
  }
  // based on https://webpack.js.org/configuration/target/
  return (
    ['web', 'webworker', 'browserslist'].includes(target) ||
    target.startsWith('es')
  );
}
