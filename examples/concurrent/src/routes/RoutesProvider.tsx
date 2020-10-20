import React, { memo } from 'react';
import PojoRouter, { useCurrentPath } from 'pojo-router';
import NotFound from 'components/NotFound';

const namedPaths = {};
const routes = [];

function RoutesProvider({ children }: { children: React.ReactChild }) {
  const currentPath = useCurrentPath();
  return (
    <PojoRouter
      namedPaths={namedPaths}
      routes={routes}
      currentPath={currentPath}
      notFound={NotFound}
    >
      {children}
    </PojoRouter>
  );
}
export default memo(RoutesProvider);
