# Streaming SSR with @anansi/core

Two entries share one webpack config: `src/index.tsx` (client) and
`src/index.server.tsx` (server). Both compose the same "spouts", outermost
first; each spout injects props downstream, wraps the tree, or serializes data
for hydration.

```tsx
// src/index.tsx
import { useController } from '@data-client/react';
import {
  floodSpouts,
  documentSpout,
  JSONSpout,
  navigatorSpout,
  dataClientSpout,
  routerSpout,
  appSpout,
} from '@anansi/core';

import { createRouter } from './routing'; // see Routing below

floodSpouts(
  documentSpout({ title: 'My App' })(
    JSONSpout()(
      navigatorSpout()(
        dataClientSpout()(
          routerSpout({ useResolveWith: useController, createRouter })(
            appSpout(<App />),
          ),
        ),
      ),
    ),
  ),
);
```

```tsx
// src/index.server.tsx: same tree, imported from @anansi/core/server,
// wrapped in prefetchSpout and exported through laySpouts
import {
  laySpouts,
  prefetchSpout /* , ...same spouts */,
} from '@anansi/core/server';

export default laySpouts(
  prefetchSpout('controller')(documentSpout({ title: 'My App' })(/* ... */)),
);
```

## Rules

- Keep client and server spout trees identical apart from `prefetchSpout` and
  `laySpouts`/`floodSpouts`; any difference is a hydration mismatch.
- Import server code from `@anansi/core/server` only in `index.server.tsx`.
- Fetch route data in the route's `resolveData`, not in effects;
  `prefetchSpout('controller')` runs it plus `component.preload()` before
  streaming. The string names the prop `dataClientSpout` provides.
- Use `useNavigator()` (from `navigatorSpout`) for language instead of
  `navigator`, which doesn't exist on the server.
- `documentSpout({ csPolicy })` sets CSP (report-only in dev) and injects
  nonces into `script-src`. Ant Design: `antdSpout` from `@anansi/core/antd`
  and `@anansi/core/antd/server`.
- `laySpouts(spouts, { timeoutMS, onError })`: default timeout 10000ms.

## Routing (@anansi/router)

```tsx
import { lazy, Route, Router } from '@anansi/router';

const routes: Route<Controller>[] = [
  { name: 'home', component: lazy(() => import('pages/Home')) },
  {
    name: 'post',
    component: lazy(() => import('pages/Post')),
    resolveData: (ctrl, { id }) => ctrl.fetch(PostResource.get, { id }),
  },
];
export const createRouter = (history: History) =>
  new Router({
    history,
    namedPaths,
    routes,
    notFound: { component: NotFound },
  });
```

`namedPaths` maps route names to path patterns; extra route fields and path
params become component props. Render with `<MatchedRoute />`; show pending
transitions with `useShowLoading()`. Use the router's `lazy`, not
`React.lazy`, so code and data load in parallel.

## Scripts

```json
{
  "start": "anansi serve --dev ./src/index.tsx",
  "build": "webpack --mode=production",
  "build:server": "webpack --mode=production --target=node --env entrypath=index.server.tsx",
  "start:server": "anansi serve ./dist-server/App.js -a"
}
```

The dev server compiles client and server in memory with hot reload and
proxies per the webpack `devServer.proxy` config. In production, prefer a CDN
or reverse proxy over `-a` (serve assets) and `-p` (proxy).
