import { lazy } from 'react';
import { memoize } from 'lodash';

function lazyPage(pageName: string) {
  const Page = lazy(
    () =>
      import(/* webpackChunkName: '[request]' */ `pages/${pageName}/index.tsx`),
  );
  return Page;
}
export default memoize(lazyPage);
