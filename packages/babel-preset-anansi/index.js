/*
options:
  targets,
  nodeTarget,
  modules,
  typing,
  minify,
  legacyDecorators
*/
function buildPreset(context, options = {}) {
  const env = context.env();
  options = {
    minify: false,
    typing: false,
    legacyDecorators: false,
    rootPathSuffix: './src',
    reactRequire: true,
    ...options,
  };
  const preset = {
    presets: [
      [
        require('@babel/preset-react').default,
        { development: env !== 'production', useBuiltIns: true },
      ],
    ],
    plugins: [
      [
        require('babel-plugin-root-import').default,
        {
          rootPathSuffix: options.rootPathSuffix,
        },
      ],
      //stage 1
      require('@babel/plugin-proposal-export-default-from').default,
      require('@babel/plugin-proposal-export-namespace-from').default,
      require('@babel/plugin-proposal-optional-chaining').default,
      require('@babel/plugin-proposal-nullish-coalescing-operator').default,
      //stage 3
      require('@babel/plugin-syntax-dynamic-import').default,
      [
        require('@babel/plugin-proposal-private-methods').default,
        { loose: options.legacyDecorators },
      ],
    ],
  };
  if (options.reactRequire) {
    preset.plugins.unshift(require('babel-plugin-react-require').default);
  }

  switch (env) {
    case 'production':
      preset.plugins.unshift(
        require('@babel/plugin-transform-react-inline-elements').default,
        //require('@babel/plugin-transform-react-constant-elements').default, #disabling due to breakage https://github.com/babel/babel/issues/8310
        require('babel-plugin-transform-react-remove-prop-types').default,
      );
      break;
    case 'development':
      try {
        preset.plugins.push(require('react-hot-loader/babel'));
      } catch(e) {}
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
      },
    ]);
    preset.plugins.push(require('babel-plugin-dynamic-import-node'));
  } else {
    preset.presets.unshift([
      require('@babel/preset-env').default,
      {
        targets: options.targets,
        corejs: { version: 3, proposals: true },
        useBuiltIns: 'usage',
        modules: options.modules || false,
      },
    ]);
  }
  if (options.minify && env === 'production') {
    preset.presets.unshift(require('babel-minify'));
  }

  /*  block is at the end so they are unshifted to the start of plugins  */
  switch (options.typing) {
    case 'flow':
      // using the plugin so we can place after decorators and class properties
      preset.plugins.unshift(
        require('@babel/plugin-transform-flow-strip-types').default,
      );
      break;
    case 'typescript':
      preset.presets.push(require('@babel/preset-typescript').default);
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
    // stage 2 but must come before flow
    [
      require('@babel/plugin-proposal-class-properties').default,
      { loose: options.legacyDecorators },
    ],
  );
  // this must come before class properties the prop types are transformed
  if (options.typing === 'flow' && env === 'development') {
    preset.plugins.unshift(require('babel-plugin-flow-react-proptypes'));
  }
  /*         end block        */
  return preset;
}

module.exports = buildPreset;
