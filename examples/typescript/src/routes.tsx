import React, { Suspense } from 'react';
import { Route, Switch } from 'react-router-dom';
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
    <Switch>
      <Route exact path="/" component={lazyPage('Home')} />
      <Route exact path="/posts" component={lazyPage('Posts')} />
      <Route exact path="/posts/new" component={lazyPage('Posts/PostCreate')} />
      <Route path="/post/:id/edit" component={lazyPage('Posts/PostEdit')} />
      <Route path="/post/:id" component={lazyPage('Posts/PostPage')} />
      <Route path="/user/:id" component={lazyPage('User')} />
      <Route path="/slow" component={lazyPage('Slow')} />
      <Route path="/error" component={lazyPage('Error')} />
    </Switch>
  </Suspense>
);
