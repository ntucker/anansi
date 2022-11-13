import { createPersistedStore } from '@rest-hooks/ssr';
import type { Store } from 'redux';
import {
  type Controller,
  type Manager,
  NetworkManager,
  type State,
} from 'rest-hooks';

import type { ServerSpout } from './types';

export default function restHooksSpout(
  options: {
    getManagers: () => Manager[];
  } = { getManagers: () => [new NetworkManager()] },
): ServerSpout<
  Record<string, unknown>,
  { controller: Controller } & { store: Store<State<unknown>> },
  { initData?: Record<string, () => unknown>; scripts?: React.ReactNode[] }
> {
  const managers = options.getManagers();
  return next => async props => {
    const [ServerCacheProvider, useReadyCacheState, controller, store] =
      createPersistedStore(managers);

    const nextProps = await next({
      ...props,
      controller,
      store,
    });
    return {
      ...nextProps,
      initData: {
        ...nextProps.initData,
        resthooks: useReadyCacheState,
      },
      app: <ServerCacheProvider>{nextProps.app}</ServerCacheProvider>,
      // TODO: figure out how to only inject in next and not have to also put here
      controller,
      store,
    };
  };
}
