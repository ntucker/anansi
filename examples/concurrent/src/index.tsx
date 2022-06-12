import { useController } from 'rest-hooks';
import {
  floodSpouts,
  documentSpout,
  restHooksSpout,
  routerSpout,
  JSONSpout,
} from '@anansi/core';

import app from 'app';

import { createRouter } from './routing';

const appSpout = (v: unknown) => Promise.resolve({ app });

const spouts = JSONSpout()(
  documentSpout({ title: 'anansi' })(
    restHooksSpout()(
      routerSpout({
        useResolveWith: useController,
        createRouter,
      })(appSpout),
    ),
  ),
);

export default floodSpouts(spouts);
