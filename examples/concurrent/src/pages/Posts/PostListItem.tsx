import { useSuspense } from 'rest-hooks';
import { List, Avatar } from 'antd';
import { Link } from '@anansi/router';
import { Img } from '@rest-hooks/img';

import { PostResource, UserResource } from 'resources/Discuss';

export default function PostListItem({ post }: { post: PostResource }) {
  const author = useSuspense(
    UserResource.detail(),
    post.userId
      ? {
          id: post.userId,
        }
      : null,
  );
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
          author && (
            <Img component={Avatar} src={author.profileImage}>
              {author && author.name.substr(0, 1)}
            </Img>
          )
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
