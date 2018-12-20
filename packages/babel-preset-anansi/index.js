/*
options:
  targets,
  nodeTarget,
  developmentTargets,
  modules,
  typing,
  minify
*/
function buildPreset(context, options = {}, env) {
  options = { minify: false, typing: false, ...options }
  const preset = {
    presets: [
      [
        require('@babel/preset-react').default,
        { development: env !== 'production' },
      ],
    ],
    plugins: [
      require('babel-plugin-react-require').default,
      require('babel-plugin-root-import').default,
      // stage 3, but must come before class-properties
      [
        require('@babel/plugin-proposal-decorators').default,
        { decoratorsBeforeExport: true },
      ],
      //stage 1
      require('@babel/plugin-proposal-export-default-from').default,
      require('@babel/plugin-proposal-export-namespace-from').default,
      require('@babel/plugin-proposal-optional-chaining').default,
      require('@babel/plugin-proposal-nullish-coalescing-operator').default,
      //stage 2
      require('@babel/plugin-proposal-class-properties').default,
      //stage 3
      require('@babel/plugin-syntax-dynamic-import').default,
      require('@babel/plugin-proposal-private-methods').default,
    ],
  }
  switch (options.typing) {
    case 'flow':
      preset.presets.push(require('@babel/preset-flow').default)
      if (env === 'development') {
        preset.plugins.unshift(require('babel-plugin-flow-react-proptypes'))
      }
      break
    case 'typescript':
      preset.presets.push(require('@babel/preset-typescript').default)
      break
  }
  switch (env) {
    case 'production':
      preset.plugins.unshift(
        require('@babel/plugin-transform-react-inline-elements').default,
        require('@babel/plugin-transform-react-constant-elements').default,
        require('babel-plugin-transform-react-remove-prop-types').default,
      )
      break
    case 'development':
      preset.plugins.unshift(require('react-hot-loader/babel'))
      break
  }

  if (!options.nodeTarget && env === 'production') {
    preset.plugins.unshift(
      require('babel-plugin-ramda').default,
      require('babel-plugin-lodash').default,
    )
  }

  if (env === 'test' || options.nodeTarget) {
    preset.presets.unshift([
      require('@babel/preset-env').default,
      {
        targets: {
          node: options.nodeTarget || 'current',
        },
      },
    ])
    preset.plugins.unshift(require('babel-plugin-dynamic-import-node'))
  } else {
    let targets = options.targets
    if (!targets) {
      if (env === 'development') {
        targets = options.developmentTargets || {
          browsers: ['last 1 Chrome versions', 'last 1 Firefox versions'],
        }
      }
    }
    preset.presets.unshift([
      require('@babel/preset-env').default,
      {
        targets,
        useBuiltIns: 'entry',
        modules: options.modules || false,
      },
    ])
  }
  if (options.minify && env === 'production') {
    preset.presets.unshift(require('babel-minify'))
  }
  return preset
}

module.exports = buildPreset
