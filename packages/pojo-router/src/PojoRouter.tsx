import type { Update } from 'history';
import React, { memo, useEffect, useState } from 'react';

import { ControllerContext, LocationContext } from './context';
import RouteController from './Controller';

type Props = {
  children: React.ReactNode;
  router: RouteController;
  onChange?: (update: Update, callback: () => void | undefined) => void;
};

const PojoRouter = ({ children, router, onChange }: Props) => {
  const [location, setLocation] = useState(router.history.location);
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
