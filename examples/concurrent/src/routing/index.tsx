import { RouteController, PojoRouter } from '@pojo-router/core';
import { createBrowserHistory } from 'history';
import { RouteProvider } from '@anansi/router';
import { useController } from 'rest-hooks';
import { useContext } from 'react';

import NotFound from 'components/NotFound';
import { demoContext } from 'DemoProvider';

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
  const { concurrent } = useContext(demoContext);
  if (!concurrent) {
    return (
      <PojoRouter router={router} initialPath={globalThis.location.pathname}>
        {children}
      </PojoRouter>
    );
  }
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
