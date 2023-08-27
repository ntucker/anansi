import { type Manager } from '@data-client/react';
import { initialState } from '@data-client/redux';

import type { ClientSpout } from './types.js';

export default function restHooksSpout(
  options: {
    getManagers?: () => Manager[];
  } = {},
): ClientSpout<{ getInitialData: (key: string) => Promise<any> }> {
  return next => async props => {
    const nextProps = await next(props);
    const [data, { CacheProvider }] = await Promise.all([
      props.getInitialData('resthooks').catch(e => {
        console.error('Rest Hooks initial data could not load:', e);
        return initialState;
      }),
      import('./restHooks.provider.js'),
    ]);

    if (!data) {
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
