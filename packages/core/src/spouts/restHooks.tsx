import {
  CacheProvider,
  Manager,
  NetworkManager,
  State,
} from '@rest-hooks/core';

import type { ResolveProps } from './types';

type NeededNext = ResolveProps;

export default function restHooksSpout(
  options: {
    getManagers: () => Manager[];
  } = { getManagers: () => [new NetworkManager()] },
) {
  return function <N extends NeededNext, I extends Record<string, unknown>>(
    next: (props: I) => Promise<N>,
  ) {
    return async (props: I & { initData: Record<string, unknown> }) => {
      const data = props.initData.resthooks as State<unknown>;

      const nextProps = await next(props);

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
