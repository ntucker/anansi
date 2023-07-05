import { Img } from '@data-client/img';
import { AsyncBoundary, useSuspense } from '@data-client/react';
import { Card, Avatar } from 'antd';

import PostList from 'pages/Posts';
import { UserResource } from 'resources/Discuss';

export type Props = { id: string };
const { Meta } = Card;

export default function UserDetail({ id }: Props) {
  const user = useSuspense(UserResource.get, { id });
  return (
    <>
      <Card cover={<Img src={user.coverImage} />}>
        <Meta
          avatar={<Img component={Avatar} src={user.profileImage} size={64} />}
          title={user.name}
          description={
            <>
              <div>{user.website}</div>
              <div>{user.company.catchPhrase}</div>
            </>
          }
        />
      </Card>
      <AsyncBoundary fallback={<CardLoading />}>
        <PostList userId={user.pk()} />
      </AsyncBoundary>
    </>
  );
}
export function CardLoading() {
  return <Card style={{ marginTop: 16 }} loading={true} />;
}
