import { PageHeader } from 'antd';
import { PostResource } from 'data/resources';
import { useFetcher, useResource } from 'rest-hooks';
import { RouteChildrenProps } from 'react-router';
import itemRender from 'navigation/breadcrumbItemRenderer';
import React from 'react';

import PostForm from './PostForm';

export default function PostEdit({
  match,
}: RouteChildrenProps<{ id: string }>) {
  let id = 1;
  if (match && match.params && match.params.id) {
    id = Number.parseInt(match.params.id);
  }
  const update = useFetcher(PostResource.update());
  const post = useResource(PostResource.detail(), { id });
  const routes = [
    {
      path: '/posts',
      breadcrumbName: 'Post List',
    },
    {
      path: `/post/${id}`,
      breadcrumbName: post.title,
    },
    {
      path: `/post/${id}/edit`,
      breadcrumbName: 'Edit',
    },
  ];

  return (
    <PageHeader title={null} breadcrumb={{ routes, itemRender }}>
      <PostForm
        initialValues={post}
        onSubmit={(data: object) => update({ id }, data)}
      />
    </PageHeader>
  );
}
