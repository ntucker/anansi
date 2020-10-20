import React, { lazy, memo, Suspense } from 'react';
import { memoize } from 'lodash';
import { Spin } from 'antd';
import ErrorBoundary from 'components/ErrorBoundary';

function lazyPage(pageName: string) {
  const Page = lazy(
    () => import(/* webpackChunkName: '[request]' */ `pages/${pageName}`),
  );
  return memo(props => (
    <Suspense
      fallback={
        <div className="center">
          <Spin size="large" />
        </div>
      }
    >
      <ErrorBoundary>
        <Page {...props} />
      </ErrorBoundary>
    </Suspense>
  ));
}
export default memoize(lazyPage);
