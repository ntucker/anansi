import React, { Suspense } from 'react';
import renderer from 'react-test-renderer';
import { CacheProvider } from 'rest-hooks';
import { FixtureEndpoint, mockInitialState } from '@rest-hooks/test';
import { MemoryRouter } from 'react-router-dom';

import { PostResource, UserResource } from 'data/resources';

import PostList from '../index';

const results = {
  full: [
    {
      endpoint: PostResource.getList,
      args: [{}],
      response: [
        {
          id: 5,
          title: 'holidays',
          body: 'have a merry christmas',
          userId: 2,
        },
        {
          id: 532,
          title: 'no subject',
          body: 'never again',
          userId: 23,
        },
      ],
    },
    {
      endpoint: UserResource.get,
      args: [{ id: 2 }],
      response: {
        id: 5,
        name: 'Bob Vila',
        username: 'bob',
        email: 'bob@gmail.com',
      },
    },
    {
      endpoint: UserResource.get,
      args: [{ id: 23 }],
      response: {
        id: 5,
        name: 'Emily Van',
        username: 'emily',
        email: 'emily@gmail.com',
      },
    },
  ] as FixtureEndpoint[],
} as const;

it('renders', () => {
  const element = (
    <CacheProvider initialState={mockInitialState(results.full)}>
      <MemoryRouter>
        <Suspense fallback="loading">
          <PostList />
        </Suspense>
      </MemoryRouter>
    </CacheProvider>
  );
  const tree = renderer.create(element).toJSON();
  expect(tree).toMatchSnapshot();
});
