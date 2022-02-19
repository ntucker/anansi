# pojo-router
<!--[![CircleCI](https://circleci.com/gh/notwillk/pojo-router.svg?style=shield)](https://circleci.com/gh/notwillk/pojo-router)-->
[![npm downloads](https://img.shields.io/npm/dm/pojo-router.svg?style=flat-square)](https://www.npmjs.com/package/pojo-router)
[![bundle size](https://img.shields.io/bundlephobia/minzip/pojo-router?style=flat-square)](https://bundlephobia.com/result?p=pojo-router)
[![npm version](https://img.shields.io/npm/v/pojo-router.svg?style=flat-square)](https://www.npmjs.com/package/pojo-router)
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
  ['page1', { abc: 123 }],
  ['page2', { abc: 456 }],
  ['page3', { abc: 789 }],
  ['/page4', { abc: 0 }]
];

const notFound = { nothing: true };

const Router = ({ children }) => (
  <PojoRouter namedPaths={namedPaths} routes={routes} notFound={notFound}>
    { children }
  </PojoRouter>
);
```

Within your child component, use one of the hooks.

## useCurrentPath

Sets or gets the "current path".  This sets will use this path for all calls to `useCurrentMatch` until a new path is set.

If a path is provided, it sets that path.

It always returns the current path.

## useMatches

Given a path, this returns all the metadata for routes that match.

## useFirstMatch

Given a path, this returns the metadata for the first route that matches.

## useBestMatch

Given a path and a compareFunction (see [Array.prototype.sort](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort)), this returns the metadata for the best route that matches based on the provided compare function.

## useCurrentMatch

When a path is set via `useCurrentPath`, this returns the first match metadata for the current path that is set.

## useOutboundRoute

Given a named route (or route string if none is defined), this returns a function that will generate a matching string, including populating the dynamic variables.  E.g. for a route like `/entity/:id` an outbound routing function like `entityPath({ id: 123 })` will generate `/entity/123`.
