import { hydrateRoot } from 'react-dom/client';
import { CacheProvider } from 'rest-hooks';
import { createBrowserHistory } from 'history';

import RootProvider from './RootProvider';
import App from './App';
import ServerDataComponent, { getDatafromDOM } from './ssr/ServerDataComponent';
import Document from './ssr/Document';
import { Router, createRouter } from './routing';

// this is the client entry point (browser)

const router = createRouter(createBrowserHistory());

const data = getDatafromDOM();

const content = (
  <Document assets={(globalThis as any).assetManifest} title="Anansi">
    <CacheProvider initialState={data}>
      <Router router={router}>
        <RootProvider>
          <App />
        </RootProvider>
      </Router>
      <ServerDataComponent data={data} />
    </CacheProvider>
  </Document>
);

hydrateRoot(document, content);
