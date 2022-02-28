import React, { memo } from 'react';
import { Layout, Spin } from 'antd';
import { MatchedRoute } from '@anansi/router';
import { styled } from '@linaria/react';
import 'antd/dist/antd.css';

import Nav from 'navigation/Nav';
import Boundary from 'Boundary';

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
      <Boundary
        fallback={
          <div className="center">
            <Spin size="large" />
          </div>
        }
      >
        <MatchedRoute />
      </Boundary>
    </Content>
  </Wrapper>
);

export default memo(App);
