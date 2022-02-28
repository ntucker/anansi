import { RouteController, PojoRouter } from '@pojo-router/core';
import { Route, RouteProvider } from '@anansi/router';
import { useController } from 'rest-hooks';
import { useContext, useMemo } from 'react';
import type { History } from 'history';
import { Controller } from '@rest-hooks/core';

import NotFound from 'components/NotFound';
import { demoContext } from 'DemoProvider';

import { routes, namedPaths } from './routes';

export function createRouter(history: History) {
  return new RouteController({
    history,
    namedPaths,
    routes,
    notFound: { component: NotFound },
  });
}

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
