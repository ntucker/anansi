import makeBaseConfig from './base';
import makeDevConfig from './dev';
import makeProdConfig from './prod';


export * from './base';
export makeStorybookConfigGenerator from './storybook';

export function makeConfig(options) {
  const baseConfig = makeBaseConfig(options);
  return (env, argv) => {
    if (!process.env.NODE_ENV) {
      process.env.NODE_ENV = argv?.mode;
    }
    switch (argv?.mode || process.env.NODE_ENV) {
      case 'development':
        return makeDevConfig(baseConfig, options);
      case 'production':
        return makeProdConfig(baseConfig, options);
      default:
        return baseConfig;
    }
  };
}
