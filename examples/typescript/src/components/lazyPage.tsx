import React, { lazy } from 'react';
import { memoize } from 'lodash';

function lazyPage(pageName: string) {
  return lazy(() =>
    import(/* webpackChunkName: '[request]' */ `pages/${pageName}`),
  );
}
export default memoize(lazyPage);
