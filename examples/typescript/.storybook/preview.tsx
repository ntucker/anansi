import { MemoryRouter } from 'react-router-dom';
import 'style/main.scss';

export const decorators = [
  Story => (
    <MemoryRouter initialEntries={['/']}>
      <Story />
    </MemoryRouter>
  ),
];

export const tags = ['autodocs'];
