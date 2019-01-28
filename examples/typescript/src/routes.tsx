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
    <Route path="/people" component={lazyPage('People')} />
    <Route path="/slow" component={lazyPage('Slow')} />
    <Route path="/error" component={lazyPage('Error')} />
  </Suspense>
);
