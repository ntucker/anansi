import { MemoryRouter } from 'react-router-dom';
import { AsyncBoundary, CacheProvider, NetworkManager } from '@data-client/react';
import 'style/main.scss';


const managers = [new NetworkManager()]
export const decorators = [
  (Story) => (
    <MemoryRouter initialEntries={['/']}>
        <Story/>
    </MemoryRouter>
  )
];

