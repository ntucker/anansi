import { useController } from 'rest-hooks';
import {
  laySpouts,
  documentSpout,
  restHooksSpout,
  prefetchSpout,
  routerSpout,
  JSONSpout,
} from '@anansi/core/server';
import Boundary from 'components/Boundary';

import App from './App';
import { createRouter } from './routing';

const app = (
  <Boundary fallback={null}>
    <App />
  </Boundary>
);

const appSpout = () => Promise.resolve({ app });

const csPolicy = {
  'base-uri': "'self'",
  'object-src': "'none'",
  'script-src': ["'self'"],
  'style-src': ["'unsafe-inline'", "'self'"],
};
if (process.env.NODE_ENV !== 'production') {
  csPolicy['script-src'].push("'unsafe-inline'");
}

const spouts = prefetchSpout('controller')(
  documentSpout({
    title: 'anansi',
    csPolicy,
  })(
    JSONSpout()(
      restHooksSpout()(
        routerSpout({ useResolveWith: useController, createRouter })(appSpout),
      ),
    ),
  ),
);

export default laySpouts(spouts);
