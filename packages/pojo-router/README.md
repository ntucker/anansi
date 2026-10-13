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

## Paths

Paths use [path-to-regexp v8](https://github.com/pillarjs/path-to-regexp) syntax:

| Pattern | Matches | Params |
|---|---|---|
| `/post/:id` | `/post/5` | `{ id: '5' }` |
| `/users{/:id}` | `/users`, `/users/5` | `{ id?: '5' }` |
| `/files/*path` | `/files/a/b` | `{ path: ['a', 'b'] }` |
| `{/*path}` | `/`, `/a/b` | `{ path?: ['a', 'b'] }` |

`?`, `+` and `*` modifiers and inline regex (`/:id(\d+)`) are not supported;
escape literal `{}()[]+?!:*` with a backslash (`'/a\\+b'` in JS). Matched
params are decoded with `decodeURIComponent` (malformed escapes like `%E0%A4%A`
stay raw instead of throwing; set `decode` to override), and `buildPath()`
encodes with `encodeURIComponent`.

`NamedPath` objects accept path-to-regexp's `ParseOptions`, `MatchOptions`
(`end`, `trailing`, `sensitive`, `delimiter`, `decode`) and `CompileOptions`
(`encode`).

## Controller

```ts
type Props<Paths extends NamedPaths> = {
    history: History;
    namedPaths: Paths;
    routes: readonly Route[];
    notFound: AnyIfEmpty<DefaultRoutePojo>;
};

class RouteController<Route, Paths extends NamedPaths> {
    constructor({ history, namedPaths, routes, notFound }: Props<Paths>);

    readonly notFound: AnyIfEmpty<DefaultRoutePojo>;
    readonly pathBuilders: Record<string, PathFunction<object>>;
    getMatchedRoutes(pathToMatch: string): Route[];
    buildPath<N extends string>(pathOrPathName: N, ...[pathData]: BuildPathArgs<Paths, N>): string;
}
```

### notFound

This is the passed in notFound object.

### getMatchedRoutes(pathToMatch)

Gets all routes matching the passed path.

### buildPath(pathOrPathName, pathData)

Given a named route (or route string if none is defined), this generates a matching path, populating the dynamic variables.
E.g. for a route like `/entity/:id`, `controller.buildPath('entity', { id: 123 })` generates `/entity/123`.

When `namedPaths` is declared `as const`, `pathData` is typed from the path (the same inference as
[@data-client/rest](https://dataclient.io/rest/api/RestEndpoint#path)): `:id` takes `string | number`,
`*path` takes `string[]`, params inside `{}` are optional, and `pathData` is required when the path
has required params. `null`, `undefined` and empty-array values count as missing: optional groups are
omitted and missing required params throw. `PathArgs<'/entity/:id'>` and
`RouteParams<typeof namedPaths, 'entity'>` expose these types.

## Hooks

Within your child component, use one of the hooks.

## useRoutes()

Given a path, this returns all the metadata for routes that match.

## useLocation()

Get current location

## useRouter()

Return the [RouteController](#controller) that can be used for computations
