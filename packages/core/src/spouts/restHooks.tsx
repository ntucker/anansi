import {
  CacheProvider,
  Manager,
  NetworkManager,
  State,
} from '@rest-hooks/core';

import type { ResolveProps } from './types';

type NeededProps = ResolveProps;

export default function restHooksSpout(
  options: {
    getManagers: () => Manager[];
  } = { getManagers: () => [new NetworkManager()] },
) {
  return function <T extends NeededProps>(
    next: (initData: Record<string, unknown>) => Promise<T>,
  ) {
    return async (initData: Record<string, unknown>) => {
      const data = initData.resthooks as State<unknown>;

      const nextProps = await next(initData);

      return {
        ...nextProps,
        app: (
          <CacheProvider initialState={data} managers={options.getManagers()}>
            {nextProps.app}
          </CacheProvider>
        ),
      };
    };
  };
}
