import * as React from 'react';
// eslint-disable-next-line
// @ts-ignore the types haven't made it to this point yet
import { renderToPipeableStream } from 'react-dom/server';
import { createMemoryHistory } from 'history';
import type { Response } from 'express';
import type { StatsChunkGroup } from 'webpack';

import App from './App';
import Document from './ssr/Document';
import RootProvider from './RootProvider';
import { UserResource } from './resources/Discuss';
import createPersistedCacheProvder from './ssr/ServerCacheProvider';
import { Router, createRouter } from './routing';

export default async function render(
  url: string,
  res: Response,
  entrypoint: StatsChunkGroup,
  publicPath: string,
) {
  // TODO: consider using this package for build stats in future:
  // https://github.com/facebook/react/tree/main/packages/react-server-dom-webpack
  const assetMap = (assets: { name: string; size?: number }[]) =>
    assets.map(({ name }) => `${publicPath}${name}`);

  let didError = false;
  const router = createRouter(createMemoryHistory({ initialEntries: [url] }));
  const [ServerCacheProvider, controller] = createPersistedCacheProvder();

  const matchedRoute = router.getMatchedRoutes(url)[0];
  // find additional assets to preload based on matched route
  const assets = assetMap([
    ...(entrypoint.assets ?? []),
    ...(entrypoint.children?.prefetch?.find?.(
      ({ name }) => name === matchedRoute.name,
    )?.assets ?? []),
  ]);

  try {
    const toFetch: Promise<unknown>[] = [
      controller.fetch(UserResource.list(), {}),
    ];
    if (matchedRoute && typeof matchedRoute.resolveData === 'function') {
      toFetch.push(matchedRoute.resolveData(controller, matchedRoute));
    }
    await Promise.all(toFetch);
  } catch (e) {
    console.error(e);
  }

  // build redux and history
  const { pipe, abort } = renderToPipeableStream(
    <Document
      assets={assets.map(asset =>
        asset.endsWith('.css')
          ? { href: asset, rel: 'stylesheet' }
          : asset.endsWith('.js')
          ? { href: asset, as: 'script' }
          : { href: asset },
      )}
      title="Anansi"
    >
      <ServerCacheProvider>
        <Router router={router}>
          <RootProvider>
            <App />
          </RootProvider>
        </Router>
      </ServerCacheProvider>
    </Document>,
    /*
      This is not documented, so included the types here for reference:
type Options = {|
identifierPrefix?: string,
namespaceURI?: string,
nonce?: string,
bootstrapScriptContent?: string,
bootstrapScripts?: Array<string>,
bootstrapModules?: Array<string>,
progressiveChunkSize?: number,
onCompleteShell?: () => void,
onErrorShell?: () => void,
onCompleteAll?: () => void,
onError?: (error: mixed) => void,
|};
*/
    {
      //bootstrapScripts: assets.filter(asset => asset.endsWith('.js')),
      onCompleteShell() {
        //managers.forEach(manager => manager.cleanup());
        // If something errored before we started streaming, we set the error code appropriately.
        res.statusCode = didError ? 500 : 200;
        res.setHeader('Content-type', 'text/html');
        pipe(res);
      },
      onError(x: any) {
        didError = true;
        console.error(x);
        res.statusCode = 500;
        pipe(res);
      },
    },
  );
  // Abandon and switch to client rendering if enough time passes.
  // Try lowering this to see the client recover.
  setTimeout(abort, 1000);
}
