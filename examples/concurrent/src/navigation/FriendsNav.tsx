import { Link, useRoutes } from '@anansi/router';
import { Menu } from 'antd';
import { useSuspense } from 'rest-hooks';
import classNames from 'classnames';
import { memo } from 'react';

import { UserResource } from 'resources/Discuss';

function FriendsNav(): JSX.Element {
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
      <Link name="UserDetail" props={{ id: friend.id }}>
        {friend.name}
      </Link>
    </Menu.Item>
  )) as any;
}
export default memo(FriendsNav);
