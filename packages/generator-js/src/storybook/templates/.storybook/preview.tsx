<% if (spa) { %>
import RootProvider from '../src/RootProvider';
<% } %>
import 'style/main.<% if (style !== 'linaria') { %>s<% } %>css';

<% if (spa) { %>
export const decorators = [
  (Story) => (
    <RootProvider>
      <Story/>
    </RootProvider>
  )
];
<% } %>
