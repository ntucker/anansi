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
      // webpack-dev-server proxy supports both 'context' and 'path' properties
      // and each can be a string or an array of strings
      const context = item.context ?? item.path;
      if (Array.isArray(context)) return context as string[];
      if (typeof context === 'string') return [context];
      return [];
    });
}
