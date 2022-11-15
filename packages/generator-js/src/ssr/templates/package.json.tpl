{
  "scripts": {
    "start": "<% if (devssl) { %>HTTPS=true SSL_CRT_FILE=localhost+1.pem SSL_KEY_FILE=localhost+1-key.pem <% } %>anansi serve --dev ./<%= rootPath %>/index.tsx",
    "start:server": "anansi serve ./<%= serverPath %>/App.js -a",
    "build:server": "webpack --mode=production --target=node --env entrypath=index.server.tsx"
  }
}
