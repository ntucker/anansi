import type { Middleware } from 'webpack-dev-server';

import { insertSsrMiddleware } from '../insertSsrMiddleware';

const entry = (name: string) => ({ name, middleware: () => {} });
const names = (middlewares: Middleware[]) =>
  middlewares.map(m => (typeof m === 'object' ? m.name : 'fn'));

function ssrEntry(middlewares: Middleware[]) {
  return middlewares.find(
    m => typeof m === 'object' && m.name === 'anansi-ssr',
  ) as { middleware: (req: any, res: any, next: () => void) => unknown };
}

describe('insertSsrMiddleware', () => {
  it('goes after the proxy entries, before static and history fallback', () => {
    const middlewares = [
      entry('webpack-dev-middleware'),
      entry('webpack-dev-server-assets'),
      entry('http-proxy-middleware'),
      entry('http-proxy-middleware-error-handler'),
      entry('webpack-dev-middleware'),
      entry('express-static'),
      entry('connect-history-api-fallback'),
    ];
    insertSsrMiddleware(middlewares, jest.fn());
    expect(names(middlewares)).toEqual([
      'webpack-dev-middleware',
      'webpack-dev-server-assets',
      'http-proxy-middleware',
      'http-proxy-middleware-error-handler',
      'anansi-ssr',
      'webpack-dev-middleware',
      'express-static',
      'connect-history-api-fallback',
    ]);
  });

  it('goes after the webpack-dev-server routes without proxies', () => {
    const middlewares = [
      entry('webpack-dev-middleware'),
      entry('webpack-dev-server-assets'),
      entry('express-static'),
    ];
    insertSsrMiddleware(middlewares, jest.fn());
    expect(names(middlewares)).toEqual([
      'webpack-dev-middleware',
      'webpack-dev-server-assets',
      'anansi-ssr',
      'express-static',
    ]);
  });

  it('throws when webpack-dev-server no longer has the expected entries', () => {
    expect(() =>
      insertSsrMiddleware([entry('webpack-dev-middleware')], jest.fn()),
    ).toThrow(/webpack-dev-server middlewares changed/);
  });

  it.each([
    ['GET', '/home', true],
    ['HEAD', '/home', true],
    ['POST', '/home', false],
    ['GET', '/assets/client.js', false],
  ])('%s %s renders SSR: %s', (method, url, rendered) => {
    const ssr = jest.fn();
    const next = jest.fn();
    const middlewares = [entry('webpack-dev-server-assets')];
    insertSsrMiddleware(middlewares, ssr, '/assets/');
    ssrEntry(middlewares).middleware({ method, url }, {}, next);
    expect(ssr).toHaveBeenCalledTimes(rendered ? 1 : 0);
    expect(next).toHaveBeenCalledTimes(rendered ? 0 : 1);
  });
});
