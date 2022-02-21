import { Link, useRoutes } from '@anansi/router';
import { Menu, Layout, Switch } from 'antd';
import { memo, useContext } from 'react';
import {
  DesktopOutlined,
  PieChartOutlined,
  FileOutlined,
  TeamOutlined,
  UserOutlined,
  ControlOutlined,
} from '@ant-design/icons';
import { useController, useSuspense } from 'rest-hooks';
import classNames from 'classnames';

import { UserResource } from 'resources/Discuss';
import Boundary from 'Boundary';
import { demoContext } from 'DemoProvider';

import PageLoading from './PageLoading';

const { SubMenu } = Menu;
const { Header, Content, Footer, Sider } = Layout;

const openKeys = ['users'];

function Nav() {
  return (
    <Sider>
      <div style={{ position: 'fixed', height: '100vh', width: '200px' }}>
        <PageLoading />
        <Menu
          theme="dark"
          mode="inline"
          selectable={false}
          defaultOpenKeys={openKeys}
        >
          <Menu.Item key="home" icon={<TeamOutlined />}>
            <Link name="home">Home</Link>
          </Menu.Item>
          <Menu.Item key="posts" icon={<PieChartOutlined />}>
            <Link name="posts">Posts</Link>
          </Menu.Item>
          <SubMenu key="users" icon={<UserOutlined />} title="User">
            <Boundary fallback={null} key="friends">
              <Friends key="friends2" />
            </Boundary>
          </SubMenu>
          <SubMenu key="sub4" icon={<ControlOutlined />} title="Controls">
            <Controls key="controls" />
          </SubMenu>
        </Menu>
      </div>
    </Sider>
  );
}
export default memo(Nav);

function Friends(): JSX.Element {
  const route = useRoutes()[0] as any;
  const friends = useSuspense(UserResource.list(), {});
  return friends.map(friend => (
    <Menu.Item
      key={friend.pk()}
      className={classNames({
        'ant-menu-item-selected':
          route.id === friend.pk() && route.name === 'userDetail',
      })}
      style={{ transition: 'none' }}
    >
      <Link name="userDetail" props={{ id: friend.id }}>
        {friend.name}
      </Link>
    </Menu.Item>
  )) as any;
}

function Controls(): JSX.Element {
  const contoller = useController();
  const { set, cache, concurrent } = useContext(demoContext);
  return [
    <Menu.Item
      key="reset"
      icon={<DesktopOutlined />}
      onClick={() => contoller.resetEntireStore()}
    >
      Reset Cache
    </Menu.Item>,
    <Menu.Item
      key="cache"
      icon={
        <Switch
          defaultChecked={cache}
          onChange={value => {
            set({ cache: value });
          }}
          size="small"
        />
      }
    >
      RH Cache
    </Menu.Item>,
    <Menu.Item
      key="concurrent"
      icon={
        <Switch
          defaultChecked={concurrent}
          onChange={value => {
            set({ concurrent: value });
          }}
          size="small"
        />
      }
    >
      Concurrent
    </Menu.Item>,
  ] as any;
}
