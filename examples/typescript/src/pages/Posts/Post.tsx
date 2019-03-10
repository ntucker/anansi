import { PostResource, UserResource } from 'data/resources';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import { Link } from 'react-router-dom';
import Avatar from '@material-ui/core/Avatar';
import styles from './Post.scss';
import { useResource } from 'rest-hooks';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';

export default function Post({ post }: { post: PostResource }) {
  const author = useResource(UserResource.singleRequest(), {
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
            <Link to={`/post/${post.id}`}>{post.title}</Link>
            <Link to={`/post/${post.id}/edit`}>
              <IconButton color="secondary" aria-label="Edit">
                <EditIcon />
              </IconButton>
            </Link>
          </Typography>
          <Typography component="p">{post.body}</Typography>
        </div>
      </Grid>
    </>
  );
}
