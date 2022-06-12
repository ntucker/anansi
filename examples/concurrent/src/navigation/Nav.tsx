import { Link } from '@anansi/router';
import { Menu, Layout, Switch } from 'antd';
import { memo, useContext } from 'react';
import {
  DesktopOutlined,
  PieChartOutlined,
  TeamOutlined,
  UserOutlined,
  ControlOutlined,
  StopOutlined,
} from '@ant-design/icons';
import { useController } from 'rest-hooks';
import { MatchedRoute } from '@anansi/router';

import { demoContext } from 'app/demo';
import Boundary from 'components/Boundary';

import PageLoading from './PageLoading';

const { SubMenu } = Menu;
const { Sider } = Layout;

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
            <Link name="Home">Home</Link>
          </Menu.Item>
          <Menu.Item key="posts" icon={<PieChartOutlined />}>
            <Link name="Posts">Posts</Link>
          </Menu.Item>
          <SubMenu key="users" icon={<UserOutlined />} title="User">
            <Boundary fallback={null} key="friends">
              <MatchedRoute key="friends2" index={0} />
            </Boundary>
          </SubMenu>
          <Menu.Item key="ssrerror" icon={<StopOutlined />}>
            <Link name="SSRError">SSRError</Link>
          </Menu.Item>

          <SubMenu key="sub4" icon={<ControlOutlined />} title="Controls">
            <Controls key="controls" />
          </SubMenu>
        </Menu>
      </div>
    </Sider>
  );
}
export default memo(Nav);

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
