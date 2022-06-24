import React from 'react';

import type { ServerSpout } from './types';

type NeededNext = {
  initData?: Record<string, () => unknown>;
  scripts?: React.ReactNode[];
};

export default function JSONSpout({
  id = 'anansi-json',
}: { id?: string } = {}): ServerSpout<
  Record<string, unknown>,
  Record<string, unknown>,
  NeededNext
> {
  return next => async props => {
    const nextProps = await next(props);

    const scripts: React.ReactNode[] = nextProps.scripts ?? [];
    /*
      Object.entries(nextProps.initData ?? {}).forEach(([key, data]) => {
        try {
          const encoded = JSON.stringify(data);
          scripts.push(
            <script
              key={key}
              id={`${id}-${key}`}
              type="application/json"
              dangerouslySetInnerHTML={{
                __html: encoded,
              }}
              nonce={props.nonce}
            />,
          );
        } catch (e) {
          // TODO: Use unified logging
          console.error(e);
        }
      });*/
    const Script = () => {
      try {
        const data: any = {};
        Object.entries(nextProps.initData ?? {}).forEach(([key, getData]) => {
          data[key] = getData();
        });
        const encoded = JSON.stringify(data);
        return (
          <script
            key={id}
            id={id}
            type="application/json"
            dangerouslySetInnerHTML={{
              __html: encoded,
            }}
            nonce={props.nonce}
          />
        );
      } catch (e) {
        // TODO: Use unified logging
        console.error('Error serializing json');
        console.error(e);
        return null;
      }
    };
    scripts.push(<Script />);

    return {
      ...nextProps,
      scripts,
    };
  };
}
