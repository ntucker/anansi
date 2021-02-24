import { Typography, PageHeader } from 'antd';
import { useHistory } from 'react-router-dom';
import { useFetcher } from 'rest-hooks';

import { PostResource } from 'data/resources';
import itemRender from 'navigation/breadcrumbItemRenderer';

import PostForm from './PostForm';

export default function PostCreate() {
  const create = useFetcher(PostResource.create());
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
          const res = await create({}, data, [
            [
              PostResource.list(),
              {},
              (postID: string, postList: string[] | undefined) => [
                postID,
                ...(postList || []),
              ],
            ],
          ]);
          history.push(`/post/${res.id}`);
        }}
      />
    </PageHeader>
  );
}
