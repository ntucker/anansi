import { Manager, NetworkManager } from '@rest-hooks/core';
import { createPersistedStore } from '@rest-hooks/ssr';

import type { ResolveProps, ServerProps } from './types';

type NeededProps = ResolveProps;

export default function restHooksSpout(
  options: {
    getManagers: () => Manager[];
  } = { getManagers: () => [new NetworkManager()] },
) {
  return function <T extends NeededProps>(
    next: (props: ServerProps) => Promise<T>,
  ) {
    return async (props: ServerProps) => {
      const [ServerCacheProvider, controller] = createPersistedStore(
        options.getManagers(),
      );

      const nextProps = await next(props);

      return {
        ...nextProps,
        controller,
        app: <ServerCacheProvider>{nextProps.app}</ServerCacheProvider>,
      };
    };
  };
}
