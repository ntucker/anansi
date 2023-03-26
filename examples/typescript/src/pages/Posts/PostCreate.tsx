import { PageHeader } from '@ant-design/pro-layout';
import { useController } from '@rest-hooks/react';
import { Typography } from 'antd';
import { useHistory } from 'react-router-dom';

import { PostResource } from 'data/resources';
import itemRender from 'navigation/breadcrumbItemRenderer';

import PostForm from './PostForm';

export default function PostCreate() {
  const controller = useController();
  const history = useHistory();
  const routes = [
    {
      path: '/posts',
      breadcrumbName: 'Post List',
    },
    {
      path: `/posts/new`,
      breadcrumbName: 'New Post',
    },
  ];
  return (
    <PageHeader
      breadcrumb={{ routes, itemRender }}
      title={<Typography.Title level={2}>New Post</Typography.Title>}
    >
      <PostForm
        initialValues={{ userId: 1 }}
        onSubmit={async (data: object) => {
          const res = await controller.fetch(PostResource.create, data);
          history.push(`/post/${res.id}`);
        }}
      />
    </PageHeader>
  );
}
