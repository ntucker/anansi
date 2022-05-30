import { useController } from 'rest-hooks';
import {
  laySpouts,
  documentSpout,
  restHooksSpout,
  prefetchSpout,
  routerSpout,
} from '@anansi/core/server';
import Boundary from 'components/Boundary';

import App from './App';
import { createRouter } from './routing';

const app = (
  <Boundary fallback={null}>
    <App />
  </Boundary>
);

const appSpout = () => Promise.resolve({ app });

const spouts = prefetchSpout('controller')(
  documentSpout({ title: 'anansi' })(
    restHooksSpout()(
      routerSpout({ useResolveWith: useController, createRouter })(appSpout),
    ),
  ),
);

export default laySpouts(spouts);
