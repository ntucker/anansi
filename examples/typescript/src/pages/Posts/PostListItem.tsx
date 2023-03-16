import { EditOutlined } from '@ant-design/icons';
import { useSuspense } from '@rest-hooks/react';
import { List, Avatar } from 'antd';
import { Fragment } from 'react';
import { Link } from 'react-router-dom';

import { Post, UserResource } from 'data/resources';

/** Displays one item in the list */
export default function IssueListItem({ post }: { post: Post }) {
  const author = useSuspense(
    UserResource.get,
    post.userId
      ? {
          id: post.userId,
        }
      : null,
  );
  const actions = [];
  actions.push(
    <Link to={`/post/${post.id}/edit`}>
      <EditOutlined />
    </Link>,
  );
  return (
    <List.Item actions={actions}>
      <List.Item.Meta
        avatar={<Avatar>{author && author.name.substring(0, 1)}</Avatar>}
        title={<Link to={`/post/${post.pk()}`}>{post.title}</Link>}
        description={<Fragment>{post.body}</Fragment>}
      />
    </List.Item>
  );
}
