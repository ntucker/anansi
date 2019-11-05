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
  legacyDecorators
*/
function buildPreset(api, options = {}) {
  const env = api.env();
  // if undefined, we know nothing about their support
  const supportsDynamicImport = api.caller(
    caller => caller && caller.supportsDynamicImport,
  );
  const supportsModules = api.caller(
    caller => caller && caller.supportsStaticESM,
  );
  options = {
    minify: false,
    typing: false,
    legacyDecorators: false,
    rootPathSuffix: './src',
    rootPathPrefix: '~/',
    reactRequire: true,
    useBuiltIns: 'entry',
    corejs: { version: 3, proposals: true },
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
          useSpread: true,
        },
      ],
    ],
    plugins: [
      [
        require('babel-plugin-root-import').default,
        {
          rootPathSuffix: options.rootPathSuffix,
          rootPathPrefix: options.rootPathPrefix,
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
            version: '7.7.1',
          },
        ],
      //stage 1
      options.typing !== 'typescript' &&
        require('@babel/plugin-proposal-export-default-from').default,
      options.typing !== 'typescript' &&
        require('@babel/plugin-proposal-export-namespace-from').default,
      //stage 3
      require('@babel/plugin-syntax-top-level-await').default,
      require('@babel/plugin-proposal-optional-chaining').default,
      require('@babel/plugin-proposal-nullish-coalescing-operator').default,
      require('@babel/plugin-syntax-dynamic-import').default,
      [
        require('@babel/plugin-proposal-private-methods').default,
        { loose: options.legacyDecorators },
      ],
    ],
  };
  preset.plugins = preset.plugins.filter(v => v);
  if (options.reactRequire) {
    preset.plugins.unshift(require('babel-plugin-react-require').default);
  }

  switch (env) {
    case 'production':
      preset.plugins.unshift(
        require('@babel/plugin-transform-react-inline-elements').default,
        //require('@babel/plugin-transform-react-constant-elements').default, #disabling due to breakage https://github.com/babel/babel/issues/8310
      );
      // for compile performance, don't include this if they are using typing language instead of proptypes
      if (!options.typing) {
        preset.plugins.unshift(
          require('babel-plugin-transform-react-remove-prop-types').default,
        );
      }
      break;
    case 'development':
      try {
        preset.plugins.push(require('react-hot-loader/babel'));
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
        modules,
        // maximum compatibility since we don't care about bundle size
        useBuiltIns: false,
      },
    ]);
    // since this is a node-specific plugin we need to be sure we're running in node
    if (supportsDynamicImport !== true) {
      preset.plugins.push(require('babel-plugin-dynamic-import-node'));
    }
  } else {
    preset.presets.unshift([
      require('@babel/preset-env').default,
      {
        targets: options.targets,
        modules,
        useBuiltIns: options.useBuiltIns,
        corejs: options.corejs,
        loose: options.legacyDecorators,
      },
    ]);
  }
  if (options.minify && env === 'production') {
    preset.presets.unshift(require('babel-minify'));
  }

  /*  block is at the end so they are unshifted to the start of plugins  */
  preset.plugins.unshift(require('babel-plugin-macros'));
  switch (options.typing) {
    case 'flow':
      // using the plugin so we can place after decorators and class properties
      preset.plugins.unshift(
        require('@babel/plugin-transform-flow-strip-types').default,
      );
      break;
    case 'typescript':
      preset.presets.push([
        require('@babel/preset-typescript').default,
        {
          allowDeclareFields: true,
        },
      ]);
      break;
  }
  const decoratorsOptions = {
    legacy: options.legacyDecorators,
  };
  if (!options.legacyDecorators) {
    decoratorsOptions.decoratorsBeforeExport = true;
  }
  preset.plugins.unshift(
    // stage 3, but must come before class-properties
    [require('@babel/plugin-proposal-decorators').default, decoratorsOptions],
    // stage 3 but must come before flow
    [
      require('@babel/plugin-proposal-class-properties').default,
      { loose: options.legacyDecorators },
    ],
  );
  /*         end block        */
  return preset;
}

module.exports = buildPreset;
