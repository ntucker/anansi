{
  "scripts": {
    "start": "webpack serve --mode=development",
    "start:prod": "serve <%= assetPath %>",
    "build": "webpack --mode=production",
    "build:analyze": "webpack --mode=production --env analyze",
    "build:profile": "webpack --mode=production --env profile",
    "pkgcheck": "webpack --env check=nobuild"
  }
}
