import React, { Suspense } from 'react'

import Nav from 'navigation/Nav'
import ErrorBoundary from 'components/ErrorBoundary'
//import 'main.scss'

const App = ({ children, match }) => (
  <div>
    <h1>My thing</h1>
    <Nav />
    <ErrorBoundary key={match.location.key}>
      <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>
    </ErrorBoundary>
  </div>
)

export default App
