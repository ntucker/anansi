# pojo-router
<!--[![CircleCI](https://circleci.com/gh/notwillk/pojo-router.svg?style=shield)](https://circleci.com/gh/notwillk/pojo-router)-->
[![npm downloads](https://img.shields.io/npm/dm/@pojo-router/core.svg?style=flat-square)](https://www.npmjs.com/package/@pojo-router/core)
[![bundle size](https://img.shields.io/bundlephobia/minzip/@pojo-router/core?style=flat-square)](https://bundlephobia.com/result?p=@pojo-router/core)
[![npm version](https://img.shields.io/npm/v/@pojo-router/core.svg?style=flat-square)](https://www.npmjs.com/package/@pojo-router/core)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)

A hook based machanism to convert a string (i.e. a path) into metadata.

# API

Define your metadata in a provider component.

```javascript
import React from 'react';
import PojoRouter from 'pojo-router';

const namedPaths = {
  page1: '/page1',
  page2: { path: '/page2', sensitive: true },
  page3: { path: '/page3/:id' },
};

const routes = [
  { name: 'page1', abc: 123 },
  { name: 'page2', abc: 456 },
  { name: 'page3', abc: 789 },
  { name: '/page4', abc: 0 }
];

const notFound = { nothing: true };

const Router = ({ children }) => (
  <PojoRouter namedPaths={namedPaths} routes={routes} notFound={notFound}>
    { children }
  </PojoRouter>
);
```

## Controller

```ts
type Props = {
    namedPaths: Record<string, string | NamedPath>;
    routes: readonly Route[];
    notFound: AnyIfEmpty<DefaultRoutePojo>;
};

class RouteController {
    constructor({ namedPaths, routes, notFound }: Props);

    readonly notFound: AnyIfEmpty<DefaultRoutePojo>;
    readonly pathBuilders: Record<string, PathFunction>;
    getMatchedRoutes(pathToMatch: string): any;
    buildPath(pathOrPathName: string, pathData?: object): void;
}
```

### notFound

This is the passed in notFound object.

### getMatchedRoutes(pathToMatch)

Gets all routes matching the passed path.

### buildPath(pathOrPathName, pathData)

Given a named route (or route string if none is defined), this returns a function that will generate a matching string, including populating the dynamic variables.  E.g. for a route like `/entity/:id` an outbound routing function like `entityPath({ id: 123 })` will generate `/entity/123`.

`controller.buildPath('entity', { id: 123 })`


## Hooks

Within your child component, use one of the hooks.

## useRoutes()

Given a path, this returns all the metadata for routes that match.

## useLocation()

Get current location

## useRouter()

Return the [RouteController](#controller) that can be used for computations
