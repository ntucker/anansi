import React from 'react';
import type { Route } from '@anansi/router';

import type { ResolveProps } from './types';

type NeededProps = {
  matchedRoutes: Route<any>[];
  title?: string;
} & ResolveProps;

export default function documentSpout(options: {
  head?: React.ReactNode;
  title: string;
}) {
  return function <T extends NeededProps>(
    next: (initData: Record<string, unknown>) => Promise<T>,
  ) {
    return async (initData: Record<string, unknown>) => {
      const nextProps = await next(initData);

      return nextProps;
    };
  };
}
