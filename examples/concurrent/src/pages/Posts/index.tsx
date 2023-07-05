import { useSuspense } from '@data-client/react';
import { List } from 'antd';
import { memo } from 'react';

import { PostResource, Post } from 'resources/Discuss';

import PostListItem from './PostListItem';

function PostList({ userId }: { userId?: string }) {
  const posts = useSuspense(PostResource.getList, userId ? { userId } : {});
  return (
    <List
      itemLayout="horizontal"
      dataSource={posts}
      renderItem={(post: Post) => (
        <PostListItem key={post.pk() || ''} post={post} />
      )}
    />
  );
}
export default memo(PostList);
