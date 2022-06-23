import React from 'react';
import type { Route } from '@anansi/router';

import type { ResolveProps } from './types';

type NeededNext = {
  matchedRoutes: Route<any>[];
  title?: string;
} & ResolveProps;

export default function documentSpout(options: {
  head?: React.ReactNode;
  title: string;
}) {
  return function <N extends NeededNext, I extends Record<string, unknown>>(
    next: (props: I) => Promise<N>,
  ) {
    return async (props: I) => {
      const nextProps = await next(props);

      return nextProps;
    };
  };
}
