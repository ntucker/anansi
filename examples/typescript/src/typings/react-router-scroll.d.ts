declare module 'react-router-scroll-4' {
  import { RouteChildrenProps } from 'react-router';
  interface Props {
    scrollBehavior?: Function;
    shouldUpdateScroll: (
      prevRouterProps: RouteChildrenProps,
      routerProps: RouteChildrenProps,
    ) => boolean | [number, number];
    children: React.ReactChild;
  }
  export class ScrollContext extends React.Component<Props> {}
}
