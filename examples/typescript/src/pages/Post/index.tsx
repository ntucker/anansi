import { PostResource, UserResource } from 'data/models';
import { hooks } from 'rest-hooks';
import { RouteChildrenProps } from 'react-router';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import { Link } from 'react-router-dom';
/*import Post from './Post';

export default function PostMaster({ match }: RouteChildrenProps<{ id: string }>) {
  let id = 1;
  if (match && match.params && match.params.id) {
    id = Number.parseInt(match.params.id);
  }
  const post = hooks.useResource(PostResource.singleSelect(), { id });
  const author = hooks.useResource(
    UserResource.singleSelect(),
    post && { id: post.userId },
  );
  if (!post || !author) return <div>loading</div>;
  return (
    <>
      <Post post={post} author={author} />
      <Grid container direction="row" justify="flex-end" alignItems="baseline">
        {id > 1 ? (
          <Button
            size="small"
            color="primary"
            to={`/post/${id - 1}`}
            component={Link}
          >
            Prev
          </Button>
        ) : null}
        <Button
          size="small"
          color="primary"
          to={`/post/${id + 1}`}
          component={Link}
        >
          Next
        </Button>
      </Grid>
    </>
  );
}
*/
