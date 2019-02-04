import { PostResource } from 'data/models';
import { hooks } from 'rest-hooks';
import { RouteChildrenProps } from 'react-router';
import PostForm from './PostForm';

export default function PostEdit({
  match,
}: RouteChildrenProps<{ id: string }>) {
  let id = 1;
  if (match && match.params && match.params.id) {
    id = Number.parseInt(match.params.id);
  }
  const update = hooks.useDispatch(PostResource.updateRequest());
  const post = hooks.useResource(PostResource.singleRequest(), { id });

  return (
    <PostForm
      initialValues={post}
      onSubmit={(data: object) => update(data, { id })}
    />
  );
}
