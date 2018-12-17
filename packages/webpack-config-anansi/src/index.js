import makeBaseConfig from './base'
import makeDevConfig from './dev'
import makeProdConfig from './prod'


export * from './base'
export makeStorybookConfigGenerator from './storybook'

export function makeConfig(options) {
  const baseConfig = makeBaseConfig(options)
  return (env, argv) => {
    switch (argv.mode) {
      case 'development':
        return makeDevConfig(baseConfig, options)
      case 'production':
        return makeProdConfig(baseConfig, options)
      default:
        return baseConfig
    }
  }
}
