import { type Manager } from '@data-client/react';
import { initialState } from '@data-client/redux';

import type { ClientSpout } from './types.js';

export default function dataClientSpout(
  options: {
    getManagers?: () => Manager[];
  } = {},
): ClientSpout<{ getInitialData: (key: string) => Promise<any> }> {
  return next => async props => {
    const nextProps = await next(props);
    const [data, { DataProvider }] = await Promise.all([
      props.getInitialData('dataclient').catch(e => {
        console.error('Data Client initial data could not load:', e);
        return initialState;
      }),
      import('./dataClient.provider.js'),
    ]);

    if (!data) {
      console.error('Data Client init data not found');
    }

    return {
      ...nextProps,
      app: (
        <DataProvider initialState={data} managers={options?.getManagers?.()}>
          {nextProps.app}
        </DataProvider>
      ),
    };
  };
}
