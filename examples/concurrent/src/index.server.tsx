import { useController } from 'rest-hooks';

import laySpouts from 'ssr/laySpouts';
import documentSpout from 'ssr/spouts/document.server';
import restHooksSpout from 'ssr/spouts/restHooks.server';
import prefetchSpout from 'ssr/spouts/prefetch.server';
import routerSpout from 'ssr/spouts/router.server';
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
