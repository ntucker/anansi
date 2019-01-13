import React, { Suspense } from 'react'
import { hot } from 'react-hot-loader';
import { Route } from 'react-router-dom';
import lazyPage from 'components/lazyPage';


export default () => (
  <Suspense fallback={<div>Loading...</div>}>
    <Route exact path="/" component={lazyPage('Home')} />
    <Route path="/people" component={lazyPage('People')} />
    <Route path="/error" component={lazyPage('Error')} />
  </Suspense>
);
