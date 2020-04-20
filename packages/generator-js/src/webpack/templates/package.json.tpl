{
  "scripts": {
    "start": "webpack-dev-server --mode=development",
    "prod": "serve <%= assetPath %>",
    "build": "webpack --mode=production",
    "analyze": "webpack --mode=production --analyze",
    "profile": "webpack --mode=production --profile",
    "pkgcheck": "webpack --check=nobuild"
  }
}
