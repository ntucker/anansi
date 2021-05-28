import errorOverlayMiddleware from 'react-dev-utils/errorOverlayMiddleware';

export default class ErrorOverlayPlugin {
  apply(compiler) {
    const className = this.constructor.name;

    if (compiler.options.mode !== 'development') return;

    const devServerEnabled = !!compiler.options.devServer;
    const sockOptions = {};
    if (devServerEnabled) {
      sockOptions.sockHost = compiler.options.devServer.sockHost;
      sockOptions.sockPath = compiler.options.devServer.sockPath;
      sockOptions.sockPort = compiler.options.devServer.sockPort;
    }

    compiler.hooks.afterResolvers.tap(className, ({ options }) => {
      if (devServerEnabled) {
        const originalBefore = options.devServer.before;
        options.devServer.before = (app, server) => {
          if (originalBefore) {
            originalBefore(app, server, compiler);
          }
          app.use(errorOverlayMiddleware());
        };
      }
    });
  }
}
