// TODO: Mock useTransition() to support earlier versions of react, just without v18 features
import React, { memo, useCallback, useTransition } from 'react';
import { PojoRouter, RouteController } from '@pojo-router/core';
import type { Update } from 'history';

import { IsLoadingContext } from './IsLoadingContext';
import type { Route } from './types';

function RouteProvider<ResolveWith>({
  children,
  initialPath,
  router,
  resolveWith,
}: {
  children: React.ReactNode;
  initialPath: string;
  router: RouteController<Route<ResolveWith>>;
  resolveWith: ResolveWith;
}) {
  const preloadMatch = useCallback(
    (match: Route<ResolveWith>) => {
      // load component source
      if (match.component) match.component?.preload?.();
      // load component data
      if (match.resolveData) match.resolveData(resolveWith, match);
    },
    [resolveWith],
  );

  const [isPending, startTransition] = useTransition();
  const transitionPathname = useCallback(
    ({ location }: Update, callback: () => void) => {
      // fetch as transition/render
      const matches = router.getMatchedRoutes(location.pathname);
      if (matches.length) {
        // TODO: should we preload every match?
        preloadMatch(matches[0]);
      }

      // transition begins
      startTransition(callback);
    },
    [preloadMatch, router],
  );

  return (
    <PojoRouter
      router={router}
      initialPath={initialPath}
      onChange={transitionPathname}
    >
      <IsLoadingContext.Provider value={isPending}>
        {children}
      </IsLoadingContext.Provider>
    </PojoRouter>
  );
}

export default memo(RouteProvider);
