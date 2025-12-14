import { createCache, StyleProvider } from '@ant-design/cssinjs';

import type { ClientSpout } from './types.js';

export function antdSpout(): ClientSpout {
  return next => async props => {
    const cache = createCache();

    const nextProps = await next(props);

    return {
      ...nextProps,
      app: <StyleProvider cache={cache}>{nextProps.app}</StyleProvider>,
    };
  };
}
