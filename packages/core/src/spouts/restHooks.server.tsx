import { Controller, Manager, NetworkManager, State } from '@rest-hooks/core';
import type { Store } from 'redux';

import { createPersistedStore } from './rhHelp';
import type { ServerSpout } from './types';

export default function restHooksSpout(
  options: {
    getManagers: () => Manager[];
  } = { getManagers: () => [new NetworkManager()] },
): ServerSpout<
  Record<string, unknown>,
  { controller: Controller; store: Store<State<unknown>> },
  { initData?: Record<string, () => unknown> }
> {
  return next => async props => {
    const [ServerCacheProvider, controller, store] = createPersistedStore(
      options.getManagers(),
    );

    const nextProps = await next({
      ...props,
      controller,
      store,
    });

    return {
      ...nextProps,
      initData: {
        ...nextProps.initData,
        resthooks: () => store.getState(),
      },
      app: <ServerCacheProvider>{nextProps.app}</ServerCacheProvider>,
      // TODO: figure out how to only inject in next and not have to also put here
      controller,
      store,
    };
  };
}
