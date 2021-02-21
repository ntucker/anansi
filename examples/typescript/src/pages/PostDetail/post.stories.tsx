import { Story } from '@storybook/react/types-6-0';
import { MockResolver } from '@rest-hooks/test';

import postFixtures from './post.fixture';
import PostDetail, { Props } from './index';

export default {
  title: 'Pages/PostDetail',
  component: PostDetail,
  parameters: {
    docs: {
      source: {
        type: 'code',
      },
    },
  },
  argTypes: {
    id: {
      description: 'Post ID',
      defaultValue: '1',
      control: {
        type: 'select',
        options: ['1', '2'],
      },
    },
    state: {
      description: 'Network State',
      defaultValue: 'full',
      control: {
        type: 'select',
        options: Object.keys(postFixtures),
      },
    },
  },
};

const Template: Story<{ id: string; state: keyof typeof postFixtures }> = ({
  id,
  state,
}) => (
  <MockResolver fixtures={postFixtures[state]}>
    <PostDetail match={{ params: { id } } as any} />
  </MockResolver>
);

export const FirstPost = Template.bind({});

FirstPost.args = {
  id: '1',
  state: 'full',
};
