import { Route, RouteProvider, RouteController } from '@anansi/router';
import React from 'react';
import { createMemoryHistory } from 'history';

import type { ResolveProps, ServerProps, CreateRouter } from './types';

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

  return function <T extends NeededProps>(
    next: (props: ServerProps) => Promise<T>,
  ) {
    return async (props: ServerProps) => {
      const url = props.req.url || '';
      const router = options.createRouter(
        createMemoryHistory({ initialEntries: [url] }),
      );
      const matchedRoutes: Route<ResolveWith>[] = router.getMatchedRoutes(url);

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
