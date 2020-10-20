import React, { memo, useContext } from 'react';
import { Layout } from 'antd';
import { StateContext } from '@rest-hooks/core';

//import Routes from './routes';
import Posts from 'pages/Posts';
import NetworkBoundary from 'components/NetworkBoundary';
import { useResource } from 'rest-hooks';
import { PostResource } from 'data/resources';
function PostList() {
  const posts = useResource(PostResource.list(), {});
  return (
    <div>
      {posts.map(post => (
        <div key={post.id}>{post.title}</div>
      ))}
    </div>
  );
}

const App = () => (
  <Layout>
    <Layout.Header className="header"></Layout.Header>
    <Layout.Content
      style={{
        background: '#fff',
        padding: 0,
        margin: 0,
        minHeight: 280,
      }}
    >
      <CacheRenderer />
      <NetworkBoundary>
        <Posts />
      </NetworkBoundary>
    </Layout.Content>
  </Layout>
);
function CacheRenderer() {
  const state = useContext(StateContext);
  return JSON.stringify(state, undefined, 2);
}

export default memo(App);
