import { Route, RouteProvider, RouteController } from '@anansi/router';
import { createBrowserHistory } from 'history';
import type { Update } from 'history';
import React from 'react';

import type { CreateRouter, ClientSpout } from './types';

export default function routerSpout<ResolveWith>(options: {
  resolveWith?: any;
  useResolveWith: () => ResolveWith;
  createRouter: CreateRouter<ResolveWith>;
  onChange?: (update: Update, callback: () => void | undefined) => void;
}): ClientSpout<
  Record<string, unknown>,
  {
    matchedRoutes: Route<ResolveWith, any>[];
  } & {
    router: RouteController<Route<ResolveWith, any>>;
  }
> {
  const createRouteComponent = (
    router: RouteController<Route<ResolveWith, any>>,
  ) =>
    function Router({ children }: { children: React.ReactNode }) {
      const resolveWith = options.useResolveWith();

      return (
        <RouteProvider
          router={router}
          resolveWith={resolveWith}
          onChange={options.onChange}
        >
          {children}
        </RouteProvider>
      );
    };

  return next => async props => {
    const history = createBrowserHistory();
    const router = options.createRouter(history);
    const matchedRoutes = router.getMatchedRoutes(history.location.pathname);

    const nextProps = await next({ ...props, matchedRoutes, router });

    const Router = createRouteComponent(router);
    return {
      ...nextProps,
      matchedRoutes,
      router,
      app: <Router>{nextProps.app}</Router>,
    };
  };
}
