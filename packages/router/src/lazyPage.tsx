import { lazy, memo } from 'react';
import memoize from 'nano-memoize';

import type { LazyPage } from './types';

function lazyPage(pageName: string): LazyPage {
  const importStatement = () =>
    import(/* webpackChunkName: '[request]' */ `pages/${pageName}`);
  let PageComponent: any = lazy(importStatement);
  PageComponent = memo(PageComponent);
  PageComponent.preload = importStatement;
  return PageComponent;
}
export default memoize(lazyPage);
