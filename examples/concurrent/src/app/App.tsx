import React, { memo } from 'react';
import { Layout, Spin } from 'antd';
import { MatchedRoute } from '@anansi/router';
import { styled } from '@linaria/react';
import 'antd/dist/reset.css';

import { AsyncBoundary } from '@data-client/react';

import Nav from 'navigation';

const Content = styled(Layout.Content)`
  margin: 0;
  padding: 0 16px !important;
  background: #fff;
`;

const Wrapper = styled(Layout)`
  min-height: 100vh;
`;

const App = () => (
  <Wrapper className="ant-layout-has-sider">
    <Nav />
    <Content>
      <AsyncBoundary
        fallback={
          <div className="center">
            <Spin size="large" />
          </div>
        }
      >
        <MatchedRoute index={1} />
      </AsyncBoundary>
    </Content>
  </Wrapper>
);

export default memo(App);
