import { Fragment } from 'react';
import { useResource } from 'rest-hooks';
import { EditOutlined } from '@ant-design/icons';
import { List, Avatar } from 'antd';
import { Link } from '@anansi/router';

import { PostResource, UserResource } from 'resources/Discuss';

export default function PostListItem({ post }: { post: PostResource }) {
  const author = useResource(UserResource.detail(), {
    id: post.userId,
  });
  const actions = [];
  actions.push(
    <Link name="postDetail" props={{ id: post.pk() }}>
      🗨️
    </Link>,
  );
  return (
    <List.Item actions={actions}>
      <List.Item.Meta
        avatar={
          <Avatar src={author.profileImage}>
            {author && author.name.substr(0, 1)}
          </Avatar>
        }
        title={
          <Link name="postDetail" props={{ id: post.pk() }}>
            {post.title}
          </Link>
        }
        description={
          <>
            <a href="" target="_blank" rel="noreferrer">
              #{post.id}
            </a>{' '}
            by{' '}
            <Link name="userDetail" props={{ id: post.userId }}>
              {`${author.name}`}
            </Link>
          </>
        }
      />
    </List.Item>
  );
}
