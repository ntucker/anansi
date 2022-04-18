import { CacheProvider, Manager, NetworkManager } from '@rest-hooks/core';
import { ServerDataComponent, getDatafromDOM } from '@rest-hooks/ssr';

import type { ResolveProps } from './types';

type NeededProps = ResolveProps;

export default function restHooksSpout(
  options: {
    getManagers: () => Manager[];
  } = { getManagers: () => [new NetworkManager()] },
) {
  return function <T extends NeededProps>(next: () => Promise<T>) {
    return async () => {
      const data = getDatafromDOM();

      const nextProps = await next();

      return {
        ...nextProps,
        app: (
          <CacheProvider initialState={data} managers={options.getManagers()}>
            {nextProps.app}
            <ServerDataComponent data={data} />
          </CacheProvider>
        ),
      };
    };
  };
}
