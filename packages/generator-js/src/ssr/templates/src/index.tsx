import { useController, AsyncBoundary } from '@data-client/react';
import {
  floodSpouts,
  documentSpout,
  restHooksSpout,
  routerSpout,
  JSONSpout,
  appSpout,
} from '@anansi/core';

import App from './App';
import { createRouter } from './routing';

const app = (
  <AsyncBoundary>
    <App />
  </AsyncBoundary>
);

const spouts = JSONSpout()(
  documentSpout({ title: 'anansi' })(
    restHooksSpout()(
      routerSpout({
        useResolveWith: useController,
        createRouter,
      })(appSpout(app)),
    ),
  ),
);

export default floodSpouts(spouts);
