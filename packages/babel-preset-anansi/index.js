var globToRegExp = require('glob-to-regexp');
const path = require('path');

/*
options:
  targets,
  nodeTarget,
  modules,
  useESModules,
  polyfillMethod,
  corejsVersion,
  useBuiltIns,
  corejs,
  minify,
  loose,
  tsConfigPath,
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
  const isLinaria = api.caller(
    caller => caller && ['wyw-in-js', 'linaria'].includes(caller.name),
  );
  let library = api.caller(caller => caller && caller.library);
  if (library === undefined)
    library = api.caller(caller =>
      (
        caller &&
        ['rollup-plugin-babel', '@rollup/plugin-babel'].includes(caller.name)
      ) ?
        true
      : false,
    );
  // babel cli will have no caller information, so in this case we should be aware and
  // possibly default to different options
  // (no caller info: https://github.com/babel/babel/issues/8930)
  const babelCli = api.caller(caller => caller && caller.name === '@babel/cli');
  // webpack and jest sends on context about this specific build target
  const callerTarget = api.caller(caller => caller && caller.target);
  const nodeTarget =
    callerTarget === 'node' ?
      // default to current or use node config set
      (babelTargets && babelTargets.node) || 'current'
    : callerTarget === undefined ?
      // infer based on babel target if caller doesn't send anything
      babelTargets && babelTargets.node
      // if caller is not targetting node, we should ensure nodeTarget is not set
    : undefined;
  const hasJsxRuntime = Boolean(
    api.caller(
      caller =>
        // default to true - only allow overrides of false
        ((!!caller && caller.hasJsxRuntime) || options.hasJsxRuntime) !== false,
    ),
  );

  const explicitNodeTarget = !!options.nodeTarget;

  options = {
    minify: false,
    rootPathSuffix: './src',
    rootPathPrefix: '~/',
    reactRequire: !hasJsxRuntime,
    reactConstantElementsOptions: {},
    nodeTarget,
    resolver: { root: [], alias: {} },
    ...options,
  };
  if (process.env.BABEL_MODULES) {
    options.modules = process.env.BABEL_MODULES;
  }
  if (api.caller(caller => caller && caller.polyfillMethod) !== undefined) {
    options.polyfillMethod = api.caller(caller => caller.polyfillMethod);
  }
  if (process.env.BABEL_POLYFILL_METHOD !== undefined) {
    options.polyfillMethod = process.env.BABEL_POLYFILL_METHOD;
  }
  const shouldHotReload =
    !babelNode &&
    !options.nodeTarget &&
    !isLinaria &&
    callerCouldTargetWeb(callerTarget) &&
    process.env.NO_HOT_RELOAD !== 'true' &&
    process.env.NO_HOT_RELOAD !== true &&
    api.caller(caller => !caller || !caller.noHotReload) &&
    !['commonjs', 'cjs'].includes(options.modules);

  const modules =
    // cli won't say what it supports; but we assume if they are calling without a tool they are
    // trying to make ESM
    (options.nodeTarget || babelNode) && !babelCli ?
      options.modules !== undefined ? options.modules
      : supportsModules ? false
      : 'auto'
      // if supportsModules is undefined or true then assume it can handle es modules.
    : options.modules !== undefined ? options.modules
    : supportsModules === false ? 'auto'
    : false;

  let absoluteRuntimePath = undefined;
  let runtimeVersion = undefined;
  let corejsVersion = undefined;
  let corejsVersionPure = undefined;

  try {
    corejsVersion = require('core-js/package.json')
      .version.split('.')
      .slice(0, 2)
      .join('.');
  } catch (e) {}
  try {
    corejsVersionPure = require('core-js-pure/package.json')
      .version.split('.')
      .slice(0, 2)
      .join('.');
  } catch (e) {}

  // 'auto' polyfillMethod (represented by undefined)
  // figure out what polyfillMethod we should use
  if (options.polyfillMethod === undefined) {
    options.polyfillMethod = getPolyfillMethodAuto(
      options,
      babelCli || library,
      corejsVersion,
      corejsVersionPure,
    );
  }

  let runtimePkg =
    options.runtimePkg ||
    (options.polyfillMethod === 'usage-pure' ?
      '@babel/runtime-corejs3'
    : '@babel/runtime');

  if (
    // we don't care about bundle size, so maximum compatibility is no runtime transform (runtimeVersion is undefined)
    !(babelNode || env === 'test')
  ) {
    // select possible runtime transform
    try {
      // TODO: investigate if using this is useful in @babel/plugin-transform-runtime
      absoluteRuntimePath = path.dirname(
        require.resolve(`${runtimePkg}/package.json`),
      );
      runtimeVersion = require(`${runtimePkg}/package.json`).version;
    } catch (e) {
      runtimePkg = '@babel/runtime';
      try {
        absoluteRuntimePath = path.dirname(
          require.resolve(`${runtimePkg}/package.json`),
        );
        runtimeVersion = require(`${runtimePkg}/package.json`).version;
      } catch (e) {}
    }
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
      base !== '.' && base !== '..' ?
        readTsConfig(dir, base)
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
        ...(tsconfig.options.rootDir ?
          [tsconfig.options.rootDir]
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
    '.ctsx',
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
    ...(process.env.RESOLVER_ROOT ?
      [process.env.RESOLVER_ROOT]
    : options.resolverRoot || []),
  ];
  const envOptions = getEnvOptions(
    babelNode,
    env,
    explicitNodeTarget,
    callerTarget,
    options,
    modules,
  );
  const polyfillTargets =
    process.env.POLYFILL_TARGETS ||
    options.polyfillTargets ||
    envOptions.targets;
  const preset = {
    presets: [
      [
        require('@babel/preset-react').default,
        {
          development:
            env === 'development' || (env !== 'production' && !hasJsxRuntime),
          ...(hasJsxRuntime ?
            { runtime: 'automatic' }
          : { runtime: 'classic', useSpread: true }),
        },
      ],
    ],
    plugins: [
      (Object.keys(options.resolver.alias).length ||
        options.resolver.root.length ||
        Object.keys(options.resolver).length > 3) && [
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
            helpers: true,
            moduleName: options.runtimePkg && runtimePkg,
            version: runtimeVersion,
            useESModules: !options.nodeTarget && modules === false,
          },
        ],
      options.polyfillMethod !== false && [
        require('babel-plugin-polyfill-corejs3').default,
        {
          method: options.polyfillMethod,
          targets: polyfillTargets,
          exclude: ['es.array.push', 'es.array.unshift'],
          version:
            options.polyfillMethod === 'usage-pure' ?
              corejsVersionPure
            : corejsVersion,
        },
      ],

      // stage 2
      [
        require('@babel/plugin-proposal-record-and-tuple').default,
        {
          importPolyfill: true,
          syntaxType: 'hash',
        },
      ],
    ],
  };
  preset.plugins = preset.plugins.filter(v => v);
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
      break;
    case 'development':
      if (!shouldHotReload) break;
      try {
        preset.plugins.push(require('react-refresh/babel'));
      } catch (e) {}
      break;
  }

  preset.presets.unshift([require('@babel/preset-env').default, envOptions]);

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
    version: '2023-05',
  };
  if (decoratorsOptions.version === '2018-09') {
    decoratorsOptions.decoratorsBeforeExport = true;
  }

  const classPlugins = [
    // stage 3, but must come before class-properties when legacy is used (see block below)
    [require('@babel/plugin-proposal-decorators').default, decoratorsOptions],
  ];

  // compatibility (see: https://babeljs.io/docs/babel-plugin-proposal-decorators#note-compatibility-with-babelplugin-transform-class-properties)
  if (decoratorsOptions.version === 'legacy') {
    const classPropertiesOptions = { loose: options.loose };
    classPlugins.push([
      // this is included in preset-env, but must come before class-properties
      require('@babel/plugin-transform-class-static-block').default,
      // stage 3 but must come before flow
      [
        require('@babel/plugin-transform-class-properties').default,
        classPropertiesOptions,
      ],
      // this is included in preset-env, but must come after typescript, and after other class transforms
      [
        require('@babel/plugin-transform-private-methods').default,
        { loose: options.loose },
      ],
    ]);
  }

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
      plugins: [
        //stage 1
        // this is included in the typescript plugin, but we want to provide for js too
        require('@babel/plugin-proposal-export-default-from').default,
        ...classPlugins,
      ],
    },
  ];
  if (env === 'production') {
    // only add to js files as typescript won't use react prop types
    preset.overrides[2].plugins.unshift(
      require('babel-plugin-transform-react-remove-prop-types').default,
    );
  }

  if (options.reactCompiler && env === 'production') {
    preset.plugins.unshift([
      require('babel-plugin-react-compiler'),
      options.reactCompiler,
    ]);
  }

  /*         end block        */
  return preset;
}

module.exports = buildPreset;

function getEnvOptions(
  babelNode,
  env,
  explicitNodeTarget,
  callerTarget,
  options,
  modules,
) {
  let envOptions = {};
  if (
    babelNode ||
    env === 'test' ||
    explicitNodeTarget ||
    callerTarget === 'node'
  ) {
    envOptions = {
      targets: {
        node: options.nodeTarget || 'current',
      },
    };
  } else {
    envOptions = {
      targets: options.targets,
    };
  }
  envOptions = {
    bugfixes: true,
    modules,
    shippedProposals: true,
    loose: options.loose,
    // Exclude transforms that make all code slower
    exclude: ['transform-typeof-symbol'],
    ...envOptions,
  };
  return envOptions;
}

function getPolyfillMethodAuto(
  options,
  isLibrary,
  corejsVersion,
  corejsVersionPure,
) {
  // support legacy option
  if (options.useBuiltIns !== undefined) {
    return {
      usage: 'usage-global',
      entry: 'entry-global',
      [false]: false,
    }[options.useBuiltIns];
  } else {
    if (corejsVersion !== undefined && !isLibrary) {
      if (corejsVersionPure !== undefined) {
        const cwd = process.cwd();
        try {
          const pkg = require(`${cwd}/package.json`);
          // when explicitly marked as dep, make pure a priority
          if (
            ('core-js-pure' in pkg.dependencies &&
              !('core-js' in pkg.dependencies)) ||
            ('core-js-pure' in pkg.peerDependencies &&
              !('core-js' in pkg.peerDependencies)) ||
            ('core-js-pure' in pkg.devDependencies &&
              !('core-js' in pkg.devDependencies))
          ) {
            return 'usage-pure';
          }
        } catch (e) {}
      }
      try {
        require.resolve('@babel/runtime/package.json');
        return 'usage-global';
      } catch (e) {
        return 'entry-global';
      }
    } else if (corejsVersionPure !== undefined) {
      try {
        require.resolve('@babel/runtime-corejs3/package.json');
        return 'usage-pure';
      } catch (e) {
        return false;
      }
    }
  }
  return false;
}

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
