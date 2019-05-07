import React from 'react';
import { hot } from 'react-hot-loader';
import Nav from 'navigation/Nav';
import Paper from '@material-ui/core/Paper';

import Routes from './routes';

const App = () => (
  <div>
    <h1>My thing</h1>
    <Nav />
    <Paper elevation={1} className="content">
      <Routes />
    </Paper>
  </div>
);

export default hot(module)(React.memo(App));
