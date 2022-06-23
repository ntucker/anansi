import { Route } from '@anansi/router';

import type { ResolveProps, ServerProps } from './types';

type NeededProps<RouteWith> = {
  matchedRoutes: Route<RouteWith>[];
} & ResolveProps;

export default function prefetchSpout<F extends string>(field: F) {
  return function <
    RouteWith,
    N extends NeededProps<RouteWith>,
    I extends ServerProps,
  >(
    next: (props: I) => Promise<
      {
        [K in F]: RouteWith;
      } & N
    >,
  ) {
    return async (props: I) => {
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
