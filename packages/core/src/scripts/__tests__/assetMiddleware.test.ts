import express from 'express';
import fs from 'fs';
import http, { type Server } from 'http';
import type { AddressInfo } from 'net';
import os from 'os';
import path from 'path';

import { assetMiddleware } from '../assetMiddleware';

let root: string;
beforeAll(() => {
  root = fs.mkdtempSync(path.join(os.tmpdir(), 'anansi-assets-'));
  fs.mkdirSync(path.join(root, 'public/sub'), { recursive: true });
  fs.writeFileSync(path.join(root, 'secret.txt'), 'SECRET');
  fs.writeFileSync(path.join(root, 'public/main.js'), 'ASSET');
  fs.writeFileSync(path.join(root, 'public/sub/a.js'), 'SUB');
});
afterAll(() => fs.rmSync(root, { recursive: true, force: true }));

async function get(publicPath: string, urls: string[]) {
  const app = express();
  app.use(assetMiddleware(publicPath, path.join(root, 'public')));
  app.use((req, res) => {
    res.end(`SSR ${req.url}`);
  });
  const server: Server = await new Promise(resolve => {
    const s = app.listen(0, '127.0.0.1', () => resolve(s));
  });
  const { port } = server.address() as AddressInfo;
  try {
    return await Promise.all(
      urls.map(
        url =>
          // raw request, since fetch would normalize '..' away
          new Promise<string>((resolve, reject) => {
            const req = http.get(
              { host: '127.0.0.1', port, path: url },
              res => {
                let body = '';
                res.on('data', chunk => (body += chunk));
                res.on('end', () => resolve(body));
              },
            );
            req.on('error', reject);
          }),
      ),
    );
  } finally {
    server.close();
  }
}

describe('assetMiddleware', () => {
  it('serves assets under the public path', async () => {
    expect(
      await get('/assets/', [
        '/assets/main.js',
        '/assets/main.js?v=1',
        '/assets/sub/a.js',
      ]),
    ).toEqual(['ASSET', 'ASSET', 'SUB']);
  });

  it('passes directories, misses and other prefixes to the next handler', async () => {
    expect(
      await get('/assets/', [
        '/assets/sub',
        '/assets/',
        '/assets/x.js',
        '/main.js',
      ]),
    ).toEqual([
      'SSR /assets/sub',
      'SSR /assets/',
      'SSR /assets/x.js',
      'SSR /main.js',
    ]);
  });

  it.each(['/', '/assets/'])(
    'never serves files outside the output with publicPath %s',
    async publicPath => {
      const bodies = await get(publicPath, [
        `${publicPath}../secret.txt`,
        `${publicPath}sub/../../secret.txt`,
        `${publicPath}%2e%2e/secret.txt`,
        `${publicPath}..%2fsecret.txt`,
        '/zzzzzzz../secret.txt',
      ]);
      for (const body of bodies) expect(body).toMatch(/^SSR /);
    },
  );

  it('treats pattern characters in publicPath literally', async () => {
    expect(
      await get('/v1.0+(x):y*/', [
        '/v1.0+(x):y*/main.js',
        '/v1.0+(x)q/main.js',
      ]),
    ).toEqual(['ASSET', 'SSR /v1.0+(x)q/main.js']);
  });
});
