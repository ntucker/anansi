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
    const data = props.initData?.resthooks as State<unknown>;

    if (process.env.NODE_ENV !== 'production' && !data) {
      console.error('Rest Hooks init data not found');
    }

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
