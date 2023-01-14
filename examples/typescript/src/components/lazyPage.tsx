import { memoize } from 'lodash';
import { lazy } from 'react';

function lazyPage(pageName: string) {
  const Page = lazy(
    () => import(/* webpackChunkName: '[request]' */ `pages/${pageName}.tsx`),
  );
  return Page;
}
export default memoize(lazyPage);
