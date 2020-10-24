import { MemoryRouter } from 'react-router';
import { CacheProvider } from 'rest-hooks';
import 'style/main.scss';


export const decorators = [(Story) => <CacheProvider><MemoryRouter initialEntries={['/']}><Story/></MemoryRouter></CacheProvider>];
