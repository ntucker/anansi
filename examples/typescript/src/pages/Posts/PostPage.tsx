import { PostResource } from 'data/resources';
import { useResource } from 'rest-hooks';
import { RouteChildrenProps } from 'react-router';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import { Link } from 'react-router-dom';
import Post from './Post';

export default function PostDetail({
  match,
}: RouteChildrenProps<{ id: string }>) {
  let id = 1;
  if (match && match.params && match.params.id) {
    id = Number.parseInt(match.params.id);
  }
  const post = useResource(PostResource.singleRequest(), { id });
  return (
    <>
      <Post post={post} />
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
