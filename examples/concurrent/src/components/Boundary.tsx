import { memo, Suspense } from 'react';
import type { ReactNode } from 'react';
import { ErrorBoundary } from '@anansi/router';

import NotFound from 'components/NotFound';

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
