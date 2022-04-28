import { Route, RouteProvider, RouteController } from '@anansi/router';
import React from 'react';
import { createBrowserHistory } from 'history';

import type { ResolveProps, CreateRouter } from './types';

type NeededProps = ResolveProps;

export default function routerSpout<ResolveWith>(options: {
  resolveWith?: any;
  useResolveWith: () => ResolveWith;
  createRouter: CreateRouter<ResolveWith>;
}) {
  const createRouteComponent = (
    router: RouteController<Route<ResolveWith, any>>,
  ) =>
    function Router({ children }: { children: React.ReactNode }) {
      const resolveWith = options.useResolveWith();

      return (
        <RouteProvider router={router} resolveWith={resolveWith}>
          {children}
        </RouteProvider>
      );
    };

  return function <T extends NeededProps>(next: () => Promise<T>) {
    return async () => {
      const history = createBrowserHistory();
      const router = options.createRouter(history);
      const matchedRoutes = router.getMatchedRoutes(history.location.pathname);

      const nextProps = await next();

      const Router = createRouteComponent(router);
      return {
        ...nextProps,
        matchedRoutes,
        app: <Router>{nextProps.app}</Router>,
      };
    };
  };
}