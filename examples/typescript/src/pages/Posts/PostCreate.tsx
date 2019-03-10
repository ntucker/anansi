import { PostResource, } from 'data/resources';
import { useFetcher } from 'rest-hooks';
import PostForm from './PostForm';

export default function PostCreate() {
  const create = useFetcher(PostResource.createRequest());

  return (
    <PostForm
      initialValues={{ userId: 1 }}
      onSubmit={(data: object) => create(data, {})}
    />
  );
}
