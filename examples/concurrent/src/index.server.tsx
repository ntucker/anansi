import { useController } from 'rest-hooks';
import {
  laySpouts,
  documentSpout,
  restHooksSpout,
  prefetchSpout,
  routerSpout,
} from '@anansi/core/server';
import React from 'react';

import app from 'app';

import { createRouter } from './routing';

// get rid of warning spam
React.useLayoutEffect = React.useEffect;

const appSpout = () => Promise.resolve({ app });

const spouts = prefetchSpout('controller')(
  documentSpout({ title: 'anansi' })(
    restHooksSpout()(
      routerSpout({ useResolveWith: useController, createRouter })(appSpout),
    ),
  ),
);

export default laySpouts(spouts);
