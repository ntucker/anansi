import { useController } from 'rest-hooks';
import {
  floodSpouts,
  documentSpout,
  restHooksSpout,
  routerSpout,
} from '@anansi/core';
import Boundary from 'components/Boundary';

import App from './App';
import { createRouter } from './routing';

const app = (
  <Boundary fallback={null}>
    <App />
  </Boundary>
);

const appSpout = () => Promise.resolve({ app });

const spouts = documentSpout({ title: 'anansi' })(
  restHooksSpout()(
    routerSpout({
      useResolveWith: useController,
      createRouter,
    })(appSpout),
  ),
);

export default floodSpouts(spouts);
