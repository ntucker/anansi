import { useController } from '@rest-hooks/react';
import {
  laySpouts,
  documentSpout,
  restHooksSpout,
  prefetchSpout,
  routerSpout,
  JSONSpout,
  appSpout,
} from '@anansi/core/server';
import Boundary from 'components/Boundary';

import App from './App';
import { createRouter } from './routing';

const app = (
  <Boundary fallback={null}>
    <App />
  </Boundary>
);

const csPolicy = {
  'base-uri': "'self'",
  'object-src': "'none'",
  'script-src': ["'self'"],
  'style-src': ["'unsafe-inline'", "'self'"],
};
if (process.env.NODE_ENV !== 'production') {
  // this is necessary for hot reloading injections as there is currently no way to specify a nonce
  csPolicy['script-src'].push("'unsafe-inline'");
}

const spouts = prefetchSpout('controller')(
  documentSpout({
    title: 'anansi',
    csPolicy,
  })(
    JSONSpout()(
      restHooksSpout()(
        routerSpout({ useResolveWith: useController, createRouter })(
          appSpout(app),
        ),
      ),
    ),
  ),
);

export default laySpouts(spouts);
