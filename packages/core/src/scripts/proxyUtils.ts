import type { ProxyConfigArray } from 'webpack-dev-server';

/**
 * Extracts route patterns from webpack-dev-server proxy configuration.
 *
 * Handles the webpack-dev-server proxy array format:
 * ```
 * proxy: [
 *   { context: ['/api'], target: 'http://localhost:3000' },
 *   { context: '/ws', target: 'http://localhost:3001' },
 *   { path: '/legacy', target: 'http://localhost:3002' },
 *   { pathFilter: '/v2', target: 'http://localhost:3003' },
 * ]
 * ```
 *
 * @see https://webpack.js.org/configuration/dev-server/#devserverproxy
 */
export function extractProxyRoutes(
  proxy: ProxyConfigArray | undefined,
): string[] {
  if (!proxy) return [];

  return proxy
    .filter(
      (item): item is Record<string, unknown> =>
        typeof item === 'object' && item !== null,
    )
    .flatMap(item => {
      // same precedence as webpack-dev-server; each can be a string or an array
      // of strings (function filters can't be statically analyzed)
      const context = item.context ?? item.path ?? item.pathFilter;
      if (Array.isArray(context)) return context as string[];
      if (typeof context === 'string') return [context];
      return [];
    });
}
