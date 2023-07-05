import { RouteController } from '@anansi/router';
import type { History } from 'history';

import NotFound from 'components/NotFound';

import { routes, namedPaths } from './routes';

export function createRouter(history: History) {
  return new RouteController({
    history,
    namedPaths,
    routes,
    notFound: { component: NotFound },
  });
}

/*
import { Route, RouteProvider } from '@anansi/router';
import { useController } from '@data-client/react';
import { useContext, useMemo } from 'react';
import { demoContext } from '../app/demo';

export function Router({
  children,
  router,
}: {
  children: React.ReactNode;
  router: RouteController<Route<Controller, any>>;
}) {
  const controller = useController();

  const { concurrent } = useContext(demoContext);
  if (!concurrent) {
    return <PojoRouter router={router}>{children}</PojoRouter>;
  }
  return (
    <RouteProvider router={router} resolveWith={controller}>
      {children}
    </RouteProvider>
  );
}
TODO: Incorporate 'demo' behavior into spouts method
*/
