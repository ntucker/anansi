// eslint-disable-next-line
// @ts-ignore the types haven't made it to this point yet
import { createMemoryHistory } from 'history';
import type { StatsCompilation } from 'webpack';
import { IncomingMessage } from 'http';
import React from 'react';
import { Request } from 'express';

import Document from './Document';
import createPersistedCacheProvder from './ServerCacheProvider';
import { Router } from '../routing';
import { CreateRouter } from './types';

export default async function buildPageRoot(
  createRouter: CreateRouter,
  clientManifest: StatsCompilation,
  req: Request | IncomingMessage,
) {
  // >Request<
  // Route
  const url = req.url || '';
  const router = createRouter(createMemoryHistory({ initialEntries: [url] }));
  const matchedRoutes = router.getMatchedRoutes(url);

  // Document
  const entrypoint = clientManifest?.entrypoints?.main;
  const publicPath = clientManifest.publicPath;

  if (entrypoint === undefined || publicPath === undefined)
    throw new Error('Manifest missing entries needed');

  // TODO: consider using this package for build stats in future:
  // https://github.com/facebook/react/tree/main/packages/react-server-dom-webpack
  const assetMap = (assets: { name: string; size?: number }[]) =>
    assets.map(({ name }) => `${publicPath}${name}`);
  // find additional assets to preload based on matched route
  const assets = assetMap([
    ...(entrypoint.assets ?? []),
    ...(entrypoint.children?.prefetch?.find?.(({ name }) =>
      matchedRoutes.some(route => name === route.name),
    )?.assets ?? []),
  ]);

  // Rest Hooks
  const [ServerCacheProvider, controller] = createPersistedCacheProvder();
  try {
    const toFetch: Promise<unknown>[] = [];
    matchedRoutes.forEach(route => {
      if (typeof route.resolveData === 'function') {
        toFetch.push(route.resolveData(controller, route));
      }
    });
    await Promise.all(toFetch);
  } catch (e) {
    console.error(e);
  }

  // >Response<
  const Root = ({
    children,
    ...rest
  }: {
    children: React.ReactNode;
    head?: React.ReactNode;
    title: string;
  }) => (
    <Document
      {...rest}
      assets={assets.map(asset =>
        asset.endsWith('.css')
          ? { href: asset, rel: 'stylesheet' }
          : asset.endsWith('.js')
          ? { href: asset, as: 'script' }
          : { href: asset },
      )}
    >
      <ServerCacheProvider>
        <Router router={router}>{children}</Router>
      </ServerCacheProvider>
    </Document>
  );
  return Root;
}
