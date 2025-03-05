import { Filter, legacyCreateProxyMiddleware } from 'http-proxy-middleware';
import {
  RequestHandler,
  ProxyConfigArray,
  Response,
  Request,
  NextFunction,
  ProxyConfigArrayItem,
} from 'webpack-dev-server';

// Essentially taken from https://github.com/webpack/webpack-dev-server/blob/3096148746c906105c4424352f5b5ad1bff0fd4f/lib/Server.js#L2099
// we just removed the 'bypass' deprecation warnings and converted to typescript
export default function getProxyMiddlewares(proxyConfig: ProxyConfigArray) {
  const middlewares: any[] = [];

  const getProxyMiddleware = (
    proxyConfig: ProxyConfigArrayItem,
  ): RequestHandler | undefined => {
    // It is possible to use the `bypass` method without a `target` or `router`.
    // However, the proxy middleware has no use in this case, and will fail to instantiate.
    if (proxyConfig.target) {
      const context: Filter = proxyConfig.context || (proxyConfig.path as any);

      return legacyCreateProxyMiddleware(context, proxyConfig);
    }

    if (proxyConfig.router) {
      return legacyCreateProxyMiddleware(proxyConfig);
    }
  };

  /**
   * Assume a proxy configuration specified as:
   * proxy: [
   *   {
   *     context: "value",
   *     ...options,
   *   },
   *   // or:
   *   function() {
   *     return {
   *       context: "context",
   *       ...options,
   *     };
   *   }
   * ]
   */
  proxyConfig.forEach(proxyConfigOrCallback => {
    let proxyMiddleware: RequestHandler | undefined;

    let proxyConfig =
      typeof proxyConfigOrCallback === 'function' ?
        proxyConfigOrCallback()
      : proxyConfigOrCallback;

    proxyMiddleware = getProxyMiddleware(proxyConfig);

    /* TODO: figure out how to make this work
    if (proxyConfig.ws) {
      this.webSocketProxies.push(proxyMiddleware);
    }
    */

    const handler = async (req: Request, res: Response, next: NextFunction) => {
      if (typeof proxyConfigOrCallback === 'function') {
        const newProxyConfig = proxyConfigOrCallback(req, res, next);

        if (newProxyConfig !== proxyConfig) {
          proxyConfig = newProxyConfig;

          const socket = req.socket != null ? req.socket : req.connection;
          const server = socket != null ? (socket as any).server : null;

          if (server) {
            server.removeAllListeners('close');
          }

          proxyMiddleware = getProxyMiddleware(proxyConfig);
        }
      }

      if (proxyMiddleware) {
        return proxyMiddleware(req, res, next);
      } else {
        next();
      }
    };

    middlewares.push({
      name: 'http-proxy-middleware',
      middleware: handler,
    });

    // Also forward error requests to the proxy so it can handle them.
    middlewares.push({
      name: 'http-proxy-middleware-error-handler',
      middleware: (
        error: Error,
        req: Request,
        res: Response,
        next: NextFunction,
      ) => handler(req, res, next),
    });
  });

  return middlewares;
}
