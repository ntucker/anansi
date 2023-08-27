import {
  floodSpouts,
  documentSpout,
  dataClientSpout,
  routerSpout,
  JSONSpout,
  appSpout,
} from '@anansi/core';
import { useController } from '@data-client/react';
import app from 'app';

import { createRouter } from './routing';

const spouts = documentSpout({ title: 'anansi' })(
  JSONSpout()(
    dataClientSpout()(
      routerSpout({
        useResolveWith: useController,
        createRouter,
      })(appSpout(app)),
    ),
  ),
);

export default floodSpouts(spouts);
