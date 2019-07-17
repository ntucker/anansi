import { Link } from 'react-router-dom';
import { Menu } from 'antd';

export default () => (
  <Menu
    theme="dark"
    mode="horizontal"
    defaultSelectedKeys={['1']}
    style={{ lineHeight: '64px' }}
  >
    <Menu.Item key="1">
      <Link to="/">Home</Link>
    </Menu.Item>
    <Menu.Item key="2">
      <Link to="/posts">Posts</Link>
    </Menu.Item>
    <Menu.Item key="3">
      <Link to="/slow">Slow</Link>
    </Menu.Item>
    <Menu.Item key="4">
      <Link to="/error">Error</Link>
    </Menu.Item>
  </Menu>
);
