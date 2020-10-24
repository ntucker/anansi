import ReactDOM from 'react-dom';
import { createBrowserHistory } from 'history';
import { Router } from 'react-router-dom';
import { ScrollContext } from 'react-router-scroll-4';

import loadPolyfills from '@anansi/polyfill';

import { RouteChildrenProps } from 'react-router';
import { CacheProvider } from 'rest-hooks';
import 'style/main.scss';

import ErrorBoundary from 'components/ErrorBoundary';
import ErrorLoggerContext from 'lib/ErrorLoggerContext';

import App from './App';

function shouldUpdateScroll(
  prevRouterProps: RouteChildrenProps,
  { history: { action } }: RouteChildrenProps,
) {
  return action !== 'REPLACE';
}
const history = createBrowserHistory();

async function init() {
  await loadPolyfills();
}
init();
ReactDOM.render(
  <ErrorLoggerContext.Provider value={e => console.error('error logged', e)}>
    <ErrorBoundary>
      <CacheProvider>
        <Router history={history}>
          <ScrollContext shouldUpdateScroll={shouldUpdateScroll}>
            <App />
          </ScrollContext>
        </Router>
      </CacheProvider>
    </ErrorBoundary>
  </ErrorLoggerContext.Provider>,
  document.body,
);
