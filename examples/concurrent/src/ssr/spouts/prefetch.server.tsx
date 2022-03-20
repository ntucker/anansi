import { Route } from '@anansi/router';

import type { ResolveProps, ServerProps } from './types';

type NeededProps<RouteWith> = {
  matchedRoutes: Route<RouteWith>[];
} & ResolveProps;

export default function prefetchSpout<F extends string>(field: F) {
  return function <RouteWith, T extends NeededProps<RouteWith>>(
    next: (props: ServerProps) => Promise<
      {
        [K in F]: RouteWith;
      } & T
    >,
  ) {
    return async (props: ServerProps) => {
      const nextProps = await next(props);

      try {
        const toFetch: Promise<unknown>[] = [];
        nextProps.matchedRoutes.forEach(route => {
          if (typeof route.resolveData === 'function') {
            toFetch.push(route.resolveData(nextProps[field], route));
          }
        });
        await Promise.all(toFetch);
      } catch (e) {
        console.error(e);
      }
      return nextProps;
    };
  };
}
