declare module 'react-router-scroll-4' {
  import type { ReactChild } from 'react';
  import { Component } from 'react';
  import { RouteChildrenProps } from 'react-router-dom';
  interface Props {
    scrollBehavior?: (...args: any) => any;
    shouldUpdateScroll: (
      prevRouterProps: RouteChildrenProps,
      routerProps: RouteChildrenProps,
    ) => boolean | [number, number];
    children: ReactChild;
  }
  // eslint-disable-next-line react/prefer-stateless-function
  export class ScrollContext extends Component<Props> {}
}
