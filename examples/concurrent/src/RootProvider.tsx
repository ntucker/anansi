import { CacheProvider } from 'rest-hooks';
import type { ReactNode } from 'react';

import { DemoProvider } from 'DemoProvider';

import Boundary from './Boundary';

type ComponentProps<T> = T extends
  | React.ComponentType<infer P>
  | React.Component<infer P>
  ? JSX.LibraryManagedAttributes<T, P>
  : never;

type Props = { children: ReactNode } & ComponentProps<typeof CacheProvider>;

export default function RootProvider({ children, ...rest }: Props) {
  return (
    <DemoProvider>
      <Boundary fallback={null}>{children}</Boundary>
    </DemoProvider>
  );
}
