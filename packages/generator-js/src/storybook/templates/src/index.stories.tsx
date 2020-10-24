import { action } from '@storybook/addon-actions';
import { Button } from '@storybook/react/demo';

export default { title: 'atoms/Button' };

export const text = () => (
  <Button onClick={action('clicked')}>Hello Button</Button>
);

export const emoji = () => (
  <Button onClick={action('clicked')}>
    <span role="img" aria-label="so cool">
      😀 😎 👍 💯
    </span>
  </Button>
);
