import { Controller } from '@rest-hooks/core';
import { lazy, Route } from '@anansi/router';
import { getImage } from '@rest-hooks/img';

import { CommentResource, PostResource, UserResource } from 'resources/Discuss';

const lazyPage = (pageName: string) =>
  lazy(() => import(/* webpackChunkName: '[request]' */ `pages/${pageName}`));

export const namedPaths = {
  home: '/',
  posts: '/posts',
  postDetail: '/post/:id',
  userDetail: '/user/:id',
};

export const routes: Route<Controller>[] = [
  { name: 'home', component: lazyPage('Home') },
  {
    name: 'posts',
    component: lazyPage('Posts'),
    resolveData: async (controller: Controller) => {
      const posts = await controller.fetch(PostResource.list(), {});
      await Promise.all(
        posts.map((post: PostResource) =>
          Promise.all([
            controller.fetch(UserResource.detail(), { id: post.userId }),
            controller.fetch(getImage, {
              src: UserResource.fromJS({ id: post.userId }).profileImage,
            }),
          ]),
        ),
      );
    },
  },
  {
    name: 'postDetail',
    component: lazyPage('PostDetail'),
    resolveData: async (controller: Controller, match: { id: string }) => {
      if (match) {
        // don't block on comments but start fetching
        controller.fetch(CommentResource.list(), { postId: match.id });
        const post = await controller.fetch(PostResource.detail(), {
          id: match.id,
        });
        await Promise.all([
          controller.fetch(
            UserResource.detail(),
            post.userId ? { id: post.userId } : (null as any),
          ),
          controller.fetch(getImage, {
            src: UserResource.fromJS({ id: post.userId }).profileImage,
          }),
        ]);
      }
    },
  },
  {
    name: 'userDetail',
    component: lazyPage('UserDetail'),
    resolveData: async (controller: Controller, match: { id: string }) => {
      if (match) {
        const fakeUser = UserResource.fromJS({
          id: Number.parseInt(match.id, 10),
        });
        // don't block on posts but start fetching
        controller.fetch(PostResource.list(), { userId: match.id });
        await Promise.all([
          controller.fetch(UserResource.detail(), match),
          controller.fetch(getImage, {
            src: fakeUser.profileImage,
          }),
          controller.fetch(getImage, {
            src: fakeUser.coverImage,
          }),
          controller.fetch(getImage, {
            src: fakeUser.coverImageFallback,
          }),
        ]);
      }
    },
  },
];
