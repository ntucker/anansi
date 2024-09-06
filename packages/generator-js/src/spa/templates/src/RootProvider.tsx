import { DataProvider, useController, AsyncBoundary, ProviderProps } from '@data-client/react';
import { RouteProvider } from '@anansi/router';
import type { ReactNode } from 'react';
import { createBrowserHistory } from 'history';

import { createRouter } from '@/routing';

export default function RootProvider({ children, ...rest }: RootProps) {
  return (
    <DataProvider {...rest}>
      <Router>
        <AsyncBoundary>{children}</AsyncBoundary>
      </Router>
    </DataProvider>
  );
}

type RootProps = { children: ReactNode } & ProviderProps;

const router = createRouter(createBrowserHistory());
function Router({ children }: { children: React.ReactNode }) {
  const controller = useController();

  return (
    <RouteProvider router={router} resolveWith={controller}>
      {children}
    </RouteProvider>
  );
}
