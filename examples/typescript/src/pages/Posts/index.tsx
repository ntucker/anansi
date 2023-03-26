import { PlusOutlined } from '@ant-design/icons';
import { PageHeader } from '@ant-design/pro-layout';
import { useSuspense } from '@rest-hooks/react';
import { List, Button } from 'antd';
import { memo } from 'react';
import { Link } from 'react-router-dom';

import { PostResource, Post } from 'data/resources';

import PostListItem from './PostListItem';

const routes = [
  {
    path: 'posts',
    breadcrumbName: 'Post List',
  },
];

function PostList() {
  const posts = useSuspense(PostResource.getList);
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
        renderItem={(post: Post) => (
          <PostListItem key={post.pk() || ''} post={post} />
        )}
      />
    </PageHeader>
  );
}
export default memo(PostList);
