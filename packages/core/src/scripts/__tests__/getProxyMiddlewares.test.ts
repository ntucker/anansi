import express from 'express';
import http from 'http';
import type { AddressInfo } from 'net';

import getProxyMiddlewares from '../getProxyMiddlewares';

function listen(server: http.Server): Promise<string> {
  return new Promise(resolve =>
    server.listen(0, () =>
      resolve(`http://localhost:${(server.address() as AddressInfo).port}`),
    ),
  );
}

describe('getProxyMiddlewares', () => {
  let upstream: http.Server;
  let app: http.Server;
  let appUrl: string;

  beforeAll(async () => {
    upstream = http.createServer((req, res) => res.end(`upstream:${req.url}`));
    const target = await listen(upstream);

    const wrappingApp = express();
    wrappingApp.use(
      ...getProxyMiddlewares([
        { context: ['/api'], target },
        () => ({ path: '/fn', target }),
        { context: '/no-target' },
      ]).map(({ middleware }) => middleware),
    );
    wrappingApp.get('/{*splat}', (req, res) => {
      res.send(`ssr:${req.url}`);
    });
    app = http.createServer(wrappingApp);
    appUrl = await listen(app);
  });

  afterAll(() => {
    app.close();
    upstream.close();
  });

  it.each([
    ['/api/users?page=2', 'upstream:/api/users?page=2'],
    ['/fn/a', 'upstream:/fn/a'],
    ['/no-target/a', 'ssr:/no-target/a'],
    ['/other/path', 'ssr:/other/path'],
    ['/', 'ssr:/'],
  ])('routes %s', async (path, expected) => {
    const res = await fetch(`${appUrl}${path}`);
    expect(await res.text()).toBe(expected);
  });
});
