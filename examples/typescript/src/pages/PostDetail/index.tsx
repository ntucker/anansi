import { useResource } from 'rest-hooks';
import { RouteChildrenProps } from 'react-router';
import { Link } from 'react-router-dom';
import { EditOutlined } from '@ant-design/icons';
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
  const post = useResource(PostResource.detailShape(), { id });
  const author = useResource(UserResource.detailShape(), { id: post.userId });
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
          <Button shape="circle" icon={<EditOutlined />} size="large" />
        </Link>,
      ]}
    >
      <Typography.Paragraph>{post.body}</Typography.Paragraph>
      <CommentList postId={id} />
    </PageHeader>
  );
}
