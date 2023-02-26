import memoize from 'nano-memoize';
import React, { lazy, memo } from 'react';

import type { LazyPage } from './types.js';

function lazyPage<T extends React.ComponentType<any>>(
  factory: () => Promise<{ default: T }>,
): LazyPage<React.ComponentProps<T>> {
  let PageComponent: any = lazy(factory);
  PageComponent = memo(PageComponent);
  PageComponent.preload = factory;
  return PageComponent;
}
export default memoize(lazyPage);
