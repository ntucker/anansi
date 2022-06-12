import { Manager, NetworkManager } from '@rest-hooks/core';

import { createPersistedStore } from './rhHelp';
import type { ResolveProps, ServerProps } from './types';

type NeededProps = { initData?: Record<string, () => unknown> } & ResolveProps;

export default function restHooksSpout(
  options: {
    getManagers: () => Manager[];
  } = { getManagers: () => [new NetworkManager()] },
) {
  return function <T extends NeededProps>(
    next: (props: ServerProps) => Promise<T>,
  ) {
    return async (props: ServerProps) => {
      const [ServerCacheProvider, controller, store] = createPersistedStore(
        options.getManagers(),
      );

      const nextProps = await next(props);

      return {
        ...nextProps,
        controller,
        initData: {
          ...nextProps.initData,
          resthooks: () => store.getState(),
        },
        app: <ServerCacheProvider>{nextProps.app}</ServerCacheProvider>,
      };
    };
  };
}
