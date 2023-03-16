<% if (spa) { %>
import RootProvider from '../src/RootProvider'
<% } else { %>
<% } %>
import 'style/main.<% if (style !== 'linaria') { %>s<% } %>css';


export const decorators = [
  (Story) => (
<% if (spa) { %><RootProvider><% } else { %><% } %>
        <Story/>
<% if (spa) { %></RootProvider><% } else { %><% } %>
  )
];

