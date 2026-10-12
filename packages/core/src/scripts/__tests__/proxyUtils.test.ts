import type { IncomingMessage } from 'http';

import { createProxyMatcher } from '../proxyUtils';

const target = 'http://localhost:3000';
const req = (url: string) => ({ url }) as IncomingMessage;

function matched(
  proxy: Parameters<typeof createProxyMatcher>[0],
  urls: string[],
) {
  const isProxied = createProxyMatcher(proxy);
  return urls.filter(url => isProxied(req(url)));
}

describe('createProxyMatcher', () => {
  it('matches nothing without proxy entries', () => {
    expect(matched(undefined, ['/', '/api'])).toEqual([]);
    expect(matched([], ['/', '/api'])).toEqual([]);
  });

  it('matches string prefixes from context, path and pathFilter', () => {
    const proxy = [
      { context: ['/api', '/graphql'], target },
      { path: '/legacy', target },
      { pathFilter: '/v2', target },
    ];
    expect(
      matched(proxy, [
        '/api/users?page=2',
        '/graphql',
        '/legacy/a',
        '/v2/b',
        '/home',
      ]),
    ).toEqual(['/api/users?page=2', '/graphql', '/legacy/a', '/v2/b']);
  });

  it('prefers context over path, skipping empty values like webpack-dev-server', () => {
    expect(
      matched(
        [{ context: '/api', path: '/legacy', target }],
        ['/api', '/legacy'],
      ),
    ).toEqual(['/api']);
    expect(
      matched([{ context: '', path: '/api', target }], ['/api', '/home']),
    ).toEqual(['/api']);
  });

  it('matches globs, including braces, catch-alls and negations', () => {
    expect(
      matched(
        [{ pathFilter: '/{api,v2}/**', target }],
        ['/api/a', '/v2/b', '/apiary', '/home'],
      ),
    ).toEqual(['/api/a', '/v2/b']);
    expect(matched([{ pathFilter: '/**', target }], ['/', '/a/b'])).toEqual([
      '/',
      '/a/b',
    ]);
    expect(
      matched(
        [{ pathFilter: ['/api/**', '!**/*.html'], target }],
        ['/api/data.json', '/api/page.html'],
      ),
    ).toEqual(['/api/data.json']);
  });

  it('calls function path filters with the pathname and request', () => {
    const pathFilter = jest.fn((pathname: string) =>
      pathname.endsWith('.json'),
    );
    expect(
      matched([{ pathFilter, target }], ['/a/data.json?x=1', '/a']),
    ).toEqual(['/a/data.json?x=1']);
    expect(pathFilter).toHaveBeenCalledWith(
      '/a/data.json',
      expect.objectContaining({ url: '/a/data.json?x=1' }),
    );
  });

  it('ignores callback entries, entries without a filter and null', () => {
    const proxy = [
      () => ({ context: '/dynamic', target }),
      { target, router: {} },
      null,
    ];
    expect(matched(proxy as any, ['/dynamic', '/', '/api'])).toEqual([]);
  });
});
