import { Link } from '@anansi/router';
import { Menu, Layout } from 'antd';
import { memo } from 'react';
import {
  DesktopOutlined,
  PieChartOutlined,
  FileOutlined,
  TeamOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { styled } from '@linaria/react';
import { useController, useResource } from 'rest-hooks';

import { UserResource } from 'resources/Discuss';
import Boundary from 'Boundary';

import PageLoading from './PageLoading';

const { SubMenu } = Menu;
const { Header, Content, Footer, Sider } = Layout;

function Nav() {
  const contoller = useController();
  return (
    <Sider>
      <div style={{ position: 'fixed', height: '100vh', width: '200px' }}>
        <PageLoading />
        <Menu theme="dark" mode="inline" selectable={false}>
          <Menu.Item key="1" icon={<PieChartOutlined />}>
            <Link name="posts">Posts</Link>
          </Menu.Item>
          <SubMenu key="sub2" icon={<UserOutlined />} title="User">
            <Boundary fallback={null}>
              <Friends />
            </Boundary>
          </SubMenu>
          <Menu.Item
            key="1"
            icon={<DesktopOutlined />}
            onClick={() => contoller.resetEntireStore()}
          >
            Reset Cache
          </Menu.Item>
        </Menu>
      </div>
    </Sider>
  );
}
export default memo(Nav);

function Friends(): JSX.Element {
  const friends = useResource(UserResource.list(), {});
  return friends.map(friend => (
    <Menu.Item key={friend.pk()}>
      <Link name="userDetail" props={{ id: friend.id }}>
        {friend.name}
      </Link>
    </Menu.Item>
  )) as any;
}
