<% if (spa) { %>
import RootProvider from '../src/RootProvider'
<% } else { %>
  import { CacheProvider, AsyncBoundary } from '@rest-hooks/react';
<% } %>
import 'style/main.<% if (style !== 'linaria') { %>s<% } %>css';


export const decorators = [
  (Story) => (
<% if (spa) { %><RootProvider><% } else { %><CacheProvider><AsyncBoundary fallback="loading"><% } %>
        <Story/>
<% if (spa) { %></RootProvider><% } else { %></AsyncBoundary></CacheProvider><% } %>
  )
];

