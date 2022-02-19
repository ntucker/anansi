import { useResource } from 'rest-hooks';
import { EditOutlined } from '@ant-design/icons';
import { Button, Breadcrumb } from 'antd';
import { Img } from '@rest-hooks/img';
import { Card, Avatar } from 'antd';
import { Link } from '@anansi/router';
import { styled } from '@linaria/react';

import { PostResource, UserResource } from 'resources/Discuss';
import Boundary from 'Boundary';
import PostList from 'pages/Posts';

export type Props = { id: string };
const { Meta } = Card;

const Breading = styled(Breadcrumb)`
  margin: 16px 0 !important;
`;

export default function UserDetail({ id }: Props) {
  const user = useResource(UserResource.detail(), { id });
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
