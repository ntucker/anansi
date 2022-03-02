import { hydrateRoot } from 'react-dom/client';
import { CacheProvider } from 'rest-hooks';
import { createBrowserHistory } from 'history';

import ServerDataComponent, { getDatafromDOM } from './ServerDataComponent';
import Document from './Document';
import { Router } from '../routing';
import { RenderApp, CreateRouter, Root } from './types';

export default function floodSpouts(
  createRouter: CreateRouter,
  app: RenderApp,
) {
  const router = createRouter(createBrowserHistory());

  const data = getDatafromDOM();

  const Root: Root = ({ children, ...rest }) => (
    <Document {...rest} assets={(globalThis as any).assetManifest}>
      <CacheProvider initialState={data}>
        <Router router={router}>{children}</Router>
        <ServerDataComponent data={data} />
      </CacheProvider>
    </Document>
  );

  hydrateRoot(document, app(Root));
}
