import { RouteController } from '@anansi/router';
import type { History } from 'history';
import NotFound from 'components/NotFound';

import { routes, namedPaths } from './routes';

export function createRouter(history: History) {
  return new RouteController({
    history,
    namedPaths,
    routes,
    notFound: { component: NotFound },
  });
}
