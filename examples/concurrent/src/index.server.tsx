import {
  laySpouts,
  documentSpout,
  restHooksSpout,
  prefetchSpout,
  routerSpout,
  JSONSpout,
  appSpout,
  antdSpout,
} from '@anansi/core/server';
import { useController } from '@rest-hooks/react';

import app from 'app';

import { createRouter } from './routing';

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
    antdSpout()(
      JSONSpout()(
        restHooksSpout()(
          routerSpout({ useResolveWith: useController, createRouter })(
            appSpout(app),
          ),
        ),
      ),
    ),
  ),
);

export default laySpouts(spouts);
