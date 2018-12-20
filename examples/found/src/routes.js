import React, { lazy } from 'react'
import { hot } from 'react-hot-loader'
import { hotRouteConfig, makeRouteConfig, Route } from 'found'

import App from './App'

export default (
  <Route path="/" Component={App}>
    <Route Component={lazy(() => import('./pages/Page'))} />
    <Route path="bob" Component={() => 'bob'} />
    <Route path="error" Component={lazy(() => import('./pages/Error'))} />
  </Route>
)
