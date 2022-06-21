import { useContext, useMemo } from 'react';

import { ControllerContext, LocationContext } from './context';

export function useLocation() {
  return useContext(LocationContext);
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
