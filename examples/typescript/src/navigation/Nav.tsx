import { Menu, MenuProps } from 'antd';
import { memo } from 'react';
import { Link } from 'react-router-dom';

function Nav() {
  return (
    <Menu
      theme="dark"
      mode="horizontal"
      defaultSelectedKeys={['1']}
      style={{ lineHeight: '64px' }}
      items={items}
    />
  );
}
export default memo(Nav);

const items: MenuProps['items'] = [
  { key: 1, label: <Link to="/">Home</Link> },
  { key: 2, label: <Link to="/posts">Posts</Link> },
  { key: 3, label: <Link to="/issues">Issues</Link> },
  { key: 4, label: <Link to="/graphql">GraphQL</Link> },
  { key: 5, label: <Link to="/slow">Slow</Link> },
  { key: 6, label: <Link to="/error">Error</Link> },
];
