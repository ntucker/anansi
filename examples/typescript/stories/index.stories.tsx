import { Button } from '@storybook/react/demo';

export default { title: 'atoms/Button' };

export const text = () => <Button>Hello Button</Button>;

export const emoji = () => (
  <Button>
    <span role="img" aria-label="so cool">
      😀 😎 👍 💯
    </span>
  </Button>
);
