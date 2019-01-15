import ReactDOM from 'react-dom';
import { createBrowserRouter, makeRouteConfig, hotRouteConfig } from 'found';
import loadPolyfills from '@anansi/babel-preset/loadPolyfills';

import ErrorBoundary from 'components/ErrorBoundary';
import ErrorLoggerContext from 'lib/ErrorLoggerContext';

import routeConfig from './routes';

const BrowserRouter = createBrowserRouter({
  routeConfig: makeRouteConfig(hotRouteConfig(routeConfig)),
  renderError: (
    { error }, // eslint-disable-line react/prop-types
  ) => <div>{error.status === 404 ? 'Not found' : 'Error'}</div>,
});

async function init() {
  await loadPolyfills();
  ReactDOM.createRoot(document.body).render(
    <ErrorLoggerContext.Provider value={() => console.error('what what')}>
      <ErrorBoundary>
        <BrowserRouter />
      </ErrorBoundary>
    </ErrorLoggerContext.Provider>,
  );
}
init();
