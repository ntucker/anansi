import { Link, useRoutes } from '@anansi/router';
import {
  DesktopOutlined,
  PieChartOutlined,
  TeamOutlined,
  UserOutlined,
  ControlOutlined,
  StopOutlined,
} from '@ant-design/icons';
import { useController } from '@rest-hooks/react';
import { Menu, Layout, Switch, MenuProps } from 'antd';
import { memo, useContext } from 'react';

import { demoContext } from 'app/demo';
import { User } from 'resources/Discuss';

import PageLoading from './PageLoading';

const { Sider } = Layout;

const openKeys = ['users'];

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuProps['items'],
  type?: 'group',
) {
  return {
    key,
    icon,
    children,
    label,
    type,
  };
}

function Nav({
  friends,
  selectedFriend,
}: {
  friends: User[];
  selectedFriend: false | string;
}) {
  const contoller = useController();
  const route = useRoutes()[1] as any;
  const items: MenuProps['items'] = [
    getItem(<Link name="Home">Home</Link>, 'Home', <TeamOutlined />),
    getItem(<Link name="Posts">Posts</Link>, 'Posts', <PieChartOutlined />),

    getItem(
      'Users',
      'users',
      <UserOutlined />,
      friends.map(friend => ({
        label: (
          <Link name="UserDetail" props={{ id: friend.id }}>
            {friend.name}
          </Link>
        ),
        key: friend.pk(),
      })),
    ),

    getItem(
      <Link name="SSRError">SSRError</Link>,
      'SSRError',
      <StopOutlined />,
    ),
    getItem('Controls', 'controls', <ControlOutlined />, [
      getItem(
        <div onClick={() => contoller.resetEntireStore()}>Reset Cache</div>,
        'reset',
        <DesktopOutlined />,
      ),
      getItem('RH Cache', 'cache', <CacheSwitch />),
      getItem('Concurrent', 'concurrent', <ConcurrentSwitch />),
    ]),
  ];

  return (
    <Sider style={{ transition: 'none' }}>
      <div style={{ position: 'fixed', height: '100vh', width: '200px' }}>
        <PageLoading />
        <Menu
          theme="dark"
          mode="inline"
          selectable={false}
          defaultOpenKeys={openKeys}
          items={items}
          selectedKeys={[selectedFriend || route?.name]}
        />
      </div>
    </Sider>
  );
}
Nav.defaultProps = {
  selectedFriend: false,
};
export default memo(Nav);

function CacheSwitch() {
  const { set, cache } = useContext(demoContext);
  return (
    <Switch
      defaultChecked={cache}
      onChange={value => {
        set({ cache: value });
      }}
      size="small"
    />
  );
}
function ConcurrentSwitch() {
  const { set, concurrent } = useContext(demoContext);
  return (
    <Switch
      defaultChecked={concurrent}
      onChange={value => {
        set({ concurrent: value });
      }}
      size="small"
    />
  );
}
