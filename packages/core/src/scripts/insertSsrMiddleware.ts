import type { NextFunction, Request, Response } from 'express';
import type { Middleware } from 'webpack-dev-server';

/**
 * Splices SSR into webpack-dev-server's middleware list right after its proxy
 * entries (or its own /webpack-dev-server routes when there are none), so
 * http-proxy-middleware takes its requests first. webpack-dev-middleware's
 * first entry serves bundles ahead of it; everything later (wds's repeated
 * dev-middleware, static files, history fallback) comes after.
 */
export function insertSsrMiddleware(
  middlewares: Middleware[],
  ssr: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => void | Promise<void>,
  publicPath?: string,
): void {
  const anchor = middlewares.findLastIndex(
    middleware =>
      typeof middleware === 'object' &&
      (middleware.name === 'webpack-dev-server-assets' ||
        middleware.name?.startsWith('http-proxy-middleware')),
  );
  if (anchor === -1) {
    throw new Error(
      'webpack-dev-server middlewares changed: no webpack-dev-server-assets or http-proxy-middleware entry to place SSR after',
    );
  }
  middlewares.splice(anchor + 1, 0, {
    name: 'anansi-ssr',
    middleware: (req: Request, res: Response, next: NextFunction) => {
      if (
        (req.method !== 'GET' && req.method !== 'HEAD') ||
        (publicPath && req.url.startsWith(publicPath))
      )
        return next();
      return ssr(req, res, next);
    },
  });
}
