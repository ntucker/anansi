import { createCache, extractStyle, StyleProvider } from '@ant-design/cssinjs';

import type { ClientSpout } from './types.js';

export function antdSpout(): ClientSpout<
  Record<string, unknown>,
  Record<string, unknown>,
  { extraStyle?: React.ReactNode[] }
> {
  return next => async props => {
    const cache = createCache();

    const nextProps = await next(props);

    const style = extractStyle(cache);

    return {
      ...nextProps,
      app: <StyleProvider cache={cache}>{nextProps.app}</StyleProvider>,
      extraStyle: [
        ...(nextProps.extraStyle ?? []),
        <style key="antd-style" dangerouslySetInnerHTML={{ __html: style }} />,
      ],
    };
  };
}
