import React, { lazy, Suspense } from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import { memoize } from 'lodash';
import { RouteChildrenProps } from 'react-router';
import ErrorBoundary from 'components/ErrorBoundary';

function lazyPage(pageName: string) {
  const Page = lazy(() =>
    import(/* webpackChunkName: '[request]' */ `pages/${pageName}`),
  );
  return (props: RouteChildrenProps) => (
    <Suspense
      fallback={
        <div className="center">
          <CircularProgress />
        </div>
      }
    >
      <ErrorBoundary key={props.location && props.location.key}>
        <Page {...props} />
      </ErrorBoundary>
    </Suspense>
  );
}
export default memoize(lazyPage);
