import React, { Suspense } from 'react'
import { withRouter } from "react-router";

import Nav from 'navigation/Nav'
import ErrorBoundary from 'components/ErrorBoundary'
import Routes from './routes'
import 'style/main.scss';

const App = ({ location }) => (
  <div>
    <h1>My thing</h1>
    <Nav />
    <ErrorBoundary key={location.key}>
      <div className="content">
        <Routes />
      </div>
    </ErrorBoundary>
  </div>
)

export default withRouter(App)
