import { CacheProvider } from 'rest-hooks';
import type { ReactNode } from 'react';

import { Router } from './routing';
import Boundary from './Boundary';

type ComponentProps<T> = T extends
  | React.ComponentType<infer P>
  | React.Component<infer P>
  ? JSX.LibraryManagedAttributes<T, P>
  : never;

type Props = { children: ReactNode } & ComponentProps<typeof CacheProvider>;

export default function RootProvider({ children, ...rest }: Props) {
  return (
    <CacheProvider {...rest}>
      <Router>
        <Boundary fallback={null}>{children}</Boundary>
      </Router>
    </CacheProvider>
  );
}
