import React from 'react';
import { useRoutes } from '@pojo-router/core';

import { Route } from './types';

export default function MatchedRoute() {
  const routes = useRoutes<Route<any>>();
  const Route = routes.length ? routes[0] : undefined;
  return Route ? <Route.component {...Route} /> : null;
}
