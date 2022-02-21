import { useFetch, useSuspense } from 'rest-hooks';
import { EditOutlined } from '@ant-design/icons';
import { Button, Breadcrumb } from 'antd';
import { getImage } from '@rest-hooks/img';
import { Card, Avatar } from 'antd';
import { Link } from '@anansi/router';
import { styled } from '@linaria/react';

import { PostResource, UserResource } from 'resources/Discuss';
import Boundary from 'Boundary';

import CommentList from './CommentList';

export type Props = { id: string };
const { Meta } = Card;

const Breading = styled(Breadcrumb)`
  margin: 16px 0 !important;
`;

export default function PostDetail({ id }: Props) {
  const post = useSuspense(PostResource.detail(), { id });
  const author = useSuspense(
    UserResource.detail(),
    post.userId ? { id: post.userId } : null,
  );
  useFetch(
    getImage,
    author?.profileImage ? { src: author?.profileImage } : null,
  );
  return (
    <>
      <Breading>
        <Breadcrumb.Item>
          <Link name="userDetail" props={{ id: post.userId }}>
            {author?.name}
          </Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>{post.title}</Breadcrumb.Item>
      </Breading>
      <Card
        actions={[
          <a href={`/post/${post.id}/edit`} key="edit">
            <Button shape="circle" icon={<EditOutlined />} size="small" />
          </a>,
        ]}
      >
        <Meta
          avatar={<Avatar src={author?.profileImage} />}
          title={post.title}
          description={post.body}
        />
      </Card>
      <Boundary fallback={<CardLoading />}>
        <CommentList postId={id} />
      </Boundary>
    </>
  );
}
export function CardLoading() {
  return <Card style={{ marginTop: 16 }} loading={true} />;
}
