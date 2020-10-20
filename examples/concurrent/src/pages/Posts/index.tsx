import React from 'react';
import { useResource } from 'rest-hooks';
import { PlusOutlined } from '@ant-design/icons';
import { List, Button, PageHeader } from 'antd';
import { Link } from '@pojo-router/react-browser-pathname';
import { PostResource } from 'data/resources';

import PostListItem from './PostListItem';

const routes = [
  {
    path: 'posts',
    breadcrumbName: 'Post List',
  },
];

function PostList() {
  const posts = useResource(PostResource.list(), {});
  console.log('hi', posts);
  return (
    <PageHeader
      title="Post List"
      breadcrumb={{ routes }}
      extra={[
        <Link to="/posts/new" key={1}>
          <Button
            type="primary"
            shape="circle"
            icon={<PlusOutlined />}
            size="large"
          />
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
