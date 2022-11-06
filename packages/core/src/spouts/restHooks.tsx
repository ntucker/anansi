import { CacheProvider, Manager, NetworkManager } from '@rest-hooks/core';

import type { ClientSpout } from './types';

export default function restHooksSpout(
  options: {
    getManagers: () => Manager[];
  } = { getManagers: () => [new NetworkManager()] },
): ClientSpout<{ getInitialData: (key: string) => Promise<any> }> {
  return next => async props => {
    const nextProps = await next(props);
    const data = await props.getInitialData('resthooks');

    if (process.env.NODE_ENV !== 'production' && !data) {
      console.error('Rest Hooks init data not found');
    }

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
