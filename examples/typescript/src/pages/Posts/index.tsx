import React from 'react';
import { useResourceNew } from 'rest-hooks';
import { List, Button, PageHeader } from 'antd';
import { Link } from 'react-router-dom';

import { PostResource } from 'data/resources';
import PostListItem from './PostListItem';

const routes = [
  {
    path: 'posts',
    breadcrumbName: 'Post List',
  },
];

function PostList() {
  const posts = useResourceNew(PostResource.listShape(), {});
  return (
    <PageHeader
      title="Post List"
      breadcrumb={{ routes }}
      extra={[
        <Link to="/posts/new" key={1}>
          <Button type="primary" shape="circle" icon="plus" size="large" />
        </Link>,
      ]}
    >
      <List
        itemLayout="horizontal"
        dataSource={posts}
        renderItem={(post: PostResource) => (
          <PostListItem key={post.pk() || ''} post={post} />
        )}
      />
    </PageHeader>
  );
}
export default React.memo(PostList);
