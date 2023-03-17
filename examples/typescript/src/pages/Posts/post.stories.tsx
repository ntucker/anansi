import { type StoryObj } from '@storybook/react';

import PostList from './index';

export default { title: 'posts/Post', component: PostList };

export const postList: StoryObj<typeof PostList> = {};
