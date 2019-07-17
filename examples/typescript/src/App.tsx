import React from 'react';
import { hot } from 'react-hot-loader';
import Nav from 'navigation/Nav';
import { Layout } from 'antd';

import Routes from './routes';

const App = () => (
  <Layout>
    <Layout.Header className="header">
      <Nav />
    </Layout.Header>
    <Layout.Content
      style={{
        background: '#fff',
        padding: 0,
        margin: 0,
        minHeight: 280,
      }}
    >
      <Routes />
    </Layout.Content>
  </Layout>
);

export default hot(module)(React.memo(App));
