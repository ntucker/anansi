import { useResource } from 'rest-hooks';
import { RouteChildrenProps } from 'react-router';
import { Link } from 'react-router-dom';
import { Typography, Button, PageHeader } from 'antd';

import itemRender from 'navigation/breadcrumbItemRenderer';
import { PostResource, UserResource } from 'data/resources';
import CommentList from './CommentList';

export default function PostDetail({
  match,
}: RouteChildrenProps<{ id: string }>) {
  let id = 1;
  if (match && match.params && match.params.id) {
    id = Number.parseInt(match.params.id);
  }
  const [post, author] = useResource(
    [PostResource.detailShape(), { id }],
    [
      UserResource.detailShape(),
      {
        id,
      },
    ],
  );
  const routes = [
    {
      path: '/posts',
      breadcrumbName: 'Post List',
    },
    {
      path: `/post/${id}`,
      breadcrumbName: post.title,
    },
  ];
  return (
    <PageHeader
      title={<Typography.Title level={2}>{post.title}</Typography.Title>}
      subTitle={`by ${author.name}`}
      breadcrumb={{ routes, itemRender }}
      extra={[
        <Link to={`/post/${post.id}/edit`} key="edit">
          <Button type="secondary" shape="circle" icon="edit" size="large" />
        </Link>,
      ]}
    >
      <Typography.Paragraph>{post.body}</Typography.Paragraph>
      <CommentList postId={id} />
    </PageHeader>
  );
}
