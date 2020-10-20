import { CacheProvider } from 'rest-hooks';
import ErrorBoundary from 'components/ErrorBoundary';
import ErrorLoggerContext from 'lib/ErrorLoggerContext';
import React, { memo } from 'react';
import RoutesProvider from 'routes/RoutesProvider';
import BrowserPathname from '@pojo-router/react-browser-pathname';

function Provider({ children }: { children: React.ReactChild }) {
  return (
    <ErrorLoggerContext.Provider value={e => console.error('error logged', e)}>
      <ErrorBoundary>
        <CacheProvider>
          <BrowserPathname>
            <RoutesProvider>{children}</RoutesProvider>
          </BrowserPathname>
        </CacheProvider>
      </ErrorBoundary>
    </ErrorLoggerContext.Provider>
  );
}

export default memo(Provider);
