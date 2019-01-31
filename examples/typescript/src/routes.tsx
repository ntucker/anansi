import React, { Suspense } from 'react';
import { hot } from 'react-hot-loader';
import { Route } from 'react-router-dom';
import lazyPage from 'components/lazyPage';
import CircularProgress from '@material-ui/core/CircularProgress';

export default () => (
  <Suspense
    fallback={
      <div className="center">
        <CircularProgress />
      </div>
    }
    maxDuration={500}
  >
    <Route exact path="/" component={lazyPage('Home')} />
    <Route exact path="/posts" component={lazyPage('Posts')} />
    <Route path="/post/:id" component={lazyPage('Post')} />
    <Route path="/user/:id" component={lazyPage('User')} />
    <Route path="/slow" component={lazyPage('Slow')} />
    <Route path="/error" component={lazyPage('Error')} />
  </Suspense>
);
