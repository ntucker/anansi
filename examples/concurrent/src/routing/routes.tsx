import { lazy, Route } from '@anansi/router';
import { getImage } from '@rest-hooks/img';
import { Controller } from '@rest-hooks/react';

import {
  CommentResource,
  PostResource,
  UserResource,
  User,
  Post,
} from 'resources/Discuss';

const lazyPage = (pageName: string) =>
  lazy(
    () =>
      import(
        /* webpackChunkName: '[request]', webpackPrefetch: true */ `pages/${pageName}`
      ),
  );

export const namedPaths = {
  FriendNav: '/(.*)',
  Home: '/',
  SSRError: '/ssr-error',
  Posts: '/posts',
  PostDetail: '/post/:id',
  UserDetail: '/user/:id',
} as const;

export const routes: Route<Controller>[] = [
  {
    name: 'FriendNav',
    component: lazy(
      () =>
        import(
          /* webpackChunkName: 'FriendNav', webpackPreload: true */ `navigation/FriendsNav`
        ),
    ),
    resolveData: async (controller: Controller) => {
      await controller.fetch(UserResource.getList);
    },
  },
  { name: 'Home', component: lazyPage('Home') },
  { name: 'SSRError', component: lazyPage('SSRError') },
  {
    name: 'Posts',
    component: lazyPage('Posts'),
    resolveData: async (controller: Controller) => {
      const posts = await controller.fetch(PostResource.getList);
      await Promise.allSettled(
        posts.map((post: Post) =>
          Promise.allSettled([
            controller.fetch(
              UserResource.get,
              post.userId ? { id: post.userId } : (null as any),
            ),
            controller.fetch(getImage, {
              src: User.fromJS({ id: post.userId }).profileImage,
            }),
          ]),
        ),
      );
    },
  },
  {
    name: 'PostDetail',
    component: lazyPage('PostDetail'),
    resolveData: async (controller: Controller, match: { id: string }) => {
      if (match) {
        // don't block on comments but start fetching
        controller.fetch(CommentResource.getList, { postId: match.id });
        const post = await controller.fetch(PostResource.get, {
          id: match.id,
        });
        await Promise.allSettled([
          controller.fetch(
            UserResource.get,
            post.userId ? { id: post.userId } : (null as any),
          ),
          controller.fetch(getImage, {
            src: User.fromJS({ id: post.userId }).profileImage,
          }),
        ]);
      }
    },
  },
  {
    name: 'UserDetail',
    component: lazyPage('UserDetail'),
    resolveData: async (controller: Controller, match: { id: string }) => {
      if (match) {
        const fakeUser = User.fromJS({
          id: Number.parseInt(match.id, 10),
        });
        // don't block on posts but start fetching
        controller.fetch(PostResource.getList, { userId: match.id });
        await Promise.allSettled([
          controller.fetch(UserResource.get, match),
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
