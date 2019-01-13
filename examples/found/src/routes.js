import React, { lazy } from 'react'
import { hot } from 'react-hot-loader'
import { hotRouteConfig, makeRouteConfig, Route } from 'found'

import App from './App'

export default (
  <Route path="/" Component={App}>
    <Route Component={lazy(() => import(/* webpackChunkName: "Home" */'./pages/Home'))} />
    <Route path="people" Component={lazy(() => import(/* webpackChunkName: "People" */'./pages/People'))} />
    <Route path="error" Component={lazy(() => import(/* webpackChunkName: "ErrorPage" */'./pages/Error'))} />
  </Route>
)
