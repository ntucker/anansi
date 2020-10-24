declare module 'react-router-scroll-4' {
  import type { ReactChild } from 'react';
  import { Component } from 'react';
  import { RouteChildrenProps } from 'react-router';
  interface Props {
    scrollBehavior?: (...args: any) => any;
    shouldUpdateScroll: (
      prevRouterProps: RouteChildrenProps,
      routerProps: RouteChildrenProps,
    ) => boolean | [number, number];
    children: ReactChild;
  }
  export class ScrollContext extends Component<Props> {}
}
