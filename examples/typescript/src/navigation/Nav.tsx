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
  getItem(<Link to="/">Home</Link>, 1),
  getItem(<Link to="/posts">Posts</Link>, 2),
  getItem(<Link to="/issues">Issues</Link>, 3),
  getItem(<Link to="/graphql">GraphQL</Link>, 4),
  getItem(<Link to="/slow">Slow</Link>, 5),
  getItem(<Link to="/error">Error</Link>, 6),
];
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
