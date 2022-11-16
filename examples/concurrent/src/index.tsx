import { useController } from '@rest-hooks/react';
import {
  floodSpouts,
  documentSpout,
  restHooksSpout,
  routerSpout,
  JSONSpout,
  appSpout,
} from '@anansi/core';

import app from 'app';

import { createRouter } from './routing';

const spouts = documentSpout({ title: 'anansi' })(
  JSONSpout()(
    restHooksSpout()(
      routerSpout({
        useResolveWith: useController,
        createRouter,
      })(appSpout(app)),
    ),
  ),
);

export default floodSpouts(spouts);
