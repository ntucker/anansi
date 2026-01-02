# @anansi/core

[![npm downloads](https://img.shields.io/npm/dm/@anansi/core.svg?style=flat-square)](https://www.npmjs.com/package/@anansi/core)
[![bundle size](https://img.shields.io/bundlephobia/minzip/@anansi/core?style=flat-square)](https://bundlephobia.com/result?p=@anansi/core)
[![npm version](https://img.shields.io/npm/v/@anansi/core.svg?style=flat-square)](https://www.npmjs.com/package/@anansi/core)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)

> The itsy bitsy spider crawled up the water spout.
> Down came the rain, and washed the spider out.
> Out came the sun, and dried up all the rain,
> and the itsy bitsy spider went up the spout again

React 19 framework with streaming SSR support, built on a composable "spouts" architecture.

## Installation

```bash
yarn add @anansi/core
```

## Quick Start

Anansi uses a dual-entry pattern for SSR: one entry for the server and one for the client.

```bash
yarn start-anansi ./src/index.tsx
```

This automatically uses `./src/index.tsx` for the client and `./src/index.server.tsx` for the server.

## Concepts

### Spouts

Spouts are composable middleware for building React applications. They handle concerns like routing, data fetching, document structure, and more.

- **Server**: `laySpouts()` - Lays out the spouts for SSR, streaming React to the response
- **Client**: `floodSpouts()` - Hydrates the application on the client

The spout pattern allows you to compose functionality in a declarative, nested structure where each spout can:
- Inject props to downstream spouts
- Wrap the rendered application with providers
- Serialize data for hydration

## Entry Points

### Client Entry (`index.tsx`)

```tsx
import { useController } from '@data-client/react';
import {
  floodSpouts,
  documentSpout,
  dataClientSpout,
  routerSpout,
  JSONSpout,
  appSpout,
  navigatorSpout,
} from '@anansi/core';

import App from './App';
import { createRouter } from './routing';

const spouts = documentSpout({ title: 'My App' })(
  JSONSpout()(
    navigatorSpout()(
      dataClientSpout()(
        routerSpout({ useResolveWith: useController, createRouter })(
          appSpout(<App />),
        ),
      ),
    ),
  ),
);

floodSpouts(spouts);
```

### Server Entry (`index.server.tsx`)

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
  navigatorSpout,
} from '@anansi/core/server';

import App from './App';
import { createRouter } from './routing';

const spouts = prefetchSpout('controller')(
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

export default laySpouts(spouts);
```

## Spouts Reference

### appSpout

The innermost spout that wraps your React application.

```tsx
import { appSpout } from '@anansi/core';

appSpout(<App />)
```

### documentSpout

Generates the HTML document structure with proper asset loading.

```tsx
import { documentSpout } from '@anansi/core';

documentSpout({
  title: 'My App',           // Page title
  head?: ReactNode,          // Additional head elements
  lang?: string,             // HTML lang attribute (default: undefined)
  rootId?: string,           // Root element ID (default: 'anansi-root')
  charSet?: string,          // Character set (default: 'utf-8')
  csPolicy?: CSPolicy,       // Content Security Policy
})
```

#### Content Security Policy

The `csPolicy` option configures CSP headers. In production, it sets `Content-Security-Policy`; in development, it uses `Content-Security-Policy-Report-Only`.

```tsx
const csPolicy = {
  'base-uri': "'self'",
  'object-src': "'none'",
  'script-src': ["'self'", "'unsafe-inline'"],
  'style-src': ["'unsafe-inline'", "'self'"],
};

documentSpout({ title: 'My App', csPolicy })
```

Nonces are automatically injected into `script-src` for inline scripts.

### routerSpout

Integrates [@anansi/router](https://github.com/ntucker/anansi/tree/master/packages/router) for client-side navigation.

```tsx
import { routerSpout } from '@anansi/core';

routerSpout({
  useResolveWith: () => any,  // Hook returning data passed to route resolvers
  createRouter: (history) => RouteController,  // Router factory function
  onChange?: (update, callback) => void,  // Client-only: navigation callback
})
```

**Provides to downstream spouts:**
- `matchedRoutes` - Array of matched route objects
- `router` - RouteController instance
- `searchParams` - URLSearchParams from the current URL

### dataClientSpout

Integrates [@data-client/react](https://dataclient.io) for data fetching with automatic SSR hydration.

```tsx
import { dataClientSpout } from '@anansi/core';

dataClientSpout({
  getManagers?: () => Manager[],  // Custom managers (default: [NetworkManager])
})
```

Server-side, it creates a persisted store and serializes state for hydration. Client-side, it hydrates from the serialized state.

### JSONSpout

Serializes data from upstream spouts into `<script type="application/json">` tags for hydration.

```tsx
import { JSONSpout } from '@anansi/core';

JSONSpout({
  id?: string,  // Base ID for script tags (default: 'anansi-json')
})
```

### navigatorSpout

Provides browser navigator-like properties (language preferences) that work on both server and client.

```tsx
import { navigatorSpout, useNavigator } from '@anansi/core';

// In spouts config
navigatorSpout()

// In components
function MyComponent() {
  const { language, languages } = useNavigator();
  // language: string - Primary language (e.g., 'en-US')
  // languages: readonly string[] - All accepted languages by preference
}
```

### prefetchSpout (Server Only)

Prefetches route data before rendering. Must wrap `routerSpout`.

```tsx
import { prefetchSpout } from '@anansi/core/server';

// 'controller' is the field name from dataClientSpout to use for resolving routes
prefetchSpout('controller')(
  // ... other spouts including routerSpout
)
```

This calls `route.resolveData()` and `route.component.preload()` for all matched routes before SSR.

### antdSpout (Ant Design)

Integrates Ant Design's CSS-in-JS with SSR support.

```tsx
// Client
import { antdSpout } from '@anansi/core/antd';

// Server  
import { antdSpout } from '@anansi/core/antd/server';

antdSpout()
```

## Core Functions

### laySpouts (Server)

Wraps spouts for server-side rendering with streaming support.

```tsx
import { laySpouts } from '@anansi/core/server';

export default laySpouts(spouts, {
  timeoutMS?: number,  // SSR timeout (default: 10000)
  onError?: (error) => void,  // Error callback
});
```

Returns a render function compatible with Express: `(clientManifest, req, res) => Promise<void>`

### floodSpouts (Client)

Hydrates the application on the client.

```tsx
import { floodSpouts } from '@anansi/core';

floodSpouts(spouts, {
  rootId?: string,  // Root element ID (default: 'anansi-root')
});
```

## CLI Commands

### start-anansi

Development server with hot module replacement for both client and server.

```bash
yarn start-anansi ./src/index.tsx
```

Features:
- Dual webpack compilation (client + server)
- In-memory filesystem for fast rebuilds
- Hot reloading for both bundles
- Automatic SSR on all non-asset routes
- Proxy support from webpack devServer config

### serve-anansi

Production server for pre-built applications.

```bash
yarn serve-anansi ./dist-server/App.js
```

## Scripts API

For programmatic usage:

```ts
import { serve, devServe } from '@anansi/core/scripts';
```

### serve(entry, options?)

Starts a production server.

```ts
serve('./dist-server/App.js', {
  serveAssets?: boolean,  // Serve static assets (default: false)
  serveProxy?: boolean,   // Enable proxy from webpack config (default: false)
});
```

**Environment Variables:**
- `PORT` - Server port (default: 8080)
- `WEBPACK_PUBLIC_PATH` - Public path for assets

#### Options

| Option | Type | Description |
|--------|------|-------------|
| `serveAssets` | `boolean` | Serve static assets from the build output. Useful for local validation; use a dedicated HTTP server in production. |
| `serveProxy` | `boolean` | Enable proxying based on webpack devServer config. Useful for local validation; use a reverse proxy in production. |

### devServe(entry, env?)

Starts a development server with HMR.

```ts
devServe('./src/index.tsx', {
  // Additional env variables passed to webpack config
});
```

## Types

### ServerProps

Props available to server-side spouts:

```ts
interface ServerProps {
  req: Request | IncomingMessage;
  res: Response | ServerResponse;
  clientManifest: StatsCompilation;
  nonce: string;
}
```

### Spout Types

```ts
import type { Spout, ServerProps, NavigatorProperties } from '@anansi/core';
```

### CSPolicy

Content Security Policy configuration:

```ts
interface CSPolicy {
  [directive: string]: string | string[];
}
```

## Exports

### `@anansi/core`

Client-side exports:

- `floodSpouts` - Hydrate the application
- `documentSpout` - Document structure
- `dataClientSpout` - Data Client integration
- `routerSpout` - Router integration
- `JSONSpout` - JSON serialization for hydration
- `appSpout` - Application wrapper
- `navigatorSpout` - Navigator properties
- `useNavigator` - Hook for navigator properties

### `@anansi/core/server`

Server-side exports (all client exports plus):

- `laySpouts` - SSR render function
- `prefetchSpout` - Route data prefetching
- `CSPolicy` - CSP type

### `@anansi/core/scripts`

Build/dev scripts:

- `serve` - Production server
- `devServe` - Development server

### `@anansi/core/antd`

Ant Design integration (client-side).

### `@anansi/core/antd/server`

Ant Design integration (server-side).
