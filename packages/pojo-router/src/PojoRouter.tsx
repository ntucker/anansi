import React, { memo, useEffect, useState } from 'react';
import type { Location, Update } from 'history';

import { ControllerContext, LocationContext } from './context';
import RouteController from './Controller';

type Props = {
  children: React.ReactNode;
  router: RouteController;
  initialPath: string;
  onChange?: (update: Update, callback: () => void | undefined) => void;
};

const PojoRouter = ({ children, router, initialPath, onChange }: Props) => {
  const [location, setLocation] = useState({
    pathname: initialPath,
  } as Location);
  useEffect(() => {
    return router.history.listen(({ action, location }) => {
      if (onChange) {
        onChange({ action, location }, () => setLocation(location));
      } else {
        setLocation(location);
      }
    });
  });

  return (
    <ControllerContext.Provider value={router}>
      <LocationContext.Provider value={location}>
        {children}
      </LocationContext.Provider>
    </ControllerContext.Provider>
  );
};
PojoRouter.defaultValues = {
  namedPaths: {},
};
export default memo(PojoRouter);
