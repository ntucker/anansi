import makeDevConfig from './dev'
import makeProdConfig from './prod'


export default function makeStorybookConfigGenerator(baseConfig, { basePath }) {
  return (storybookConfig, env) => {
    let envConfig
    switch (env) {
      case 'PRODUCTION':
        envConfig = makeProdConfig(baseConfig, { basePath })
        break
      default:
        envConfig = makeDevConfig(baseConfig, { basePath })
    }
    // we need their HtmlWebpackPlugin only (https://github.com/storybooks/storybook/pull/1775/files)
    const storybookPlugins = storybookConfig.plugins.filter(
      plugin => plugin.constructor.name === 'HtmlWebpackPlugin',
    )
    // don't check for circular dependencies
    const basePlugins = envConfig.plugins.filter(
      plugin => plugin.constructor.name !== 'CircularDependencyPlugin',
    )
    return {
      ...envConfig,
      entry: storybookConfig.entry,
      output: storybookConfig.output,
      plugins: [...storybookPlugins, ...basePlugins],
      module: {
        ...envConfig.module,
        rules: [...storybookConfig.module.rules.slice(0, 1), ...envConfig.module.rules],
      },
    }
  }
}
