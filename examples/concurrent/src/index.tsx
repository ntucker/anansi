import { useController } from 'rest-hooks';
import {
  floodSpouts,
  documentSpout,
  restHooksSpout,
  routerSpout,
} from '@anansi/core';

import app from 'app';

import { createRouter } from './routing';

const appSpout = () => Promise.resolve({ app });

const spouts = documentSpout({ title: 'anansi' })(
  restHooksSpout()(
    routerSpout({ useResolveWith: useController, createRouter })(appSpout),
  ),
);

export default floodSpouts(spouts);
