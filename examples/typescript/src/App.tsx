import React from 'react';
import { hot } from 'react-hot-loader/root';
import { withRouter, RouteComponentProps } from 'react-router';
import Nav from 'navigation/Nav';
import ErrorBoundary from 'components/ErrorBoundary';
import Paper from '@material-ui/core/Paper';

import Routes from './routes';

const App = ({ location }: RouteComponentProps) => (
  <div>
    <h1>My thing</h1>
    <Nav />
    <ErrorBoundary key={location && location.key}>
      <Paper elevation={1} className="content">
        <Routes />
      </Paper>
    </ErrorBoundary>
  </div>
);

export default hot(withRouter(App));
