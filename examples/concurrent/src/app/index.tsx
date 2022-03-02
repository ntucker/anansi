import type { Root } from 'ssr/types';

import RootProvider from './RootProvider';
import App from './App';

export default function getSpout(Root: Root) {
  return (
    <Root title="Anansi">
      <RootProvider>
        <App />
      </RootProvider>
    </Root>
  );
}
