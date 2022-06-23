import { Route, RouteProvider, RouteController } from '@anansi/router';
import React from 'react';
import { createBrowserHistory } from 'history';
import type { Update } from 'history';

import type { ResolveProps, CreateRouter } from './types';

type NeededNext = ResolveProps;

export default function routerSpout<ResolveWith>(options: {
  resolveWith?: any;
  useResolveWith: () => ResolveWith;
  createRouter: CreateRouter<ResolveWith>;
  onChange?: (update: Update, callback: () => void | undefined) => void;
}) {
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

  return function <N extends NeededNext, I extends Record<string, unknown>>(
    next: (initData: Record<string, unknown>) => Promise<N>,
  ) {
    return async (props: I) => {
      const history = createBrowserHistory();
      const router = options.createRouter(history);
      const matchedRoutes = router.getMatchedRoutes(history.location.pathname);

      const nextProps = await next(props);

      const Router = createRouteComponent(router);
      return {
        ...nextProps,
        matchedRoutes,
        router,
        app: <Router>{nextProps.app}</Router>,
      };
    };
  };
}
