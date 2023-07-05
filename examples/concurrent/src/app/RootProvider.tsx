import { AsyncBoundary, CacheProvider } from '@data-client/react';
import type { ReactNode } from 'react';

import { DemoProvider } from './demo';

type ComponentProps<T> = T extends
  | React.ComponentType<infer P>
  | React.Component<infer P>
  ? JSX.LibraryManagedAttributes<T, P>
  : never;

type Props = { children: ReactNode } & ComponentProps<typeof CacheProvider>;

export default function RootProvider({ children, ...rest }: Props) {
  return (
    <DemoProvider>
      <AsyncBoundary fallback={null}>{children}</AsyncBoundary>
    </DemoProvider>
  );
}
