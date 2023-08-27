# @anansi/core

<!--[![CircleCI](https://circleci.com/gh/notwillk/pojo-router.svg?style=shield)](https://circleci.com/gh/notwillk/pojo-router)-->

[![npm downloads](https://img.shields.io/npm/dm/@anansi/core.svg?style=flat-square)](https://www.npmjs.com/package/@anansi/core)
[![bundle size](https://img.shields.io/bundlephobia/minzip/@anansi/core?style=flat-square)](https://bundlephobia.com/result?p=@anansi/core)
[![npm version](https://img.shields.io/npm/v/@anansi/core.svg?style=flat-square)](https://www.npmjs.com/package/@anansi/core)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)

> The itsy bitsy spider crawled up the water spout.
> Down came the rain, and washed the spider out.
> Out came the sun, and dried up all the rain,
> and the itsy bitsy spider went up the spout again

## Entry

```bash
yarn start-anansi./src/index.tsx
```

This script uses two entry points for client/server.

<details open><summary>index.server.tsx</summary>

```tsx
import { useController } from '@data-client/react';
import {
  laySpouts,
  documentSpout,
  dataClientSpout,
  prefetchSpout,
  routerSpout,
  JSONSpout,
  appSpout,
} from '@anansi/core/server';

import app from 'app';

import { createRouter } from './routing';

const spouts = prefetchSpout('controller')(
  documentSpout({ title: 'anansi' })(
    JSONSpout()(
      dataClientSpout()(
        routerSpout({ useResolveWith: useController, createRouter })(
          appSpout(app),
        ),
      ),
    ),
  ),
);

export default laySpouts(spouts);
```

</details>

<details open><summary>index.tsx</summary>

```tsx
import { useController } from '@data-client/react';
import {
  floodSpouts,
  documentSpout,
  dataClientSpout,
  routerSpout,
  JSONSpout,
  appSpout,
} from '@anansi/core';

import app from 'app';

import { createRouter } from './routing';

const appSpout = () => Promise.resolve({ app });

const spouts = documentSpout({ title: 'anansi' })(
  JSONSpout()(
    dataClientSpout()(
      routerSpout({ useResolveWith: useController, createRouter })(
        appSpout(app),
      ),
    ),
  ),
);

floodSpouts(spouts);
```

</details>

Anansi can quickly traverse spouts setup by a user.

The server lays the spouts for anansi to travel in. Once delivered to the client, the spouts can be flooded (hydration).

In both cases, we need the route and application data.
