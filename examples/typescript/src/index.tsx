import { CacheProvider } from '@rest-hooks/react';
import ReactDOM from 'react-dom/client';
import { Router, RouteChildrenProps } from 'react-router-dom';
import { ScrollContext } from 'react-router-scroll-4';

import { history } from 'navigation';

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

ReactDOM.createRoot(document.body).render(
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
);
