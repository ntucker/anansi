import { PostResource, UserResource } from 'data/models';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';

export default function Post({
  post,
  author,
}: {
  post: PostResource;
  author: UserResource;
}) {
  return (
    <>
      <Grid
        container
        direction="row"
        justify="space-between"
        alignItems="baseline"
      >
        <Typography variant="h5" component="h3" style={{ flex: '1 1 50%' }}>
          {post.title}
        </Typography>
        {author ? (
          <Button size="small" color="primary">
            {author.name}
          </Button>
        ) : null}
      </Grid>

      <Typography component="p">{post.body}</Typography>
    </>
  );
}
