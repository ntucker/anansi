import { DataProvider } from '@data-client/react';
import ReactDOM from 'react-dom/client';
import { Router } from 'react-router-dom';

import ErrorBoundary from '@/components/ErrorBoundary';
import ErrorLoggerContext from '@/lib/ErrorLoggerContext';
import { history } from '@/navigation';
import '@/style/main.scss';

import App from './App';

ReactDOM.createRoot(document.body).render(
  <ErrorLoggerContext.Provider value={e => console.error('error logged', e)}>
    <ErrorBoundary>
      <DataProvider>
        <Router history={history}>
          <App />
        </Router>
      </DataProvider>
    </ErrorBoundary>
  </ErrorLoggerContext.Provider>,
);
