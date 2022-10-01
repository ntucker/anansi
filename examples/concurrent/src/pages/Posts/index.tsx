import { memo } from 'react';
import { useSuspense } from 'rest-hooks';
import { PlusOutlined } from '@ant-design/icons';
import { List, Avatar, Button, PageHeader } from 'antd';

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
