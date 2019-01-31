import { PostResource, UserResource } from 'data/models';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import { Link } from 'react-router-dom';
import Avatar from '@material-ui/core/Avatar';
import styles from './Post.scss';
import { hooks } from 'rest-hooks';

export default function Post({ post }: { post: PostResource }) {
  const author = hooks.useResource(UserResource.singleSelect(), {
    id: post.userId,
  });
  return (
    <>
      <Grid
        container
        direction="row"
        justify="space-between"
        alignItems="flex-start"
      >
        <Link to={`/user/${post.userId}`} className={styles.author}>
          <Avatar>{author.name.slice(0, 1)}</Avatar>
        </Link>
        <div className={styles.body}>
          <Typography variant="h5" component="h3">
            {post.title}
          </Typography>
          <Typography component="p">{post.body}</Typography>
        </div>
      </Grid>
    </>
  );
}
