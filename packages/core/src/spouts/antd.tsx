import type { ClientSpout } from './types.js';

export default function antdSpout(): ClientSpout {
  return next => async props => {
    const { createCache, StyleProvider } = await import(
      /* webpackIgnore: true */ '@ant-design/cssinjs'
    );
    const cache = createCache();

    const nextProps = await next(props);

    return {
      ...nextProps,
      app: <StyleProvider cache={cache}>{nextProps.app}</StyleProvider>,
    };
  };
}
