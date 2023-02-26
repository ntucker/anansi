import type { Location } from 'history';
import { createContext } from 'react';

import RouteController from './Controller.js';

export const ControllerContext = createContext(
  new RouteController({
    history: {} as any,
    namedPaths: {},
    routes: [] as any[],
    notFound: undefined,
  }),
);

export const LocationContext = createContext(
  'location' in globalThis
    ? globalThis.location
    : ({ pathname: '', search: '', hash: '' } as Location),
);
