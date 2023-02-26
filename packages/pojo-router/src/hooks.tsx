import { useContext, useMemo } from 'react';

import { ControllerContext, LocationContext } from './context.js';

export function useLocation() {
  return useContext(LocationContext);
}

export function useController() {
  return useContext(ControllerContext);
}

export function useRoutes<Route>(): Route[] {
  const controller = useController();
  const location = useLocation();

  return useMemo(
    () => controller.getMatchedRoutes(location.pathname) as any[],
    [location, controller],
  );
}
