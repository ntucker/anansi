import { memo, Suspense } from 'react';
import type { ReactNode } from 'react';

import NotFound from 'components/NotFound';

import ErrorBoundary from './ErrorBoundary';

function Boundary({
  children,
  fallback,
}: {
  children: ReactNode;
  fallback:
    | boolean
    | React.ReactChild
    | React.ReactFragment
    | React.ReactPortal
    | null;
}) {
  return (
    <Suspense fallback={fallback}>
      <ErrorBoundary fallbackComponent={NotFound}>{children}</ErrorBoundary>
    </Suspense>
  );
}
export default memo(Boundary);
