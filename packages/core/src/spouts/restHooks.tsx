import { type Manager } from '@rest-hooks/react';

import type { ClientSpout } from './types';

export default function restHooksSpout(
  options: {
    getManagers?: () => Manager[];
  } = {},
): ClientSpout<{ getInitialData: (key: string) => Promise<any> }> {
  return next => async props => {
    const nextProps = await next(props);
    const [data, { CacheProvider }] = await Promise.all([
      props.getInitialData('resthooks'),
      import('./restHooks.provider'),
    ]);

    if (process.env.NODE_ENV !== 'production' && !data) {
      console.error('Rest Hooks init data not found');
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
