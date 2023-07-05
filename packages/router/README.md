# @anansi/router
<!--[![CircleCI](https://circleci.com/gh/notwillk/pojo-router.svg?style=shield)](https://circleci.com/gh/notwillk/pojo-router)-->
[![npm downloads](https://img.shields.io/npm/dm/@anansi/router.svg?style=flat-square)](https://www.npmjs.com/package/@anansi/router)
[![bundle size](https://img.shields.io/bundlephobia/minzip/@anansi/router?style=flat-square)](https://bundlephobia.com/result?p=@anansi/router)
[![npm version](https://img.shields.io/npm/v/@anansi/router.svg?style=flat-square)](https://www.npmjs.com/package/@anansi/router)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)

A simple router designed for React 18 concurrent mode.

- Automatic code splitting
- Parallel fetch
  - JS code
  - CSS code
  - images
  - data
- Take advantage of Suspense with Concurrent rendering
  - Fetch-as-you-render

## [Demo](https://stackblitz.com/github/ntucker/anansi/tree/master/examples/concurrent)


<details><summary><b>Slow network</b></summary>

<video controls>
<source src="https://user-images.githubusercontent.com/866147/154827978-e6cbe6df-9c25-489b-9160-7c9abaaa507d.mp4"
        type="video/mp4">
Sorry, your browser doesn't support embedded videos.
</video>


Parallel fetches

- JS code
- CSS code
- images
- data

</details>

<details><summary><b>Fast network</b></summary>

<video controls>
<source src="https://user-images.githubusercontent.com/866147/154827979-67934e09-704e-4b94-a710-939f456b1a4f.mp4"
        type="video/mp4">
Sorry, your browser doesn't support embedded videos.
</video>

Even though all the data must be fetched - it appears instant because React delays rendering until the resources are available.

</details>

```tsx
import { Controller, useController } from '@data-client/react';
import { createBrowserHistory } from 'history';
import { lazy, Route, RouteController, RouteProvider } from '@anansi/router';

const lazyPage = (pageName: string) =>
  lazy(() => import(/* webpackChunkName: '[request]' */ `pages/${pageName}`));

const routes: Route<Controller>[] = [
  { name: 'home', component: lazyPage('Home') },
  {
    name: 'posts',
    component: lazyPage('Posts'),
    resolveData: async ({ fetch }: Controller) => fetch(PostResource.list(), {}),
  },
];

const history = createBrowserHistory();

export const router = new RouteController({
  history,
  namedPaths,
  routes,
  notFound: { component: NotFound },
});

export function Router({ children }: { children: React.ReactNode }) {
  const controller = useController();
  return (
    <RouteProvider
      initialPath={globalThis.location.pathname}
      router={router}
      resolveWith={controller}
    >
      {children}
    </RouteProvider>
  );
}
```

## API

### type Route

```ts
interface Route<ResolveWith, Match = any> {
  name: string;
  component: React.ComponentType<any>;
  resolveData?: (
    resolveWith: ResolveWith,
    match: Match & Route<ResolveWith, Match>,
  ) => Promise<void>;
}
```

#### name: string

Identifies the route

#### component: lazyComponent

Component to render when this route matches

#### resolveData?

`resolveData` is called when a location change occurs. Use this to prime your
networking cache with data needed for this route's components.

The resolution marks completion of a React concurrent transition.

The first argument passed will be whatevever you passed to the `&lt;RouteProvider/>`'s resolveWith.
This helps with dispatchers whose lifetime is restricted to React.

#### ... more

Additional members can be defined and will be passed as props to the component.

### lazy(() => Promise<{ default: Component }>)

Like React.lazy() but built for fetch-as-you-render as well as being memo'd.

Component will be rendered with props from the route match as well as any matching elements (like 'id' for `/users/:id`)

### &lt;RouteProvider/>

Tracks and binds history to React. Place this in your top level provider.


### &lt;MatchedRoute/>

Renders the currently matched route with the route passed as props. Place this in the body of your application below
the &lt;RouteProvider/>

### useShowLoading(timeoutMs=100): boolean

This returns true when React is transitioning in Suspense. Use this to render a loading indicator in your application.
