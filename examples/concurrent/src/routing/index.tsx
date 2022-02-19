import { RouteController } from '@pojo-router/core';
import { createBrowserHistory } from 'history';
import { RouteProvider } from '@anansi/router';
import { useController } from 'rest-hooks';

import NotFound from 'components/NotFound';

import { routes, namedPaths } from './routes';

const history = createBrowserHistory();

export const router = new RouteController({
  history,
  namedPaths,
  routes,
  notFound: { component: NotFound },
});

export default router;

export function Router({ children }: { children: React.ReactNode }) {
  const controller = useController();
  return (
    <RouteProvider
      initialPath={globalThis.location.pathname}
      router={router}
      resolveWith={controller}
    >
      {children}
    </RouteProvider>
  );
}
