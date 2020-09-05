import React from 'react';
import { Story } from '@storybook/react/types-6-0';
import { MockProvider } from '@rest-hooks/test';

import postFixtures from './post.fixture';
import PostDetail, { Props } from './index';

export default {
  title: 'Pages/PostDetail',
  component: PostDetail,
  decorators: [
    (Story: React.ComponentType) => (
      <MockProvider results={postFixtures}>
        <Story />
      </MockProvider>
    ),
  ],
  argTypes: {
    id: {
      description: 'Post ID',
      defaultValue: {
        summary: '1',
      },
      control: {
        type: 'select',
        options: ['1'],
      },
    },
  },
};

const Template: Story<{ id: string }> = ({ id }) => (
  <PostDetail match={{ params: { id } } as any} />
);

export const FirstPost = Template.bind({});

FirstPost.args = {
  id: '1',
};
