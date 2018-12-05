var env = process.env.BABEL_ENV || process.env.NODE_ENV

// options: targets, developmentTargets, productionTargets, additionalProductionTargets, modules, runInNode, typing, minify
function buildPreset(context, options = {}) {
  options = Object.assign(
    { runInNode: false, minify: false, typing: false },
    options,
  )
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

  if (!options.runInNode && env === 'production') {
    preset.plugins.unshift(
      require('babel-plugin-ramda').default,
      require('babel-plugin-lodash').default,
    )
  }

  if (env === 'test' || options.runInNode) {
    preset.plugins.push(
      require('@babel/plugin-proposal-object-rest-spread').default,
    )
    preset.presets.unshift([
      require('@babel/preset-env').default,
      {
        targets: {
          node: 'current',
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
      } else {
        targets = options.productionTargets || {
          browsers: [
            'last 2 versions',
            'not < 0.05%',
            'not ie < 11',
            'not op_mini all',
          ].concat(
            (options.additionalProductionTargets &&
              options.additionalProductionTargets.browsers) ||
              [],
          ),
          ...options.additionalProductionTargets,
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
