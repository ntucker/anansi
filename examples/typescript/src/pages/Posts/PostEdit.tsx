import { PostResource } from 'data/resources';
import { useFetcher, useResource } from 'rest-hooks';
import { RouteChildrenProps } from 'react-router';
import PostForm from './PostForm';
import Post from './Post';

export default function PostEdit({
  match,
}: RouteChildrenProps<{ id: string }>) {
  let id = 1;
  if (match && match.params && match.params.id) {
    id = Number.parseInt(match.params.id);
  }
  const update = useFetcher(PostResource.updateRequest());
  const post = useResource(PostResource.singleRequest(), { id });

  return (
    <>
      <PostForm
        initialValues={post}
        onSubmit={(data: object) => update(data, { id })}
      />
      <br />
      <Post post={post} />
    </>
  );
}
