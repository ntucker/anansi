import { useRoutes } from '@pojo-router/core';

import type { Route } from './types.js';

export default function MatchedRoute({ index = 0 }: { index?: number }) {
  const routes = useRoutes<Route<any>>();
  const Route = routes.length ? routes[index] : undefined;
  return Route ? <Route.component {...Route} /> : null;
}
