import { memo, Suspense } from 'react';
import { NetworkErrorBoundary } from 'rest-hooks';
import type { ReactNode } from 'react';

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
      <NetworkErrorBoundary>{children}</NetworkErrorBoundary>
    </Suspense>
  );
}
export default memo(Boundary);
