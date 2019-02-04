import { PostResource, } from 'data/models';
import { hooks } from 'rest-hooks';
import PostForm from './PostForm';

export default function PostCreate() {
  const create = hooks.useDispatch(PostResource.createRequest());

  return (
    <PostForm
      initialValues={{ userId: 1 }}
      onSubmit={(data: object) => create(data, {})}
    />
  );
}
