import React, { Suspense } from 'react';

import type { ServerSpout } from './types.js';

type NeededNext = {
  initData?: Record<string, () => unknown>;
  scripts?: React.ReactNode[];
};

/** Serialize data for safe embedding in <script type="application/json"> tags.
 * - Escapes < to prevent </script> injection
 * - Escapes U+2028/U+2029 line separators for older browser compatibility
 */
export function serializeForScriptTag(data: unknown): string {
  return JSON.stringify(data)
    .replace(/</g, '\\u003c')
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029');
}

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
          const encoded = serializeForScriptTag(data);
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
