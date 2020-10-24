import { memo } from 'react';
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

export default memo(App);
