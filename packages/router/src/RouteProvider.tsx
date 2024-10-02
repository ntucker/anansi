// TODO: Mock useTransition() to support earlier versions of react, just without v18 features
import { PojoRouter, RouteController } from '@pojo-router/core';
import type { Update } from 'history';
import React, {
  memo,
  useCallback,
  useEffect,
  useRef,
  useTransition,
} from 'react';

import { IsLoadingContext } from './IsLoadingContext.js';
import type { Route } from './types.js';

type Props<ResolveWith> = {
  children: React.ReactNode;
  resolveWith: ResolveWith;
  router: RouteController<Route<ResolveWith>>;
  onChange?: (update: Update, callback: () => void | undefined) => void;
};

function RouteProvider<ResolveWith>({
  children,
  router,
  resolveWith,
  onChange,
}: Props<ResolveWith>) {
  const preloadMatch = useCallback(
    (match: Route<ResolveWith>, search: URLSearchParams) => {
      // load component source
      if (match.component) match.component?.preload?.();
      // load component data
      if (match.resolveData) match.resolveData(resolveWith, match, search);
    },
    [resolveWith],
  );

  const shouldScroll = useRef(false);
  const [isPending, startTransition] = useTransition();
  const transitionPathname = useCallback(
    (update: Update, callback: () => void) => {
      // fetch as transition/render
      const matches = router.getMatchedRoutes(update.location.pathname);
      if (matches.length) {
        const search = new URLSearchParams(
          update.location?.search?.substring?.(1),
        );
        matches.forEach(match => preloadMatch(match, search));
      }
      shouldScroll.current = ['PUSH', 'REPLACE'].includes(update.action);

      // don't transition on 'back' as this should already be ready
      if (shouldScroll.current) {
        // transition begins
        startTransition(onChange ? () => onChange(update, callback) : callback);
      } else {
        if (onChange) {
          onChange(update, callback);
        } else callback();
      }
    },
    [preloadMatch, router, onChange],
  );

  useEffect(() => {
    if (!isPending && shouldScroll.current && typeof window !== 'undefined') {
      // TODO: handle hash links
      window.scrollTo(0, 0);
    }
  }, [isPending]);

  return (
    <PojoRouter router={router} onChange={transitionPathname}>
      <IsLoadingContext.Provider value={isPending}>
        {children}
      </IsLoadingContext.Provider>
    </PojoRouter>
  );
}

const m = memo(RouteProvider) as typeof RouteProvider;
export default m;
