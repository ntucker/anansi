import { Typography, PageHeader } from 'antd';
import { PostResource } from 'data/resources';
import { useFetcher } from 'rest-hooks';
import itemRender from 'navigation/breadcrumbItemRenderer';
import PostForm from './PostForm';

export default function PostCreate() {
  const create = useFetcher(PostResource.createShape());
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
          const res = await create({}, data);
          window.location.href = `/post/${res.id}`;
        }}
      />
    </PageHeader>
  );
}
