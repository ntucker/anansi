import React from 'react';
import type { Route } from '@anansi/router';

import type { ResolveProps } from './types';

type NeededProps = ResolveProps;

export default function JSONSpout({
  id = 'anansi-json',
}: { id?: string } = {}) {
  return function <T extends NeededProps>(
    next: (initData: Record<string, unknown>) => Promise<T>,
  ) {
    return async () => {
      const initData = getDatafromDOM(id);
      const nextProps = await next(initData);

      return nextProps;
    };
  };
}
function getDatafromDOM(id: string): Record<string, unknown> {
  const element: HTMLScriptElement | null = document.querySelector(`#${id}`);
  return element?.text ? JSON.parse(element?.text) : undefined;
}
