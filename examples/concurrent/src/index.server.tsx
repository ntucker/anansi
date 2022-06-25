import { useController } from 'rest-hooks';
import {
  laySpouts,
  documentSpout,
  restHooksSpout,
  prefetchSpout,
  routerSpout,
  JSONSpout,
  ServerProps,
  //appSpout,
  Spout,
} from '@anansi/core/server';
import { Controller } from '@rest-hooks/core';

import app from 'app';

import { createRouter } from './routing';

const csPolicy = {
  'base-uri': "'self'",
  'object-src': "'none'",
  'script-src': ["'self'"],
  'style-src': ["'unsafe-inline'", "'self'"],
};
if (process.env.NODE_ENV !== 'production') {
  csPolicy['script-src'].push("'unsafe-inline'");
}

const appSpout =
  (app: JSX.Element) =>
  (props: ServerProps): Promise<{ app: JSX.Element }> =>
    Promise.resolve({ ...props, app });

const authSpout: Spout<{ controller: Controller }, unknown, unknown> =
  next => async props => {
    const nextProps = await next(props);

    return nextProps;
  };
const ap = appSpout(app);
const r = routerSpout({ useResolveWith: useController, createRouter })(ap);
const a = authSpout(r);
const b = restHooksSpout()(a);
const spouts = prefetchSpout('controller')(
  documentSpout({
    title: 'anansi',
    csPolicy,
  })(
    JSONSpout()(
      restHooksSpout()(
        authSpout(
          routerSpout({ useResolveWith: useController, createRouter })(
            appSpout(app),
          ),
        ),
      ),
    ),
  ),
);

export default laySpouts(spouts);

type A = unknown & ServerProps;
