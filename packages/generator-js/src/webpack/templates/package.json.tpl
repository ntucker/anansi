{
  "scripts": {
    "start": "<% if (devssl) { %>HTTPS=true SSL_CRT_FILE=localhost+1.pem SSL_KEY_FILE=localhost+1-key.pem <% } %>webpack serve --mode=development",
    "start:prod": "serve <%= assetPath %>",
    "build": "webpack --mode=production",
    "build:analyze": "webpack --mode=production --env analyze",
    "build:profile": "webpack --mode=production --env profile",
    "test:pkg": "webpack --env check=nobuild",
    "postinstall": "rm -rf node_modules/.cache"
  }
}
