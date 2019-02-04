import { PostResource, UserResource, CommentResource } from 'data/models';
import React, { useEffect } from 'react';
import { hooks } from 'rest-hooks';
import { RouteChildrenProps } from 'react-router';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import { Link } from 'react-router-dom';
import Post from './Post';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import styles from './index.scss';

function PostList() {
  const [posts, comments] = hooks.useResource(
    [PostResource.listRequest(), {}],
    [CommentResource.listRequest(), {}],
  );
  return (
    <>
      <Link to="/posts/new">
        {' '}
        <Fab color="primary" aria-label="Add" className={styles.add}>
          <AddIcon />
        </Fab>
      </Link>
      {posts.map(post => (
        <Post key={post.pk() || ''} post={post} />
      ))}
    </>
  );
}
export default React.memo(PostList)
