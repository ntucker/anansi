import { memo, Suspense } from 'react';
import type { ReactNode } from 'react';
import { ErrorBoundary } from '@anansi/router';

import NotFound from './NotFound';

function Boundary({
  children,
  fallback,
}: {
  children: ReactNode;
  fallback: ReactNode | undefined;
}) {
  return (
    <Suspense fallback={fallback}>
      <ErrorBoundary fallbackComponent={NotFound}>{children}</ErrorBoundary>
    </Suspense>
  );
}
export default memo(Boundary);
