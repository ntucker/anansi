import { PostResource, UserResource } from 'data/resources';
import React from 'react';
import { useResource } from 'rest-hooks';
import { EditOutlined } from '@ant-design/icons';
import { List, Avatar } from 'antd';
import { Link } from '@pojo-router/react-browser-pathname';

export default function IssueListItem({ post }: { post: PostResource }) {
  const author = useResource(UserResource.detail(), {
    id: post.userId,
  });
  const actions = [];
  actions.push(
    <Link to={`/post/${post.id}/edit`}>
      <EditOutlined />
    </Link>,
  );
  return (
    <List.Item actions={actions}>
      <List.Item.Meta
        avatar={<Avatar>{author && author.name.substr(0, 1)}</Avatar>}
        title={<Link to={`/post/${post.pk()}`}>{post.title}</Link>}
        description={<React.Fragment>{post.body}</React.Fragment>}
      />
    </List.Item>
  );
}
