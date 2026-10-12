import type { IncomingMessage } from 'http';
import micromatch from 'micromatch';
import type {
  ProxyConfigArray,
  ProxyConfigArrayItem,
} from 'webpack-dev-server';

/** Path filter of a proxy entry, with the same precedence as webpack-dev-server */
export function getProxyPathFilter(item: ProxyConfigArrayItem) {
  return item.context || item.path || item.pathFilter;
}

type PathFilter = NonNullable<ReturnType<typeof getProxyPathFilter>>;

/** Same semantics as http-proxy-middleware's (unexported) matchPathFilter */
function matchesPathFilter(
  filter: PathFilter,
  pathname: string,
  req: IncomingMessage,
): boolean {
  if (typeof filter === 'function') return Boolean(filter(pathname, req));
  const patterns = Array.isArray(filter) ? filter : [filter];
  if (patterns.some(pattern => micromatch.scan(pattern).isGlob)) {
    return micromatch([pathname], patterns).length > 0;
  }
  return patterns.some(prefix => pathname.startsWith(prefix));
}

/**
 * Tests whether a request is handled by one of the webpack-dev-server proxy
 * entries, so SSR can pass it through to the proxy.
 *
 * Entries without a path filter and callback entries are ignored: their
 * filter isn't known up front.
 *
 * @see https://webpack.js.org/configuration/dev-server/#devserverproxy
 */
export function createProxyMatcher(
  proxy: ProxyConfigArray | undefined,
): (req: IncomingMessage) => boolean {
  const filters = (proxy ?? [])
    .map(item =>
      typeof item === 'object' && item !== null ?
        getProxyPathFilter(item)
      : undefined,
    )
    .filter((filter): filter is PathFilter => !!filter);
  if (!filters.length) return () => false;

  return req => {
    const { pathname } = new URL(req.url ?? '/', 'http://localhost');
    return filters.some(filter => matchesPathFilter(filter, pathname, req));
  };
}
