const path = require('path');
const semver = require('semver');
var globToRegExp = require('glob-to-regexp');

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
  tsConfigPath
*/
function buildPreset(api, options = {}) {
  const env = api.env();
  const supportsModules = api.caller(
    caller => caller && caller.supportsStaticESM,
  );
  const babelNode = api.caller(
    caller => caller && caller.name === '@babel/node',
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
    resolver: { root: [], alias: {} },
    ...options,
  };
  const modules =
    env === 'test' || options.nodeTarget || babelNode
      ? options.modules || (supportsModules ? false : 'auto')
      : // if supportsModules is undefined or true then assume it can handle es modules.
        options.modules || (supportsModules === false ? 'auto' : false);

  const nodeSupportsModules = semver.gte(
    options.nodeTarget === 'current' || !options.nodeTarget
      ? process.version
      : semver.valid(semver.coerce(options.nodeTarget)),
    '14.0.0',
  );

  const useESModules =
    options.useESModules === undefined
      ? options.nodeTarget || babelNode
        ? nodeSupportsModules
        : true
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
        options.resolver.alias[key.substr(1, key.length - 2)] =
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
    '.ts.',
    '.tsx',
    '.js',
    '.jsx',
    '.es',
    '.es6',
    '.mjs',
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
        Object.keys(options.resolver.root).length) && [
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
      // hot reloading doesn't make sense when targetting node
      if (
        babelNode ||
        options.nodeTarget ||
        process.env.NO_HOT_RELOAD === 'true'
      )
        break;
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

  if (babelNode || env === 'test' || options.nodeTarget) {
    preset.presets.unshift([
      require('@babel/preset-env').default,
      {
        targets: {
          node: options.nodeTarget || 'current',
        },
        bugfixes: true,
        modules,
        // maximum compatibility since we don't care about bundle size
        useBuiltIns: 'usage',
        corejs: options.corejs,
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
    const transformTypeScript =
      require('@babel/plugin-transform-typescript').default;
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
