import React, { type JSX } from 'react';

import type { ServerSpout } from './types.js';

type NeededNext = {
  initData?: Record<string, () => unknown>;
  scripts?: React.ReactNode[];
  extraStyle?: React.ReactNode[];
};

export default function antdSpout(): ServerSpout<
  Record<string, unknown>,
  Record<string, unknown>,
  NeededNext
> {
  return next => async props => {
    const { createCache, extractStyle, StyleProvider } = await import(
      '@ant-design/cssinjs'
    );
    const cache = createCache();

    const nextProps = await next(props);

    const scripts: React.ReactNode[] = nextProps.scripts ?? [];

    const AntdSheets = (): JSX.Element => {
      return (
        <script
          dangerouslySetInnerHTML={{
            __html: `</script>${extractStyle(cache)}<script>`,
          }}
        />
      );
    };
    // unfortunately we have to inject this after the entire content has streamed in or it doesn't correctly populate
    // see: https://github.com/ant-design/cssinjs/issues/79
    scripts.push(<AntdSheets />);

    return {
      ...nextProps,
      app: <StyleProvider cache={cache}>{nextProps.app}</StyleProvider>,
      scripts,
    };
  };
}
