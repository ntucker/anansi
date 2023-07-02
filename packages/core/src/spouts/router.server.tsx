import { Route, RouteProvider, RouteController } from '@anansi/router';
import { createMemoryHistory } from 'history';
import React from 'react';

import type { CreateRouter, ServerSpout } from './types.js';

export default function routerSpout<ResolveWith>(options: {
  resolveWith?: any;
  useResolveWith: () => ResolveWith;
  createRouter: CreateRouter<ResolveWith>;
}): ServerSpout<
  Record<string, unknown>,
  {
    matchedRoutes: Route<ResolveWith>[];
    searchParams: URLSearchParams;
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
        <RouteProvider router={router} resolveWith={resolveWith}>
          {children}
        </RouteProvider>
      );
    };

  return next => async props => {
    const url = props.req.url || '';
    const parts = url.split('?', 2);
    const searchParams = new URLSearchParams(parts.length < 2 ? '' : parts[1]);
    const router = options.createRouter(
      createMemoryHistory({ initialEntries: [url] }),
    );
    const matchedRoutes: Route<ResolveWith>[] = router.getMatchedRoutes(url);

    const nextProps = await next({
      ...props,
      matchedRoutes,
      router,
      searchParams,
    });

    const Router = createRouteComponent(router);

    return {
      ...nextProps,
      app: <Router>{nextProps.app}</Router>,
      // TODO: figure out how to only inject in next and not have to also put here
      matchedRoutes,
      router,
      searchParams,
    };
  };
}
