import { useController } from '@rest-hooks/react';
import {
  floodSpouts,
  documentSpout,
  restHooksSpout,
  routerSpout,
  JSONSpout,
  appSpout,
} from '@anansi/core';
import Boundary from 'components/Boundary';

import App from './App';
import { createRouter } from './routing';

const app = (
  <Boundary fallback={null}>
    <App />
  </Boundary>
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
