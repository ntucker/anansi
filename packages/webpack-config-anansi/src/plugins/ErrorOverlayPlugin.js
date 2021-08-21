import errorOverlayMiddleware from 'react-dev-utils/errorOverlayMiddleware';

export default class ErrorOverlayPlugin {
  apply(compiler) {
    const className = this.constructor.name;

    if (compiler.options.mode !== 'development') return;

    const devServerEnabled = !!compiler.options.devServer;
    const sockOptions = {};
    if (devServerEnabled) {
      sockOptions.sockHost =
        compiler.options.devServer?.client?.webSocketURL?.hostname;
      sockOptions.sockPath =
        compiler.options.devServer?.client?.webSocketURL?.pathname;
      sockOptions.sockPort =
        compiler.options.devServer?.client?.webSocketURL?.port;
    }

    compiler.hooks.afterResolvers.tap(className, ({ options }) => {
      if (devServerEnabled) {
        const originalBefore = options.devServer.onBeforeSetupMiddleware;
        options.devServer.onBeforeSetupMiddleware = devServer => {
          if (originalBefore) {
            originalBefore(devServer);
          }
          devServer.app.use(errorOverlayMiddleware());
        };
      }
    });
  }
}
