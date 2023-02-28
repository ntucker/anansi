import { Link } from '@anansi/router';
import { Img } from '@rest-hooks/img';
import { useSuspense } from '@rest-hooks/react';
import { List, Avatar } from 'antd';

import { Post, UserResource } from 'resources/Discuss';

export default function PostListItem({ post }: { post: Post }) {
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
    <Link name="PostDetail" props={{ id: post.pk() }}>
      🗨️
    </Link>,
  );
  return (
    <List.Item actions={actions}>
      <List.Item.Meta
        avatar={
          author && (
            <Img component={Avatar} src={author.profileImage}>
              {author && author.name.substring(0, 1)}
            </Img>
          )
        }
        title={
          <Link name="PostDetail" props={{ id: post.pk() }}>
            {post.title}
          </Link>
        }
        description={
          <>
            <a href="" target="_blank" rel="noreferrer">
              #{post.id}
            </a>{' '}
            by{' '}
            <Link name="UserDetail" props={{ id: post.userId }}>
              {`${author.name}`}
            </Link>
          </>
        }
      />
    </List.Item>
  );
}
