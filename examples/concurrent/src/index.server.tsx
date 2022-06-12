import { useController } from 'rest-hooks';
import {
  laySpouts,
  documentSpout,
  restHooksSpout,
  prefetchSpout,
  routerSpout,
  JSONSpout,
} from '@anansi/core/server';
import React from 'react';

import app from 'app';

import { createRouter } from './routing';

// get rid of warning spam
React.useLayoutEffect = React.useEffect;

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
