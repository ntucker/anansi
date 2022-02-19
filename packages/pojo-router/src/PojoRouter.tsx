import React, { useMemo } from 'react';
import type { Location } from 'history';

import { ControllerContext, LocationContext } from './context';
import type { AnyIfEmpty, DefaultRoutePojo, NamedPath, Route } from './types';
import RouteController from './Controller';

type Props = {
  children: React.ReactNode;
  namedPaths: Record<string, string | NamedPath>;
  routes: readonly Route[];
  notFound: AnyIfEmpty<DefaultRoutePojo>;
  location: Location;
};

const PojoRouter = ({
  children,
  namedPaths,
  routes,
  notFound,
  location,
}: Props) => {
  const controller = useMemo(
    () => new RouteController({ namedPaths, routes, notFound }),
    [namedPaths, routes, notFound],
  );
  return (
    <ControllerContext.Provider value={controller}>
      <LocationContext.Provider value={location}>
        {children}
      </LocationContext.Provider>
    </ControllerContext.Provider>
  );
};
PojoRouter.defaultValues = {
  namedPaths: {},
};
export default PojoRouter;
