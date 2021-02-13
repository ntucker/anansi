import { Suspense } from 'react';
import type { ReactNode } from 'react';
import { NetworkErrorBoundary } from 'rest-hooks';

export default function Boundary({ children }: { children: ReactNode }) {
  return (
    <Suspense fallback={null}>
      <NetworkErrorBoundary>{children}</NetworkErrorBoundary>
    </Suspense>
  );
}
