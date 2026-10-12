import type {
  ProxyConfigArray,
  ProxyConfigArrayItem,
} from 'webpack-dev-server';

/** Path filter of a proxy entry, with the same precedence as webpack-dev-server */
export function getProxyPathFilter(item: ProxyConfigArrayItem) {
  return item.context || item.path || item.pathFilter;
}

/**
 * Extracts route prefixes from webpack-dev-server proxy configuration.
 * Globs are cut to their static prefix ('/api/**' -> '/api/').
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
      (item): item is ProxyConfigArrayItem =>
        typeof item === 'object' && item !== null,
    )
    .flatMap(item => {
      // string or array of strings (function filters can't be statically analyzed)
      const filter = getProxyPathFilter(item);
      if (Array.isArray(filter)) return filter;
      if (typeof filter === 'string') return [filter];
      return [];
    })
    .map(route => route.split(/[*?{[!(]/)[0])
    .filter(Boolean);
}
