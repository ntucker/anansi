import {
  CacheProvider,
  Manager,
  NetworkManager,
  State,
} from '@rest-hooks/core';

import type { ClientSpout } from './types';

export default function restHooksSpout(
  options: {
    getManagers: () => Manager[];
  } = { getManagers: () => [new NetworkManager()] },
): ClientSpout<{ initData: Record<string, unknown> }> {
  return next => async props => {
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
}
