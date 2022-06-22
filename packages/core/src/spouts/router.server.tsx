import { Route, RouteProvider, RouteController } from '@anansi/router';
import React from 'react';
import { createMemoryHistory } from 'history';

import type { ResolveProps, ServerProps, CreateRouter } from './types';

type NeededNext = ResolveProps;

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

  return function <N extends NeededNext, I extends ServerProps>(
    next: (
      props: I & {
        matchedRoutes: Route<ResolveWith>[];
        router: RouteController<Route<ResolveWith, any>>;
      },
    ) => Promise<N>,
  ) {
    return async (props: I) => {
      const url = props.req.url || '';
      const router = options.createRouter(
        createMemoryHistory({ initialEntries: [url] }),
      );
      const matchedRoutes: Route<ResolveWith>[] = router.getMatchedRoutes(url);

      const nextProps = await next({
        ...props,
        matchedRoutes,
        router,
      });

      const Router = createRouteComponent(router);

      return {
        ...nextProps,
        app: <Router>{nextProps.app}</Router>,
      };
    };
  };
}
