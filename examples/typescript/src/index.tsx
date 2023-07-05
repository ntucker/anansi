import { CacheProvider } from '@data-client/react';
import ReactDOM from 'react-dom/client';
import { Router, RouteChildrenProps } from 'react-router-dom';

import { history } from 'navigation';

import 'style/main.scss';

import ErrorBoundary from 'components/ErrorBoundary';
import ErrorLoggerContext from 'lib/ErrorLoggerContext';

import App from './App';


ReactDOM.createRoot(document.body).render(
  <ErrorLoggerContext.Provider value={e => console.error('error logged', e)}>
    <ErrorBoundary>
      <CacheProvider>
        <Router history={history}>
            <App />
        </Router>
      </CacheProvider>
    </ErrorBoundary>
  </ErrorLoggerContext.Provider>,
);
