import { PostResource, UserResource } from 'data/models';
import { hooks } from 'rest-hooks';
import { RouteChildrenProps } from 'react-router';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import { Link } from 'react-router-dom';
import Post from './Post';

export default function PostList() {
  const posts = hooks.useResource(PostResource.listSelect(), {});
  return (
    <>
    {
      posts.map(
        post => <Post key={post.pk() || ''} post={post} />
      )
    }
    </>
  );
}
