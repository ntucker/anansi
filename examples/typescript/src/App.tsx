import { Layout, Spin } from 'antd';
import React, { memo, Suspense } from 'react';

import ErrorBoundary from '@/components/ErrorBoundary';
import Nav from '@/navigation/Nav';

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
      <Suspense
        fallback={
          <div className="center">
            <Spin size="large" />
          </div>
        }
      >
        <ErrorBoundary>
          <Routes />
        </ErrorBoundary>
      </Suspense>
    </Layout.Content>
  </Layout>
);

export default memo(App);
