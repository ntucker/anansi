import type { Location } from 'history';
import { createContext } from 'react';

import RouteController from './Controller.js';

// Use global singleton to prevent duplicate contexts when bundled multiple times
const GLOBAL_KEY = '__POJO_ROUTER_CONTEXT__';

function getOrCreateContexts() {
  const g = globalThis as any;
  if (!g[GLOBAL_KEY]) {
    const defaultController = new RouteController({
      history: {} as any,
      namedPaths: {},
      routes: [] as any[],
      notFound: undefined,
    });
    const defaultLocation: Location =
      'location' in globalThis ?
        (globalThis.location as unknown as Location)
      : ({
          pathname: '',
          search: '',
          hash: '',
          state: null,
          key: '',
        } as Location);

    g[GLOBAL_KEY] = {
      ControllerContext: createContext(defaultController),
      LocationContext: createContext(defaultLocation),
    };
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
  } else if (process.env.NODE_ENV !== 'production') {
    console.error(
      '[@pojo-router/core] Detected duplicate module instance. ' +
        'This can cause React context mismatches and hydration errors. ' +
        'Ensure @pojo-router/core is not bundled multiple times by your bundler. ' +
        'Consider using resolve.alias in webpack or similar deduplication strategies.',
    );
  }
  return g[GLOBAL_KEY];
}

const contexts = getOrCreateContexts();

export const ControllerContext: React.Context<RouteController<any>> =
  contexts.ControllerContext;
export const LocationContext: React.Context<Location> =
  contexts.LocationContext;
