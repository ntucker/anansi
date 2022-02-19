import { useContext, useMemo } from 'react';

import { ControllerContext, LocationContext } from './context';

export function useLocation() {
  return useContext(LocationContext);
}

export function useController() {
  return useContext(ControllerContext);
}

export function useRoutes() {
  const controller = useController();
  const location = useLocation();

  return useMemo(
    () => controller.getMatchedRoutes(location.pathname),
    [location, controller],
  );
}
