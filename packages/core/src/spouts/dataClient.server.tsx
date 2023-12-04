import {
  type Controller,
  type Manager,
  type State,
  type Store,
} from '@data-client/react';

import type { ServerSpout } from './types.js';

export default function dataClientSpout(
  options: {
    getManagers?: () => Manager[];
  } = {},
): ServerSpout<
  Record<string, unknown>,
  { controller: Controller } & { store: Store<State<unknown>> },
  { initData?: Record<string, () => unknown>; scripts?: React.ReactNode[] }
> {
  return next => async props => {
    const managers = options?.getManagers?.() ?? [
      new (await import('@data-client/react')).NetworkManager(),
    ];
    const { createPersistedStore } = await import('@data-client/ssr');
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
        dataclient: useReadyCacheState,
      },
      app: <ServerCacheProvider>{nextProps.app}</ServerCacheProvider>,
      // TODO: figure out how to only inject in next and not have to also put here
      controller,
      store,
    };
  };
}
