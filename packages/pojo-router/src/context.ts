import { createContext } from 'react';
import type { Location } from 'history';

import RouteController from './Controller';

export const ControllerContext = createContext(
  new RouteController({ namedPaths: {}, routes: [], notFound: undefined }),
);

export const LocationContext = createContext(
  'location' in globalThis
    ? globalThis.location
    : ({ pathname: '', search: '', hash: '' } as Location),
);
