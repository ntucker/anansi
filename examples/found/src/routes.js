import React, { lazy } from 'react'
import { hot } from 'react-hot-loader'
import { hotRouteConfig, makeRouteConfig, Route } from 'found'
import lazyPage from 'components/lazyPage'

import App from './App'

export default (
  <Route path="/" Component={App}>
    <Route Component={lazyPage('Home')} />
    <Route path="people" Component={lazyPage('People')} />
    <Route path="error" Component={lazyPage('Error')} />
  </Route>
)
