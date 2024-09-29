import { useRoutes } from '@anansi/router';
import { useSuspense } from '@data-client/react';
import { memo } from 'react';

import { UserResource } from '@/resources/Discuss';

import Nav from './Nav';

function FriendsNav(): JSX.Element {
  const route = useRoutes()[1] as any;
  const friends = useSuspense(UserResource.getList);

  return (
    <Nav
      key="nav"
      friends={friends}
      selectedFriend={route?.name === 'UserDetail' && route.id}
    />
  );
}
export default memo(FriendsNav);
