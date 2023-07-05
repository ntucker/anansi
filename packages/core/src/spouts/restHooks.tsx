import { type Manager } from '@data-client/react';

import type { ClientSpout } from './types.js';

export default function restHooksSpout(
  options: {
    getManagers?: () => Manager[];
  } = {},
): ClientSpout<{ getInitialData: (key: string) => Promise<any> }> {
  return next => async props => {
    const nextProps = await next(props);
    const [data, { CacheProvider }] = await Promise.all([
      props.getInitialData('resthooks'),
      import('./restHooks.provider.js'),
    ]);

    if (process.env.NODE_ENV !== 'production' && !data) {
      console.error('Rest Hooks init data not found');
    } else if (!data) {
      console.info('Rest Hooks init missing');
    }

    return {
      ...nextProps,
      app: (
        <CacheProvider initialState={data} managers={options?.getManagers?.()}>
          {nextProps.app}
        </CacheProvider>
      ),
    };
  };
}
