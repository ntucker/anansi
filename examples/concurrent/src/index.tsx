import { useController } from 'rest-hooks';

import floodSpouts from 'ssr/floodSpouts';
import documentSpout from 'ssr/spouts/document';
import restHooksSpout from 'ssr/spouts/restHooks';
import routerSpout from 'ssr/spouts/router';
import app from 'app';

import { createRouter } from './routing';

const appSpout = () => Promise.resolve({ app });

const spouts = documentSpout({ title: 'anansi' })(
  restHooksSpout()(
    routerSpout({ useResolveWith: useController, createRouter })(appSpout),
  ),
);

floodSpouts(spouts);
