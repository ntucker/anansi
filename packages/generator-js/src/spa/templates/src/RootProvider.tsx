import { Suspense } from 'react';
import type { ReactNode } from 'react';
import { CacheProvider } from 'rest-hooks';

export default function RootProvider({ children }: { children: ReactNode }) {
  return (
    <CacheProvider>
      <Suspense fallback={null}>{children}</Suspense>
    </CacheProvider>
  );
}
