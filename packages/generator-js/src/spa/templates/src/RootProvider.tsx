import { CacheProvider, useController } from '@rest-hooks/react';
import { RouteProvider } from '@anansi/router';
import type { ReactNode } from 'react';
import { createBrowserHistory } from 'history';
import Boundary from 'components/Boundary';

import { createRouter } from './routing';

const router = createRouter(createBrowserHistory());
function Router({ children }: { children: React.ReactNode }) {
  const controller = useController();

  return (
    <RouteProvider router={router} resolveWith={controller}>
      {children}
    </RouteProvider>
  );
}

type ComponentProps<T> = T extends
  | React.ComponentType<infer P>
  | React.Component<infer P>
  ? JSX.LibraryManagedAttributes<T, P>
  : never;

type Props = { children: ReactNode } & ComponentProps<typeof CacheProvider>;

export default function RootProvider({ children, ...rest }: Props) {
  return (
    <CacheProvider {...rest}>
      <Router>
        <Boundary fallback={null}>{children}</Boundary>
      </Router>
    </CacheProvider>
  );
}
