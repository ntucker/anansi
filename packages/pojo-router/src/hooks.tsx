import { useContext, useMemo } from 'react';

import { ControllerContext, LocationContext } from './context.js';

export function useLocation() {
  return useContext(LocationContext);
}

export function useLocationSearch<K extends string | undefined = undefined>(
  key?: K,
): (K extends string ? string : URLSearchParams) | null {
  const location = useLocation();
  const search = new URLSearchParams(location?.search?.substring?.(1));
  if (key) return search.get(key) as any;
  return search as any;
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
