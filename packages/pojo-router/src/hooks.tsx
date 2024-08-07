import { useContext, useMemo } from 'react';

import { ControllerContext, LocationContext } from './context.js';

export function useLocation() {
  return useContext(LocationContext);
}

export function useLocationSearch<K extends string = ''>(
  key?: K,
): (K extends '' ? URLSearchParams : string) | null {
  const location = useLocation();
  const search = new URLSearchParams(location?.search?.substring?.(1));
  if (key) return search.get(key) as any;
  return search as any;
}

export function useRouter() {
  return useContext(ControllerContext);
}

export function useRoutes<Route>(): Route[] {
  const controller = useRouter();
  const location = useLocation();

  return useMemo(
    () => controller.getMatchedRoutes(location.pathname) as any[],
    [location, controller],
  );
}
