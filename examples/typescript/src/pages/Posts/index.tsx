import { PostResource } from 'data/resources';
import React from 'react';
import { useResource } from 'rest-hooks';
import { Link } from 'react-router-dom';
import Post from './Post';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import styles from './index.scss';

function PostList() {
  const posts = useResource(PostResource.listRequest(), {});
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
export default React.memo(PostList);
