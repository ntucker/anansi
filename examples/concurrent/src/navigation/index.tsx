import { Menu, Layout } from 'antd';
import { memo } from 'react';
import { MatchedRoute } from '@anansi/router';

import Boundary from 'components/Boundary';
const { SubMenu } = Menu;
const { Sider } = Layout;

import Nav from './Nav';

function WrapNav() {
  return (
    <Boundary fallback={<Nav key="nav" friends={[]} />}>
      <MatchedRoute key="friends2" index={0} />
    </Boundary>
  );
}
export default memo(WrapNav);
