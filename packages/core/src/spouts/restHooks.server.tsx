import { Controller, Manager, NetworkManager, State } from '@rest-hooks/core';
import type { Store } from 'redux';

import { createPersistedStore } from './rhHelp';
import type { ResolveProps, ServerProps } from './types';

type NeededNext = { initData?: Record<string, () => unknown> } & ResolveProps;

export default function restHooksSpout(
  options: {
    getManagers: () => Manager[];
  } = { getManagers: () => [new NetworkManager()] },
) {
  return function <N extends NeededNext, I extends ServerProps>(
    next: (
      props: I & { controller: Controller; store: Store<State<unknown>> },
    ) => Promise<N>,
  ) {
    return async (props: I) => {
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
      };
    };
  };
}
