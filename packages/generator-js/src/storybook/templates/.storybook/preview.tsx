<% if (spa) { %>
import { DataProvider, AsyncBoundary } from '@data-client/react';
<% } %>
import '@/style/main.<% if (style !== 'linaria') { %>s<% } %>css';

<% if (spa) { %>
export const decorators = [
  (Story) => (
    <% if (spa) { %><DataProvider><AsyncBoundary><% } %>
      <Story/>
      <% if (spa) { %></AsyncBoundary></DataProvider><% } %>
  )
];
<% } %>
