import React from 'react';
import type { Route } from '@anansi/router';

import type { ResolveProps } from './types';
import Document from './DocumentComponent';

type NeededProps = {
  matchedRoutes: Route<any>[];
  title?: string;
} & ResolveProps;

export default function documentSpout(options: {
  head?: React.ReactNode;
  title: string;
}) {
  return function <T extends NeededProps>(next: () => Promise<T>) {
    return async () => {
      const nextProps = await next();

      return {
        ...nextProps,
        app: (
          <Document
            {...options}
            title={nextProps.title ?? options.title}
            assets={(globalThis as any).assetManifest}
          >
            {nextProps.app}
          </Document>
        ),
      };
    };
  };
}
