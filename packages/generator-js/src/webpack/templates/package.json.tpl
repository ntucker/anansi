{
  "scripts": {
    "start": "webpack serve --mode=development",
    "prod": "serve <%= assetPath %>",
    "build": "webpack --mode=production",
    "analyze": "webpack --mode=production --env analyze",
    "profile": "webpack --mode=production --env profile",
    "pkgcheck": "webpack --env check=nobuild"
  }
}
