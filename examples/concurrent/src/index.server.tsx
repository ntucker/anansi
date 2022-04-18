import { useController } from 'rest-hooks';
import {
  laySpouts,
  documentSpout,
  restHooksSpout,
  prefetchSpout,
  routerSpout,
} from '@anansi/core/server';

import app from 'app';

import { createRouter } from './routing';

const appSpout = () => Promise.resolve({ app });

const spouts = prefetchSpout('controller')(
  documentSpout({ title: 'anansi' })(
    restHooksSpout()(
      routerSpout({ useResolveWith: useController, createRouter })(appSpout),
    ),
  ),
);

export default laySpouts(spouts);
