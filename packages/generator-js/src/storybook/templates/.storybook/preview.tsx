<% if (spa) { %>
import { CacheProvider, AsyncBoundary } from '@data-client/react';
<% } %>
import 'style/main.<% if (style !== 'linaria') { %>s<% } %>css';

<% if (spa) { %>
export const decorators = [
  (Story) => (
    <% if (spa) { %><CacheProvider><AsyncBoundary><% } %>
      <Story/>
      <% if (spa) { %></AsyncBoundary></CacheProvider><% } %>
  )
];
<% } %>
