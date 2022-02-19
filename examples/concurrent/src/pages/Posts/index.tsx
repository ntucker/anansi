import { memo } from 'react';
import { useResource } from 'rest-hooks';
import { PlusOutlined } from '@ant-design/icons';
import { List, Avatar, Button, PageHeader } from 'antd';

import { PostResource } from 'resources/Discuss';

import PostListItem from './PostListItem';

function PostList({ userId }: { userId?: string }) {
  const posts = useResource(PostResource.list(), userId ? { userId } : {});
  return (
    <List
      itemLayout="horizontal"
      dataSource={posts}
      renderItem={(post: PostResource) => (
        <PostListItem key={post.pk() || ''} post={post} />
      )}
    />
  );
}
export default memo(PostList);
