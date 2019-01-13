import React, { Suspense } from 'react'

import Nav from 'navigation/Nav'
import ErrorBoundary from 'components/ErrorBoundary'
import 'style/main.scss';

const App = ({ children, match }) => (
  <div>
    <h1>My thing</h1>
    <Nav />
    <ErrorBoundary key={match.location.key}>
      <Suspense fallback={<div>Loading...</div>}>
        <div className="content">
          {children}
        </div>
      </Suspense>
    </ErrorBoundary>
  </div>
)

export default App
