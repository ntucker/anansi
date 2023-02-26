import React, { Suspense } from 'react';

import type { ServerSpout } from './types.js';

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

    Object.entries(nextProps.initData ?? {}).forEach(([key, useData]) => {
      const globalId = `${id}.${key}`;
      const Script = () => {
        const data: any = useData();
        try {
          const encoded = JSON.stringify(data);
          return (
            <script
              id={globalId}
              type="application/json"
              dangerouslySetInnerHTML={{
                __html: encoded,
              }}
              nonce={props.nonce}
            />
          );
        } catch (e) {
          // TODO: Use unified logging
          console.error(`Error serializing json for ${key}`);
          console.error(e);
          return null;
        }
      };
      scripts.push(
        <Suspense key={globalId}>
          <Script />
        </Suspense>,
      );
    });

    return {
      ...nextProps,
      scripts,
    };
  };
}
