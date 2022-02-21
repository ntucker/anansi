import { useSuspense } from 'rest-hooks';
import { Img } from '@rest-hooks/img';
import { Card, Avatar } from 'antd';

import { UserResource } from 'resources/Discuss';
import Boundary from 'Boundary';
import PostList from 'pages/Posts';

export type Props = { id: string };
const { Meta } = Card;

export default function UserDetail({ id }: Props) {
  const user = useSuspense(UserResource.detail(), { id });
  return (
    <>
      <Card cover={<Img src={user.coverImage} />}>
        <Meta
          avatar={<Avatar src={user.profileImage} size={64} />}
          title={user.name}
          description={
            <>
              <div>{user.website}</div>
              <div>{user.company.catchPhrase}</div>
            </>
          }
        />
      </Card>
      <Boundary fallback={<CardLoading />}>
        <PostList userId={user.pk()} />
      </Boundary>
    </>
  );
}
export function CardLoading() {
  return <Card style={{ marginTop: 16 }} loading={true} />;
}
