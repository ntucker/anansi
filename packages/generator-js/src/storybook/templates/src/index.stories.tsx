import { action } from '@storybook/addon-actions';

export default { title: 'atoms/Button' };

export const text = () => (
  <div onClick={action('clicked')}>Hello Button</div>
);

export const emoji = () => (
  <div onClick={action('clicked')}>
    <span role="img" aria-label="so cool">
      😀 😎 👍 💯
    </span>
  </div>
);
