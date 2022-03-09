# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

### [11.3.2](https://github.com/ntucker/anansi/compare/@anansi/webpack-config@11.3.1...@anansi/webpack-config@11.3.2) (2022-03-09)


### 🐛 Bug Fix

* linaria hot-reloading ([3d26586](https://github.com/ntucker/anansi/commit/3d2658681a846297d75991bda4ea153faff2322d))
* Still need resolve options sent to linaria ([3d638cc](https://github.com/ntucker/anansi/commit/3d638ccec1e88d30ce6143a9daa5d6af72fe2aff))


### 📦 Package

* Update `@babel/cli` to v7.17.6 ([#1429](https://github.com/ntucker/anansi/issues/1429)) ([3f210d8](https://github.com/ntucker/anansi/commit/3f210d8cdf73156f119833e1e723e9e35e9fdd7e))



### [11.3.1](https://github.com/ntucker/anansi/compare/@anansi/webpack-config@11.3.0...@anansi/webpack-config@11.3.1) (2022-02-28)


### 💅 Enhancement

* Support late process.env.WEBPACK_PUBLIC_PATH setting ([6789637](https://github.com/ntucker/anansi/commit/6789637b91bb61a5afe0ab5b2e65b6ba1248b6ec))


### 🐛 Bug Fix

* Do not include hot reloading in node builds ([9e9f5b3](https://github.com/ntucker/anansi/commit/9e9f5b3cc2511007fe8dee4d1d7b64f001b471b8))
* React SSR Doesn't like the new JSX runtime ([65bb1f1](https://github.com/ntucker/anansi/commit/65bb1f1fbb4cf311847303dd0fe5b613f558fcdc))



## [11.3.0](https://github.com/ntucker/anansi/compare/@anansi/webpack-config@11.2.4...@anansi/webpack-config@11.3.0) (2022-02-21)


### 🚀 Features

* Add router and react-18 demo ([#1425](https://github.com/ntucker/anansi/issues/1425)) ([32e922c](https://github.com/ntucker/anansi/commit/32e922cb48d365128699f84adbcfa1a9d3c3f243))


### 📦 Package

* Update `@babel/core` to v7.17.5 ([#1423](https://github.com/ntucker/anansi/issues/1423)) ([cb23726](https://github.com/ntucker/anansi/commit/cb23726f08ef9e0c630b6176eb768d2da89607ea))



### [11.2.4](https://github.com/ntucker/anansi/compare/@anansi/webpack-config@11.2.3...@anansi/webpack-config@11.2.4) (2022-02-16)


### 💅 Enhancement

* Remove thread-loader ([#1421](https://github.com/ntucker/anansi/issues/1421)) ([b6adba5](https://github.com/ntucker/anansi/commit/b6adba589937800bb0b9140866399715ce59c76a))


### 📦 Package

* Update `@babel/core` to v7.17.4 ([#1420](https://github.com/ntucker/anansi/issues/1420)) ([16864d0](https://github.com/ntucker/anansi/commit/16864d039dafc73b139fe8107b42461e1ca3f314))
* Update `@hot-loader/react-dom` to v17 ([#1417](https://github.com/ntucker/anansi/issues/1417)) ([bb63701](https://github.com/ntucker/anansi/commit/bb6370125d51fbf3eef386554459fae7e74a1a3f))
* Update babel monorepo to v7.17.3 ([#1416](https://github.com/ntucker/anansi/issues/1416)) ([606e69f](https://github.com/ntucker/anansi/commit/606e69f48546f982904f0649def9b6c8adc051e9))



### [11.2.3](https://github.com/ntucker/anansi/compare/@anansi/webpack-config@11.2.2...@anansi/webpack-config@11.2.3) (2022-02-14)


### 💅 Enhancement

* Use yarn2 if corepack is enabled ([53abc42](https://github.com/ntucker/anansi/commit/53abc425e4380a0c9547dc1c4607cc82f4604113))



### [11.2.2](https://github.com/ntucker/anansi/compare/@anansi/webpack-config@11.2.1...@anansi/webpack-config@11.2.2) (2022-02-12)


### 💅 Enhancement

* Graceful fallback to http if cert cannot be found ([f37c13a](https://github.com/ntucker/anansi/commit/f37c13a87ca1ca2de97cedd4b5523296cd3c684e))



### [11.2.1](https://github.com/ntucker/anansi/compare/@anansi/webpack-config@11.2.0...@anansi/webpack-config@11.2.1) (2022-02-12)


### 🐛 Bug Fix

* WEBPACK_CACHE='memory' ([cdc96e1](https://github.com/ntucker/anansi/commit/cdc96e1354bec9bf51e3135fcd937238b8cf0e91))



## [11.2.0](https://github.com/ntucker/anansi/compare/@anansi/webpack-config@11.1.6...@anansi/webpack-config@11.2.0) (2022-02-12)


### 🚀 Features

* WEBPACK_CACHE allows full cache type control ([450349f](https://github.com/ntucker/anansi/commit/450349f652fcb5efd9057f6b2ddc573e0ffa03e8))


### 💅 Enhancement

* Move linaria cache to node_modules/.cache ([60aaad0](https://github.com/ntucker/anansi/commit/60aaad0fe32b37ff220213dc9bf40b4f215ebc53))
* Use default cache directories ([85b20ee](https://github.com/ntucker/anansi/commit/85b20ee21e502c83cf5de4518010e184c59537b5))


### 🐛 Bug Fix

* Support webcontainers like stackblitz ([#1392](https://github.com/ntucker/anansi/issues/1392)) ([a74f0c3](https://github.com/ntucker/anansi/commit/a74f0c35965038ac1d8a232507a1ad50c357fe9d))



### [11.1.6](https://github.com/ntucker/anansi/compare/@anansi/webpack-config@11.1.5...@anansi/webpack-config@11.1.6) (2022-02-11)


### 🐛 Bug Fix

* Add back default extensions explicitly for compatibility with linaria ([c5837cd](https://github.com/ntucker/anansi/commit/c5837cd9dee93663a0099162f3159b2812cca911))
* Linaria uses anansi resolution rules when using JS variables ([16ab5cb](https://github.com/ntucker/anansi/commit/16ab5cb9a91764489082f8b51c026cdc0fa70566))



### [11.1.5](https://github.com/ntucker/anansi/compare/@anansi/webpack-config@11.1.4...@anansi/webpack-config@11.1.5) (2022-02-09)


### 🐛 Bug Fix

* Linaria works with svg urls ([#1388](https://github.com/ntucker/anansi/issues/1388)) ([8d24f56](https://github.com/ntucker/anansi/commit/8d24f562ea5a0bc6401e7e705239fb803db4ac45))
* Make svg naming consistent between svgr and non-svgr ([9828b17](https://github.com/ntucker/anansi/commit/9828b17847c325abf8ec14b14945fffabe2e233e))


### 📦 Package

* bump @babel/runtime from 7.17.0 to 7.17.2 ([#1386](https://github.com/ntucker/anansi/issues/1386)) ([6b2fe59](https://github.com/ntucker/anansi/commit/6b2fe59ac1832c099285a896386e7ab9c5daff3f))



### [11.1.4](https://github.com/ntucker/anansi/compare/@anansi/webpack-config@11.1.3...@anansi/webpack-config@11.1.4) (2022-02-07)


### 📦 Package

* @linaria/webpack5-loader to beta.17 ([#1374](https://github.com/ntucker/anansi/issues/1374)) ([8665ff0](https://github.com/ntucker/anansi/commit/8665ff049487f3af648ce14dc26fb57164d55cf6))



### [11.1.3](https://github.com/ntucker/anansi/compare/@anansi/webpack-config@11.1.2...@anansi/webpack-config@11.1.3) (2022-02-07)


### 🐛 Bug Fix

* Fixed output name does not work with runtime entry ([3ab8c2f](https://github.com/ntucker/anansi/commit/3ab8c2f4f4a94374c0c6e3225127fd5a08bc8e0e))



### [11.1.2](https://github.com/ntucker/anansi/compare/@anansi/webpack-config@11.1.1...@anansi/webpack-config@11.1.2) (2022-02-07)


### 🐛 Bug Fix

* devmode file override ([cbb553d](https://github.com/ntucker/anansi/commit/cbb553d211f77b4836cbc534301e86bb2f455c61))
* Fix https cert path ([87160db](https://github.com/ntucker/anansi/commit/87160dbcb4afbd3f4f0a3ee8ee49889298305dd1))



### [11.1.1](https://github.com/ntucker/anansi/compare/@anansi/webpack-config@11.1.0...@anansi/webpack-config@11.1.1) (2022-02-06)


### 💅 Enhancement

* No longer use deprecated onBeforeSetupMiddleware ([76c630e](https://github.com/ntucker/anansi/commit/76c630e75e94b3cd76b654a58c854ae7994a243f))
* Use http2 when SSL is enabled ([eef2053](https://github.com/ntucker/anansi/commit/eef20534eb01be2215f54463d4ae89f6f17d19f9))


### 🐛 Bug Fix

* Still allow globalStyleDir when sass is disabled ([35ef93e](https://github.com/ntucker/anansi/commit/35ef93e03bad7891a21ac6b047143686b655e965))



## [11.1.0](https://github.com/ntucker/anansi/compare/@anansi/webpack-config@11.0.0...@anansi/webpack-config@11.1.0) (2022-02-06)


### ⚠ 💥 BREAKING CHANGES

* Importing scss file requires including the file
extension

### 🚀 Features

* Add sassOptions ([#1373](https://github.com/ntucker/anansi/issues/1373)) ([5dd7e5d](https://github.com/ntucker/anansi/commit/5dd7e5d23c06deae9f661f7e2501524e4a93e20f))
* dev-server https config via ENV ([#1372](https://github.com/ntucker/anansi/issues/1372)) ([0c528a2](https://github.com/ntucker/anansi/commit/0c528a2f0f3d6205371b4d019486e47d167843c6))


### 💅 Enhancement

* Expand webpack dev server header allowances ([3c7fe81](https://github.com/ntucker/anansi/commit/3c7fe818e9646eb17170bae7ae28159a3f980c29))
* Ignore watching cache directories ([49676e2](https://github.com/ntucker/anansi/commit/49676e2d6b1a3d3889f36ab4fb26b3fb7340da69))
* Only support TypeScript and default webpack extensions ([#1371](https://github.com/ntucker/anansi/issues/1371)) ([2ca7bd2](https://github.com/ntucker/anansi/commit/2ca7bd2b882914094a9dce036e9e50c0e53b00c9))


### 🐛 Bug Fix

* Some cases of hot reloading broke ([86cbf12](https://github.com/ntucker/anansi/commit/86cbf12287722352f08eed5aafcc108272692257))



## [11.0.0](https://github.com/ntucker/anansi/compare/@anansi/webpack-config@10.0.9...@anansi/webpack-config@11.0.0) (2022-02-06)


### ⚠ 💥 BREAKING CHANGES

* Sass implementation now uses https://github.com/sass/dart-sass

### 🐛 Bug Fix

* Storybook integration (after threadloader update) ([8fd07cd](https://github.com/ntucker/anansi/commit/8fd07cd24be7fafce3dd2f0c04587e173a437073))


### 📦 Package

* Switch from node-sass to dart-sass ([31717cd](https://github.com/ntucker/anansi/commit/31717cd49c128013765286f229b3fe07205f2fbc))



### [10.0.9](https://github.com/ntucker/anansi/compare/@anansi/webpack-config@10.0.8...@anansi/webpack-config@10.0.9) (2022-02-06)


### 💅 Enhancement

* Don't hash files in development ([5c7fea7](https://github.com/ntucker/anansi/commit/5c7fea7a60beb0c5ef6fa69418d9a61de1046cc4))
* Improve rebuilds by keeping entry chunk tiny in devmode ([d73a5c8](https://github.com/ntucker/anansi/commit/d73a5c85d3148bf18c44e14f6703eced602e611d))
* Improve worker pool performance due to node-sass bug ([c00ffe3](https://github.com/ntucker/anansi/commit/c00ffe39f6d030c9963e973285bf12fbacc6571d))
* Remove more expensive webpack operations in devmode ([f23b763](https://github.com/ntucker/anansi/commit/f23b763604a89d019a6e17d820fc67ff6c2a5af0))
* Remove pathinfo in dev mode to reduce GC pressure ([1162713](https://github.com/ntucker/anansi/commit/11627132f4b3e02163e25a3dda3165e254f3fbe7))
* Speed up incrmeental builds ([86f4c34](https://github.com/ntucker/anansi/commit/86f4c34763f2a7d443da4f7a66b656fd1852f7ed))



### [10.0.8](https://github.com/ntucker/anansi/compare/@anansi/webpack-config@10.0.7...@anansi/webpack-config@10.0.8) (2022-02-05)


### 🐛 Bug Fix

* Include error overlay so newer buggy version isn't used ([c372399](https://github.com/ntucker/anansi/commit/c37239911d6618b4ea386956fa754a412012370e))


### 📦 Package

* bump postcss-preset-env from 7.3.0 to 7.3.1 ([#1367](https://github.com/ntucker/anansi/issues/1367)) ([b629e08](https://github.com/ntucker/anansi/commit/b629e083faa4618086c8efd746cb05509782ba17))



### [10.0.7](https://github.com/ntucker/anansi/compare/@anansi/webpack-config@10.0.6...@anansi/webpack-config@10.0.7) (2022-02-03)

**Note:** Version bump only for package @anansi/webpack-config





### [10.0.6](https://github.com/ntucker/anansi/compare/@anansi/webpack-config@10.0.5...@anansi/webpack-config@10.0.6) (2022-02-03)


### 🐛 Bug Fix

* Compile error overlay dismiss when hot reload previously already occured ([ab34089](https://github.com/ntucker/anansi/commit/ab340894e5405abebc962587b9470c60928cf2c2))


### 📦 Package

* bump css-loader from 6.5.1 to 6.6.0 ([#1363](https://github.com/ntucker/anansi/issues/1363)) ([7ad4e24](https://github.com/ntucker/anansi/commit/7ad4e24c7beef888bb26a1ed67cf070717a72575))



### [10.0.5](https://github.com/ntucker/anansi/compare/@anansi/webpack-config@10.0.4...@anansi/webpack-config@10.0.5) (2022-02-03)

**Note:** Version bump only for package @anansi/webpack-config





### [10.0.4](https://github.com/ntucker/anansi/compare/@anansi/webpack-config@10.0.3...@anansi/webpack-config@10.0.4) (2022-02-02)


### 🐛 Bug Fix

* Fixed compiler errors should dismiss overlay ([7a07b80](https://github.com/ntucker/anansi/commit/7a07b80997b31d0394c03b96b4575d6e4c4596d8))


### 📦 Package

* bump @svgr/webpack from 6.2.0 to 6.2.1 ([#1349](https://github.com/ntucker/anansi/issues/1349)) ([de0c01d](https://github.com/ntucker/anansi/commit/de0c01dd0f1d689ebfe1fcec594d518b5a6a564c))
* bump core-js from 3.20.3 to 3.21.0 ([#1356](https://github.com/ntucker/anansi/issues/1356)) ([6bee03a](https://github.com/ntucker/anansi/commit/6bee03a5327d8475d0a7d571d5a537fedbd9941c))
* bump postcss from 8.4.5 to 8.4.6 ([#1355](https://github.com/ntucker/anansi/issues/1355)) ([72d8f84](https://github.com/ntucker/anansi/commit/72d8f845b11a3b9f3eb391eb0ee1e5eaf6d39772))
* bump postcss-preset-env from 7.2.3 to 7.3.0 ([#1343](https://github.com/ntucker/anansi/issues/1343)) ([257403d](https://github.com/ntucker/anansi/commit/257403d39e5e6235ab9ae94eccbd8ec971f08903))
* bump terser-webpack-plugin from 5.3.0 to 5.3.1 ([#1350](https://github.com/ntucker/anansi/issues/1350)) ([525a3a8](https://github.com/ntucker/anansi/commit/525a3a864dd3d16a9f316fadf9a57df4ec5ab547))
* bump webpack-remove-empty-scripts from 0.7.2 to 0.7.3 ([#1347](https://github.com/ntucker/anansi/issues/1347)) ([f4ca92d](https://github.com/ntucker/anansi/commit/f4ca92df6e8c27737b218de3439026f3b924345a))



### [10.0.3](https://github.com/ntucker/anansi/compare/@anansi/webpack-config@10.0.2...@anansi/webpack-config@10.0.3) (2022-01-28)


### 📦 Package

* bump markdown-loader from 6.0.0 to 8.0.0 ([#1330](https://github.com/ntucker/anansi/issues/1330)) ([bbc4f95](https://github.com/ntucker/anansi/commit/bbc4f955fb18878d1792cd879f8e4ad10dfc582a))
* bump mini-css-extract-plugin from 2.5.2 to 2.5.3 ([#1318](https://github.com/ntucker/anansi/issues/1318)) ([ebbd190](https://github.com/ntucker/anansi/commit/ebbd190cf16934f6241b772b98790d568a213a87))



### [10.0.2](https://github.com/ntucker/anansi/compare/@anansi/webpack-config@10.0.1...@anansi/webpack-config@10.0.2) (2022-01-21)


### 📦 Package

* bump core-js from 3.20.2 to 3.20.3 ([#1280](https://github.com/ntucker/anansi/issues/1280)) ([31e90e5](https://github.com/ntucker/anansi/commit/31e90e5e5902a3dd1ae177219e54a9c8c97d7e7d))
* bump css-minimizer-webpack-plugin from 3.3.1 to 3.4.1 ([#1293](https://github.com/ntucker/anansi/issues/1293)) ([9f3580e](https://github.com/ntucker/anansi/commit/9f3580e2767b932939ca8c4b1a5443abce9e29c2))
* bump mini-css-extract-plugin from 2.4.6 to 2.4.7 ([#1272](https://github.com/ntucker/anansi/issues/1272)) ([2ea9c58](https://github.com/ntucker/anansi/commit/2ea9c580f166a6b20618480d84276ee43145747b))
* bump mini-css-extract-plugin from 2.5.0 to 2.5.2 ([#1294](https://github.com/ntucker/anansi/issues/1294)) ([e021377](https://github.com/ntucker/anansi/commit/e0213774699229760d9f6e7891ff132fe65271a2))
* bump postcss-preset-env from 7.2.0 to 7.2.3 ([#1269](https://github.com/ntucker/anansi/issues/1269)) ([28e32ec](https://github.com/ntucker/anansi/commit/28e32ec5e5cbf9c3bca56fc579a8c3cf00d0ad99))
* bump ramda from 0.27.2 to 0.28.0 ([#1291](https://github.com/ntucker/anansi/issues/1291)) ([ea99455](https://github.com/ntucker/anansi/commit/ea99455ab0df2bc76454d32071f5d22216113ddb))
* mini-css-extract-plugin, ts-jest, rollup ([#1277](https://github.com/ntucker/anansi/issues/1277)) ([264419a](https://github.com/ntucker/anansi/commit/264419aa034985a17e8bacfaa9ca87c57102a087))



### [10.0.1](https://github.com/ntucker/anansi/compare/@anansi/webpack-config@10.0.0...@anansi/webpack-config@10.0.1) (2022-01-12)


### 📦 Package

* bump @svgr/webpack from 6.1.2 to 6.2.0 ([#1257](https://github.com/ntucker/anansi/issues/1257)) ([d9ce524](https://github.com/ntucker/anansi/commit/d9ce5247dee4e4406000af4641fdbac6ab540fb8))
* bump autoprefixer from 10.4.1 to 10.4.2 ([#1245](https://github.com/ntucker/anansi/issues/1245)) ([8e0f04f](https://github.com/ntucker/anansi/commit/8e0f04f1cba2612b30deec307ee59717c7ecffb2))
* bump html-loader from 3.0.1 to 3.1.0 ([#1261](https://github.com/ntucker/anansi/issues/1261)) ([25d9ec7](https://github.com/ntucker/anansi/commit/25d9ec78f810e4938333a2599063c0fe26315c7c))
* bump mini-css-extract-plugin from 2.4.5 to 2.4.6 ([#1244](https://github.com/ntucker/anansi/issues/1244)) ([97e7a86](https://github.com/ntucker/anansi/commit/97e7a86804ccb19aa5c299a95e59e83589ffbd5e))
* bump ramda from 0.27.1 to 0.27.2 ([#1263](https://github.com/ntucker/anansi/issues/1263)) ([acb7d00](https://github.com/ntucker/anansi/commit/acb7d0082f1525e467737ebaaed72bd5566f6efe))



## [10.0.0](https://github.com/ntucker/anansi/compare/@anansi/webpack-config@9.3.0...@anansi/webpack-config@10.0.0) (2022-01-06)


### ⚠ 💥 BREAKING CHANGES

* svgr uses SVGO 2 config

Bumps [@svgr/webpack](https://github.com/gregberge/svgr) from 5.5.0 to 6.1.2.
- [Release notes](https://github.com/gregberge/svgr/releases)
- [Changelog](https://github.com/gregberge/svgr/blob/main/CHANGELOG.md)
- [Commits](https://github.com/gregberge/svgr/compare/v5.5.0...v6.1.2)

### 💅 Enhancement

* Improve prod scss extraction ([5b1aee6](https://github.com/ntucker/anansi/commit/5b1aee64df0a7ec8d85197e4da4563aef7d495cf))
* Use fallback instead of alias for node polyfills ([1c4424c](https://github.com/ntucker/anansi/commit/1c4424c06a13e430e4e31b00a67aed91c4984c97))


### 🐛 Bug Fix

* fast refresh stops on needed bail outs ([#1240](https://github.com/ntucker/anansi/issues/1240)) ([864f2ff](https://github.com/ntucker/anansi/commit/864f2ff397ffab3450a83407c1d449abae26e72e))


### 📦 Package

* @linaria/webpack-loader fixed to beta.14 until it is fixed ([a45720c](https://github.com/ntucker/anansi/commit/a45720c30d2e9be1fa829703b901da14c6fc48cb))
* bump @babel/runtime from 7.16.5 to 7.16.7 ([#1220](https://github.com/ntucker/anansi/issues/1220)) ([d787e69](https://github.com/ntucker/anansi/commit/d787e6991287f2563272b8401c5434975595f67c))
* bump @pmmmwh/react-refresh-webpack-plugin from 0.5.3 to 0.5.4 ([#1172](https://github.com/ntucker/anansi/issues/1172)) ([7c43245](https://github.com/ntucker/anansi/commit/7c43245946a9ebe226089b05239c8fa74d395cdd))
* bump @svgr/webpack from 5.5.0 to 6.1.2 ([#1156](https://github.com/ntucker/anansi/issues/1156)) ([79ba411](https://github.com/ntucker/anansi/commit/79ba41174f56dab38e63206050d404331423f061))
* bump autoprefixer from 10.4.0 to 10.4.1 ([#1205](https://github.com/ntucker/anansi/issues/1205)) ([df3e619](https://github.com/ntucker/anansi/commit/df3e619a2472031d6164db5e7f6f9c0f7dc1a451))
* bump core-js from 3.19.1 to 3.20.0 ([#1176](https://github.com/ntucker/anansi/issues/1176)) ([accbfa7](https://github.com/ntucker/anansi/commit/accbfa7c140f9a2a95112a5841cf1a55cdb14246))
* bump core-js from 3.20.0 to 3.20.1 ([#1191](https://github.com/ntucker/anansi/issues/1191)) ([0714c8f](https://github.com/ntucker/anansi/commit/0714c8f0d721b533746b7998cce332ce71404cdf))
* bump core-js from 3.20.1 to 3.20.2 ([#1231](https://github.com/ntucker/anansi/issues/1231)) ([09fa118](https://github.com/ntucker/anansi/commit/09fa1181ea886715052957c88b44044a9afe72dd))
* bump critters-webpack-plugin from 3.0.1 to 3.0.2 ([#1241](https://github.com/ntucker/anansi/issues/1241)) ([e1ba6d4](https://github.com/ntucker/anansi/commit/e1ba6d4cff3eca756ecc0a860adff412aa43be0c))
* bump css-minimizer-webpack-plugin from 3.3.0 to 3.3.1 ([#1180](https://github.com/ntucker/anansi/issues/1180)) ([6a00dbe](https://github.com/ntucker/anansi/commit/6a00dbe27fb63ac4ecfa63511e9a24d1dcbd015c))
* bump node-sass from 6.0.1 to 7.0.0 ([#1177](https://github.com/ntucker/anansi/issues/1177)) ([e44b509](https://github.com/ntucker/anansi/commit/e44b509e2652cb4d67ccee9d92fa9bd025bb08a3))
* bump node-sass from 7.0.0 to 7.0.1 ([#1195](https://github.com/ntucker/anansi/issues/1195)) ([2fb97c8](https://github.com/ntucker/anansi/commit/2fb97c84433ebc9ed2351ce36faf097bd198ed86))
* bump postcss-preset-env from 7.0.2 to 7.1.0 ([#1183](https://github.com/ntucker/anansi/issues/1183)) ([0ca3337](https://github.com/ntucker/anansi/commit/0ca3337ad2936d208e7c2f3ac1eadc1c24d005a3))
* bump postcss-preset-env from 7.1.0 to 7.2.0 ([#1229](https://github.com/ntucker/anansi/issues/1229)) ([a8e98ce](https://github.com/ntucker/anansi/commit/a8e98cee6da855e60b2789061707ce5008026635))
* bump react-dev-utils from 11.0.4 to 12.0.0 ([#1162](https://github.com/ntucker/anansi/issues/1162)) ([3179b63](https://github.com/ntucker/anansi/commit/3179b6348c28eb8d28671075579078bb9c4952e1))
* linaria to 3-beta.17 ([#1159](https://github.com/ntucker/anansi/issues/1159)) ([c808566](https://github.com/ntucker/anansi/commit/c808566061dd004cf74c1fcda028a6d06e143538))



## [9.3.0](https://github.com/ntucker/anansi/compare/@anansi/webpack-config@9.2.0...@anansi/webpack-config@9.3.0) (2021-12-19)


### 🚀 Features

* Storybook 6.4 compatibility ([#1158](https://github.com/ntucker/anansi/issues/1158)) ([dda4247](https://github.com/ntucker/anansi/commit/dda42471bfe43f9511a868f17a7eb594e3180c08))


### 📦 Package

* bump css-minimizer-webpack-plugin from 3.1.4 to 3.2.0 ([#1120](https://github.com/ntucker/anansi/issues/1120)) ([147e874](https://github.com/ntucker/anansi/commit/147e87451cdd28c7a2e5d643451af0751a8c3638))
* bump postcss from 8.3.11 to 8.4.1 ([#1123](https://github.com/ntucker/anansi/issues/1123)) ([480b8fd](https://github.com/ntucker/anansi/commit/480b8fdc77483670ffc48223192b7f2227213dc9))
* bump postcss from 8.4.1 to 8.4.3 ([#1129](https://github.com/ntucker/anansi/issues/1129)) ([8f1f25f](https://github.com/ntucker/anansi/commit/8f1f25f048dc8a2f8e2f0fec9328068df2f2d5e8))
* bump postcss-loader from 6.2.0 to 6.2.1 ([#1128](https://github.com/ntucker/anansi/issues/1128)) ([987ed55](https://github.com/ntucker/anansi/commit/987ed55d6a44e42b53515a98518a40b783e53803))
* css-minimizer-webpack-plugin, sass-loader ([7c3c154](https://github.com/ntucker/anansi/commit/7c3c1549b6c1743deef1e43c1690cb2804617c30))



## [9.2.0](https://github.com/ntucker/anansi/compare/@anansi/webpack-config@9.1.3...@anansi/webpack-config@9.2.0) (2021-11-21)


### 🚀 Features

* Use CrittersPlugin again ([757e38c](https://github.com/ntucker/anansi/commit/757e38c989f6692313239ee42df32ae81d4566db))


### 🐛 Bug Fix

* Prod build css; class properties for modern targets ([637a405](https://github.com/ntucker/anansi/commit/637a405986e2e68a9269278e2c69f227f9096db5))


### 📦 Package

* bump @babel/runtime from 7.15.4 to 7.16.0 ([#1044](https://github.com/ntucker/anansi/issues/1044)) ([7e4e3cd](https://github.com/ntucker/anansi/commit/7e4e3cdcc8896c5c6cf86fe83017d386b3d3d41a))
* bump @babel/runtime from 7.16.0 to 7.16.3 ([#1079](https://github.com/ntucker/anansi/issues/1079)) ([7508841](https://github.com/ntucker/anansi/commit/7508841fadc1df1adf15a0ca055cfe20fc19c9eb))
* bump autoprefixer from 10.3.7 to 10.4.0 ([#1038](https://github.com/ntucker/anansi/issues/1038)) ([6792e5a](https://github.com/ntucker/anansi/commit/6792e5a21ff81c6e5b2abdf2a4833b7dab451b3e))
* bump babel-loader from 8.2.2 to 8.2.3 ([#1018](https://github.com/ntucker/anansi/issues/1018)) ([e24d649](https://github.com/ntucker/anansi/commit/e24d649537ef29360186923991498c885325f57b))
* bump core-js from 3.18.3 to 3.19.0 ([#1030](https://github.com/ntucker/anansi/issues/1030)) ([657795c](https://github.com/ntucker/anansi/commit/657795c1c60bb660940c89b55083b206d903409e))
* bump core-js from 3.19.0 to 3.19.1 ([#1066](https://github.com/ntucker/anansi/issues/1066)) ([f82521f](https://github.com/ntucker/anansi/commit/f82521f16a8e24a69d5885b281d793a6555a190d))
* bump css-loader from 6.4.0 to 6.5.0 ([#1035](https://github.com/ntucker/anansi/issues/1035)) ([78639d9](https://github.com/ntucker/anansi/commit/78639d9e06f6457dd61e1223deb225f23e1d08a8))
* bump css-loader from 6.5.0 to 6.5.1 ([#1069](https://github.com/ntucker/anansi/issues/1069)) ([2ee7415](https://github.com/ntucker/anansi/commit/2ee74151ea0f8ca67420c4aa1185989cc917de2c))
* bump css-minimizer-webpack-plugin from 3.1.1 to 3.1.2 ([#1077](https://github.com/ntucker/anansi/issues/1077)) ([ee5f637](https://github.com/ntucker/anansi/commit/ee5f637da12a65c06d0572c8f4476903917c53bb))
* bump css-minimizer-webpack-plugin from 3.1.2 to 3.1.3 ([#1086](https://github.com/ntucker/anansi/issues/1086)) ([7cd35da](https://github.com/ntucker/anansi/commit/7cd35da119d449d20ade81e79e784217eb9d7efd))
* bump css-minimizer-webpack-plugin from 3.1.3 to 3.1.4 ([#1102](https://github.com/ntucker/anansi/issues/1102)) ([12f244e](https://github.com/ntucker/anansi/commit/12f244e1d5a574d23f077c8d70dde7d301412a47))
* bump html-loader from 2.1.2 to 3.0.0 ([#1020](https://github.com/ntucker/anansi/issues/1020)) ([0b42f85](https://github.com/ntucker/anansi/commit/0b42f85b240fb3e7efc72516e0a4dbfe58e2701a))
* bump html-loader from 3.0.0 to 3.0.1 ([#1067](https://github.com/ntucker/anansi/issues/1067)) ([0cd60c1](https://github.com/ntucker/anansi/commit/0cd60c1c1794b6f383a9579096e0b38805f684d4))
* bump html-webpack-plugin from 5.4.0 to 5.5.0 ([#1028](https://github.com/ntucker/anansi/issues/1028)) ([44881c9](https://github.com/ntucker/anansi/commit/44881c9f0084fe7c31eaef59b7c91f4cc69b15f2))
* bump mini-css-extract-plugin from 2.4.2 to 2.4.3 ([#1016](https://github.com/ntucker/anansi/issues/1016)) ([8b82f2f](https://github.com/ntucker/anansi/commit/8b82f2f28040eed36f98f5eabfd5c192336784dc))
* bump mini-css-extract-plugin from 2.4.3 to 2.4.4 ([#1072](https://github.com/ntucker/anansi/issues/1072)) ([942cc25](https://github.com/ntucker/anansi/commit/942cc25308928bfdd357e4547b1f7be115478475))
* bump mini-css-extract-plugin from 2.4.4 to 2.4.5 ([#1104](https://github.com/ntucker/anansi/issues/1104)) ([5185410](https://github.com/ntucker/anansi/commit/5185410b350a481e1e3d36807951b9df3bbf4a6f))
* bump postcss from 8.3.10 to 8.3.11 ([#1019](https://github.com/ntucker/anansi/issues/1019)) ([fba6b06](https://github.com/ntucker/anansi/commit/fba6b06d0a284d23ca37e329a0f4176ae82ec454))
* bump postcss from 8.3.9 to 8.3.10 ([#1013](https://github.com/ntucker/anansi/issues/1013)) ([ad7ab21](https://github.com/ntucker/anansi/commit/ad7ab2163fa00f344ba3b876111764d2bb60ea9b))
* bump postcss-preset-env from 6.7.0 to 7.0.1 ([#1108](https://github.com/ntucker/anansi/issues/1108)) ([a7f9117](https://github.com/ntucker/anansi/commit/a7f91173c552dd8dc3ad98ae6c9d5709773069af))
* bump sass-loader from 12.2.0 to 12.3.0 ([#1036](https://github.com/ntucker/anansi/issues/1036)) ([5503d91](https://github.com/ntucker/anansi/commit/5503d91fa13686e067d67d6c77b523aae354c8da))
* bump svgo from 2.7.0 to 2.8.0 ([#1065](https://github.com/ntucker/anansi/issues/1065)) ([ecae554](https://github.com/ntucker/anansi/commit/ecae554ab7fc0ffe8f10a331d6b960838c92129d))
* bump tsconfig-paths-webpack-plugin from 3.5.1 to 3.5.2 ([#1093](https://github.com/ntucker/anansi/issues/1093)) ([07b57a8](https://github.com/ntucker/anansi/commit/07b57a83ee5c02dce5033b0e2695c31603e4343d))



### [9.1.3](https://github.com/ntucker/anansi/compare/@anansi/webpack-config@9.1.2...@anansi/webpack-config@9.1.3) (2021-10-19)

**Note:** Version bump only for package @anansi/webpack-config





### [9.1.2](https://github.com/ntucker/anansi/compare/@anansi/webpack-config@9.1.1...@anansi/webpack-config@9.1.2) (2021-10-18)


### 🐛 Bug Fix

* Resolve buffer package ([5521dc6](https://github.com/ntucker/anansi/commit/5521dc66503b1ef69ba39cd22519e5a8a5296b95))


### 📦 Package

* bump html-webpack-plugin from 5.3.2 to 5.4.0 ([#998](https://github.com/ntucker/anansi/issues/998)) ([7891a0a](https://github.com/ntucker/anansi/commit/7891a0a569e90a42051a2e7fee908da896b70552))



### [9.1.1](https://github.com/ntucker/anansi/compare/@anansi/webpack-config@9.1.0...@anansi/webpack-config@9.1.1) (2021-10-14)


### 🐛 Bug Fix

* Worker modules should follow nohash name rules ([53d17ff](https://github.com/ntucker/anansi/commit/53d17ffde35f13c406f24890478f0272a5dd0502))


### 📦 Package

* bump autoprefixer from 10.3.4 to 10.3.5 ([#896](https://github.com/ntucker/anansi/issues/896)) ([9ddc17c](https://github.com/ntucker/anansi/commit/9ddc17c13f19d2065f083c5382a404d6c99e16f2))
* bump autoprefixer from 10.3.5 to 10.3.6 ([#903](https://github.com/ntucker/anansi/issues/903)) ([8cf22a4](https://github.com/ntucker/anansi/commit/8cf22a41839d0226188b1858e8b4c2d151bcf1d9))
* bump autoprefixer from 10.3.6 to 10.3.7 ([#930](https://github.com/ntucker/anansi/issues/930)) ([abec784](https://github.com/ntucker/anansi/commit/abec784908b65444bd100bfe46babb2ac24236b3))
* bump core-js from 3.17.3 to 3.18.0 ([#883](https://github.com/ntucker/anansi/issues/883)) ([8c1f252](https://github.com/ntucker/anansi/commit/8c1f2524d03b37125207e19f737998ed7ed2fa63))
* bump core-js from 3.18.0 to 3.18.1 ([#911](https://github.com/ntucker/anansi/issues/911)) ([7d63887](https://github.com/ntucker/anansi/commit/7d638872481ac01fc3f8c754e98da3fead97d0ea))
* bump core-js from 3.18.1 to 3.18.2 ([#941](https://github.com/ntucker/anansi/issues/941)) ([b52355a](https://github.com/ntucker/anansi/commit/b52355a0f839763cc96621e45d02cbc1225f1728))
* bump core-js from 3.18.2 to 3.18.3 ([#969](https://github.com/ntucker/anansi/issues/969)) ([fc79210](https://github.com/ntucker/anansi/commit/fc79210d1ee7448344dfb231448e533d967ba766))
* bump css-minimizer-webpack-plugin from 3.0.2 to 3.1.0 ([#932](https://github.com/ntucker/anansi/issues/932)) ([fdf07a7](https://github.com/ntucker/anansi/commit/fdf07a7119c5e9fce5bcb880d1c705431cd2a7b1))
* bump css-minimizer-webpack-plugin from 3.1.0 to 3.1.1 ([#939](https://github.com/ntucker/anansi/issues/939)) ([99043cf](https://github.com/ntucker/anansi/commit/99043cf46793c97f6dc1f0fc42caca67efc5ce1e))
* bump mini-css-extract-plugin from 2.3.0 to 2.4.1 ([#940](https://github.com/ntucker/anansi/issues/940)) ([f675c6a](https://github.com/ntucker/anansi/commit/f675c6aacca8ccbae8e2f6fb693febde1d9d4dc8))
* bump mini-css-extract-plugin from 2.4.1 to 2.4.2 ([#960](https://github.com/ntucker/anansi/issues/960)) ([fcd5dcf](https://github.com/ntucker/anansi/commit/fcd5dcf0c9228ee004ec27a740c1b73204f3428c))
* bump postcss from 8.3.6 to 8.3.7 ([#894](https://github.com/ntucker/anansi/issues/894)) ([13d4266](https://github.com/ntucker/anansi/commit/13d42666f4a0647ca43e289d80d655ed8f0526e6))
* bump postcss from 8.3.7 to 8.3.8 ([#901](https://github.com/ntucker/anansi/issues/901)) ([8d62808](https://github.com/ntucker/anansi/commit/8d628082888e32038530f21115a8951ec17890cd))
* bump postcss from 8.3.8 to 8.3.9 ([#935](https://github.com/ntucker/anansi/issues/935)) ([3d4eae9](https://github.com/ntucker/anansi/commit/3d4eae909b5a6aa9ddf6a7972dabb38b4969869b))
* bump postcss-loader from 6.1.1 to 6.2.0 ([#984](https://github.com/ntucker/anansi/issues/984)) ([5b28bb5](https://github.com/ntucker/anansi/commit/5b28bb529fdce208d1d39f270ff87686d01c636a))
* bump sass-loader from 12.1.0 to 12.2.0 ([#980](https://github.com/ntucker/anansi/issues/980)) ([130de56](https://github.com/ntucker/anansi/commit/130de56f2ed8af127452864e7ff9b2f213e2d25d))
* bump svgo from 2.6.1 to 2.7.0 ([#897](https://github.com/ntucker/anansi/issues/897)) ([ddad4ef](https://github.com/ntucker/anansi/commit/ddad4ef3f17e7f880c6445b997c484a417aac465))
* bump webpack-bundle-analyzer from 4.4.2 to 4.5.0 ([#977](https://github.com/ntucker/anansi/issues/977)) ([b795b66](https://github.com/ntucker/anansi/commit/b795b66a7f42e2804f9fa56de758b752db9c53fc))



## [9.1.0](https://github.com/ntucker/anansi/compare/@anansi/webpack-config@9.0.7...@anansi/webpack-config@9.1.0) (2021-09-17)


### 🚀 Features

* Add WEBPACK_NO_CACHE env & vary cache for storybook ([8d69ede](https://github.com/ntucker/anansi/commit/8d69ede556ef9e382cb1a69a1ee6da57febd1354))


### 💅 Enhancement

* Don't compile linaria-cache ([1d578f5](https://github.com/ntucker/anansi/commit/1d578f5556a1427f64c5797ed134ffb99b344123))
* Show errors for children modules ([26a43f1](https://github.com/ntucker/anansi/commit/26a43f1fc48b34c811515cd4cd531182761ea108))
* Use 'oneOf' for loader rules ([bcd7f2d](https://github.com/ntucker/anansi/commit/bcd7f2d60852a658cfd9f4845d067cb218c8c3ac))
* Vary cache by hot reload env ([71f98d9](https://github.com/ntucker/anansi/commit/71f98d96e048b7198a1e1e2d1c1e79acfff7a366))


### 📦 Package

* bump @pmmmwh/react-refresh-webpack-plugin from 0.5.0 to 0.5.1 ([#874](https://github.com/ntucker/anansi/issues/874)) ([68e3e5d](https://github.com/ntucker/anansi/commit/68e3e5dd3093c1a35e291a9b3d89e6ea7c19e5df))
* bump svgo from 2.6.0 to 2.6.1 ([#875](https://github.com/ntucker/anansi/issues/875)) ([2b13cc7](https://github.com/ntucker/anansi/commit/2b13cc7a6e16a8672295ce281be3d9e849518bf8))



### [9.0.7](https://github.com/ntucker/anansi/compare/@anansi/webpack-config@9.0.6...@anansi/webpack-config@9.0.7) (2021-09-15)


### 📦 Package

* @pmmmwh/react-refresh-webpack-plugin 0.5.0 final ([379854c](https://github.com/ntucker/anansi/commit/379854cc360250b7138b2a328e724ee7ed9421d7))
* bump @linaria/webpack-loader from 3.0.0-beta.12 to 3.0.0-beta.13 ([#866](https://github.com/ntucker/anansi/issues/866)) ([9293c7d](https://github.com/ntucker/anansi/commit/9293c7da88c68cf2cf4836b8390778754643c524))
* bump svgo from 2.5.0 to 2.6.0 ([#862](https://github.com/ntucker/anansi/issues/862)) ([2f296f7](https://github.com/ntucker/anansi/commit/2f296f74197809e57c0cec1457cc06a0b47f5361))



### [9.0.6](https://github.com/ntucker/anansi/compare/@anansi/webpack-config@9.0.5...@anansi/webpack-config@9.0.6) (2021-09-11)


### 📦 Package

* bump @babel/runtime from 7.15.3 to 7.15.4 ([#827](https://github.com/ntucker/anansi/issues/827)) ([2ab26b4](https://github.com/ntucker/anansi/commit/2ab26b40eef66b8c9a0c673ff4c0f9703a96a793))
* bump autoprefixer from 10.3.3 to 10.3.4 ([#828](https://github.com/ntucker/anansi/issues/828)) ([c5e4fb4](https://github.com/ntucker/anansi/commit/c5e4fb4eff299c64d9bcebfbf642eee5c16a8f1a))
* bump core-js from 3.17.2 to 3.17.3 ([#850](https://github.com/ntucker/anansi/issues/850)) ([e629c60](https://github.com/ntucker/anansi/commit/e629c6065600283574f16eb26bcdb25aea140dff))
* mini-css-extract-plugin 2.3 ([9cb2808](https://github.com/ntucker/anansi/commit/9cb28088c4392f546b0a2a70aded3a5c4c74417e))



### [9.0.5](https://github.com/ntucker/anansi/compare/@anansi/webpack-config@9.0.4...@anansi/webpack-config@9.0.5) (2021-09-03)


### 📦 Package

* bump core-js from 3.17.1 to 3.17.2 ([#815](https://github.com/ntucker/anansi/issues/815)) ([3d2caa4](https://github.com/ntucker/anansi/commit/3d2caa407bdd707ff932f02312cf858ca623a78d))
* bump terser-webpack-plugin from 5.2.1 to 5.2.2 ([#811](https://github.com/ntucker/anansi/issues/811)) ([582bf01](https://github.com/ntucker/anansi/commit/582bf01d1c378a22564116edfe3abbdb03cfe6b4))



### [9.0.4](https://github.com/ntucker/anansi/compare/@anansi/webpack-config@9.0.3...@anansi/webpack-config@9.0.4) (2021-09-02)


### 💅 Enhancement

* Adding webpack HMR is redundant with current cli ([41b858d](https://github.com/ntucker/anansi/commit/41b858d0058ba940a727382087058765c5624930))


### 📦 Package

* bump clean-webpack-plugin from 4.0.0-alpha.0 to 4.0.0 ([#807](https://github.com/ntucker/anansi/issues/807)) ([2e8cfbd](https://github.com/ntucker/anansi/commit/2e8cfbd61f9b8278d4c9f58347a8d7f6ff077b6a))
* bump core-js from 3.16.4 to 3.17.1 ([#808](https://github.com/ntucker/anansi/issues/808)) ([bad6b91](https://github.com/ntucker/anansi/commit/bad6b9105f043d30b93e25526613a471a981d70e))
* bump mini-css-extract-plugin from 2.2.1 to 2.2.2 ([#806](https://github.com/ntucker/anansi/issues/806)) ([ae60a57](https://github.com/ntucker/anansi/commit/ae60a57e8c76b695f0777585aae4899e873ff581))
* terser-webpack, webpack patch ([6d2f900](https://github.com/ntucker/anansi/commit/6d2f900a8a58dec17f2fc1b8552fb1cc1882559f))



### [9.0.3](https://github.com/ntucker/anansi/compare/@anansi/webpack-config@9.0.2...@anansi/webpack-config@9.0.3) (2021-09-01)


### 📦 Package

* bump @linaria/webpack-loader from 3.0.0-beta.7 to 3.0.0-beta.12 ([#804](https://github.com/ntucker/anansi/issues/804)) ([fd05cc8](https://github.com/ntucker/anansi/commit/fd05cc8e9104a1d9efad22e3cb505c31343c933b))
* bump core-js from 3.16.3 to 3.16.4 ([#797](https://github.com/ntucker/anansi/issues/797)) ([7b93bfb](https://github.com/ntucker/anansi/commit/7b93bfb1eb589116f1733189023adf396f1dd433))
* bump mini-css-extract-plugin from 2.2.0 to 2.2.1 ([#802](https://github.com/ntucker/anansi/issues/802)) ([d4b79b2](https://github.com/ntucker/anansi/commit/d4b79b20300e4f51eec6bafc06e08f4ad59832ad))
* bump svgo from 2.4.0 to 2.5.0 ([#795](https://github.com/ntucker/anansi/issues/795)) ([adbb8a4](https://github.com/ntucker/anansi/commit/adbb8a4f41da95d6653ee23c0ce19d7f650ecb76))



### [9.0.2](https://github.com/ntucker/anansi/compare/@anansi/webpack-config@9.0.1...@anansi/webpack-config@9.0.2) (2021-08-31)


### 📦 Package

* @pmmmwh/react-refresh-webpack-plugin ([2fb8ac1](https://github.com/ntucker/anansi/commit/2fb8ac1e0ef7b62ba31acc222fe7b9d485fb46ae))
* bump autoprefixer from 10.3.2 to 10.3.3 ([#784](https://github.com/ntucker/anansi/issues/784)) ([b2f5a57](https://github.com/ntucker/anansi/commit/b2f5a57130e0966b2096c20916de422b111cb73a))
* bump core-js from 3.16.2 to 3.16.3 ([#776](https://github.com/ntucker/anansi/issues/776)) ([0acf43a](https://github.com/ntucker/anansi/commit/0acf43a582fafd22024b04687433c257729101f5))



### [9.0.1](https://github.com/ntucker/anansi/compare/@anansi/webpack-config@9.0.0...@anansi/webpack-config@9.0.1) (2021-08-24)


### 🐛 Bug Fix

* build-storybook no longer deletes storybook manager ui ([c8b633c](https://github.com/ntucker/anansi/commit/c8b633c0d9cecade53e2f4ea34dddea2a8a7c493))


### 📦 Package

* bump @pmmmwh/react-refresh-webpack-plugin ([#763](https://github.com/ntucker/anansi/issues/763)) ([e12b751](https://github.com/ntucker/anansi/commit/e12b7511b24442c2371c794a9b58247978dfcae6))
* bump autoprefixer from 10.3.1 to 10.3.2 ([#764](https://github.com/ntucker/anansi/issues/764)) ([258705e](https://github.com/ntucker/anansi/commit/258705edee3c15d82d5ce38f2eb8ba24d4601ead))



## [9.0.0](https://github.com/ntucker/anansi/compare/@anansi/webpack-config@8.0.4...@anansi/webpack-config@9.0.0) (2021-08-21)


### ⚠ 💥 BREAKING CHANGES

* Requires webpack-dev-server >=4

Bumps [webpack-dev-server](https://github.com/webpack/webpack-dev-server) from 3.11.2 to 4.0.0.
- [Release notes](https://github.com/webpack/webpack-dev-server/releases)
- [Changelog](https://github.com/webpack/webpack-dev-server/blob/master/CHANGELOG.md)
- [Commits](https://github.com/webpack/webpack-dev-server/compare/v3.11.2...v4.0.0)

### 📦 Package

* bump @pmmmwh/react-refresh-webpack-plugin ([#753](https://github.com/ntucker/anansi/issues/753)) ([2a73cb5](https://github.com/ntucker/anansi/commit/2a73cb5b954add6160dbada05fcd056fe64bf06c))
* bump core-js from 3.16.1 to 3.16.2 ([#749](https://github.com/ntucker/anansi/issues/749)) ([572e776](https://github.com/ntucker/anansi/commit/572e77642408f2aaf761f89117dc4a162360c5ae))
* bump webpack-dev-server from 3.11.2 to 4.0.0 ([#754](https://github.com/ntucker/anansi/issues/754)) ([7f68b5d](https://github.com/ntucker/anansi/commit/7f68b5dc8466b04c5c3f13a1f32dd2660e09546c))



### [8.0.4](https://github.com/ntucker/anansi/compare/@anansi/webpack-config@8.0.3...@anansi/webpack-config@8.0.4) (2021-08-16)


### 📦 Package

* bump @babel/runtime from 7.14.8 to 7.15.3 ([#729](https://github.com/ntucker/anansi/issues/729)) ([2ef12ee](https://github.com/ntucker/anansi/commit/2ef12eeef998bf4ff68b07f9c25035c26ac9acf7))
* bump @pmmmwh/react-refresh-webpack-plugin ([#731](https://github.com/ntucker/anansi/issues/731)) ([804e7b9](https://github.com/ntucker/anansi/commit/804e7b9c77491f0ed08c3c35b7679009b7787802))
* bump core-js from 3.16.0 to 3.16.1 ([#714](https://github.com/ntucker/anansi/issues/714)) ([74b5df0](https://github.com/ntucker/anansi/commit/74b5df0947ba4756972c62db86d6b2ce2dbaf8ec))
* bump svgo from 2.3.1 to 2.4.0 ([#742](https://github.com/ntucker/anansi/issues/742)) ([e7176f8](https://github.com/ntucker/anansi/commit/e7176f884c37aeb406438a63c8b0f7aad6e7617a))



### [8.0.3](https://github.com/ntucker/anansi/compare/@anansi/webpack-config@8.0.2...@anansi/webpack-config@8.0.3) (2021-08-05)


### 📦 Package

* bump core-js from 3.15.2 to 3.16.0 ([#683](https://github.com/ntucker/anansi/issues/683)) ([974f93f](https://github.com/ntucker/anansi/commit/974f93f0169ad194d244da3b0e34fb510d676595))
* bump domain-browser from 4.21.0 to 4.22.0 ([#680](https://github.com/ntucker/anansi/issues/680)) ([4b7c05b](https://github.com/ntucker/anansi/commit/4b7c05bd697ee34f1fe05a9873ede3fe3c7a4f18))
* bump mini-css-extract-plugin from 2.1.0 to 2.2.0 ([#705](https://github.com/ntucker/anansi/issues/705)) ([a71b201](https://github.com/ntucker/anansi/commit/a71b201226f4e164ff535d32aca4b7c2b960cf66))
* rollup, @types/node, domain-browser ([#676](https://github.com/ntucker/anansi/issues/676)) ([46325f2](https://github.com/ntucker/anansi/commit/46325f2b91405378da0b2f259456b37e80b51436))
* sass-resources-loader ([ee5fb74](https://github.com/ntucker/anansi/commit/ee5fb74ede993ac7bec3217797aedddcb810980b))



### [8.0.2](https://github.com/ntucker/anansi/compare/@anansi/webpack-config@8.0.1...@anansi/webpack-config@8.0.2) (2021-07-28)


### 🐛 Bug Fix

* Don't crash if terserOptions is not specified ([d86d2a6](https://github.com/ntucker/anansi/commit/d86d2a6bc0967fc98b138e353f80c31c8633aa16))



### [8.0.1](https://github.com/ntucker/anansi/compare/@anansi/webpack-config@8.0.0...@anansi/webpack-config@8.0.1) (2021-07-28)


### 🐛 Bug Fix

* Allow keep_classnames, keep_fnames overrides ([9ff303f](https://github.com/ntucker/anansi/commit/9ff303f259c0f5560cd7cb6753719042fb154427))


### 📦 Package

* @types/node, domain-browser, mem-fs-editor ([#672](https://github.com/ntucker/anansi/issues/672)) ([fcf453a](https://github.com/ntucker/anansi/commit/fcf453af038180e5f899dda9f79a0ce217b1823a))
* rollup, postcss, ts-jest ([#642](https://github.com/ntucker/anansi/issues/642)) ([35937e1](https://github.com/ntucker/anansi/commit/35937e127ebbe8c40a18e4391deb2d147157a67c))



## [8.0.0](https://github.com/ntucker/anansi/compare/@anansi/webpack-config@7.4.6...@anansi/webpack-config@8.0.0) (2021-07-20)


### ⚠ 💥 BREAKING CHANGES

* cssModuleOptions should conform to https://github.com/webpack-contrib/css-loader/releases/tag/v6.0.0

Bumps [css-loader](https://github.com/webpack-contrib/css-loader) from 5.2.7 to 6.0.0.
- [Release notes](https://github.com/webpack-contrib/css-loader/releases)
- [Changelog](https://github.com/webpack-contrib/css-loader/blob/master/CHANGELOG.md)
- [Commits](https://github.com/webpack-contrib/css-loader/compare/v5.2.7...v6.0.0)

### 📦 Package

* babel patch upgrades ([#637](https://github.com/ntucker/anansi/issues/637)) ([49a9c1a](https://github.com/ntucker/anansi/commit/49a9c1abf724c3d0733f15f15d39fbad8d97be0a))
* bump css-loader from 5.2.7 to 6.0.0 ([#620](https://github.com/ntucker/anansi/issues/620)) ([72b3057](https://github.com/ntucker/anansi/commit/72b305767e8b978c2a69869821c6dec95dc10e59))
* bump css-loader from 6.0.0 to 6.2.0 ([#636](https://github.com/ntucker/anansi/issues/636)) ([c6dd9ee](https://github.com/ntucker/anansi/commit/c6dd9ee32dde8386c6773de72705144a8b261250))


### 📝 Documentation

* Add NO_HOT_RELOAD ([f74b897](https://github.com/ntucker/anansi/commit/f74b897de313573b37eb88ba002e0248217d13b1))



### [7.4.6](https://github.com/ntucker/anansi/compare/@anansi/webpack-config@7.4.5...@anansi/webpack-config@7.4.6) (2021-07-14)


### 📦 Package

* @pmmmwh/react-refresh-webpack-plugin patch ([dae01c2](https://github.com/ntucker/anansi/commit/dae01c20ce576ff9b49c8e415b7b9bc5a90926b4))
* bump autoprefixer from 10.3.0 to 10.3.1 ([#607](https://github.com/ntucker/anansi/issues/607)) ([4282136](https://github.com/ntucker/anansi/commit/428213659628354a322764d8d887aae5253f74cd))
* bump css-loader from 5.2.6 to 5.2.7 ([#612](https://github.com/ntucker/anansi/issues/612)) ([32f9327](https://github.com/ntucker/anansi/commit/32f9327bc8d97c9585a2b418fdee87a8ee8f4603))



### [7.4.5](https://github.com/ntucker/anansi/compare/@anansi/webpack-config@7.4.4...@anansi/webpack-config@7.4.5) (2021-07-12)


### 💅 Enhancement

* Env options accept true or  (string or bool) ([8aaabb8](https://github.com/ntucker/anansi/commit/8aaabb800ff00cfedde3b46a0ffe8cd32ee190e9))



### [7.4.4](https://github.com/ntucker/anansi/compare/@anansi/webpack-config@7.4.3...@anansi/webpack-config@7.4.4) (2021-07-11)


### 📦 Package

* autoprefixer, react-refresh-webpack-plugin minor ([e97aa97](https://github.com/ntucker/anansi/commit/e97aa97ea93a60c8923dc7d1fa95185a2f75b0b4))
* bump @types/webpack-bundle-analyzer from 4.4.0 to 4.4.1 ([#560](https://github.com/ntucker/anansi/issues/560)) ([3cdfc18](https://github.com/ntucker/anansi/commit/3cdfc1843f413cb70d8b03c1e74ce9fbe02a4a78))
* bump debug from 4.3.1 to 4.3.2 ([#569](https://github.com/ntucker/anansi/issues/569)) ([43edfb0](https://github.com/ntucker/anansi/commit/43edfb0221026b6deac0a3cb5ce68b2df3f5d9eb))
* bump mini-css-extract-plugin from 2.0.0 to 2.1.0 ([#567](https://github.com/ntucker/anansi/issues/567)) ([41de28e](https://github.com/ntucker/anansi/commit/41de28e5567dbd9057e0f42057e89c8f8601d678))
* bump postcss-loader from 6.1.0 to 6.1.1 ([#550](https://github.com/ntucker/anansi/issues/550)) ([c3b89a1](https://github.com/ntucker/anansi/commit/c3b89a1ff1bbd79ac221505bd64c7e77f98a83c5))



### [7.4.3](https://github.com/ntucker/anansi/compare/@anansi/webpack-config@7.4.2...@anansi/webpack-config@7.4.3) (2021-07-01)


### 📦 Package

* bump core-js from 3.15.1 to 3.15.2 ([#533](https://github.com/ntucker/anansi/issues/533)) ([4a6b4c8](https://github.com/ntucker/anansi/commit/4a6b4c8d9f69e05f10a2fc8f3433290a20b56b82))
* bump mini-css-extract-plugin from 1.6.2 to 2.0.0 ([#547](https://github.com/ntucker/anansi/issues/547)) ([c0125dd](https://github.com/ntucker/anansi/commit/c0125dddaaf67a19f3b97e23043f92cd4f7534da))



### [7.4.2](https://github.com/ntucker/anansi/compare/@anansi/webpack-config@7.4.1...@anansi/webpack-config@7.4.2) (2021-06-29)


### 📦 Package

* bump css-minimizer-webpack-plugin from 3.0.1 to 3.0.2 ([#524](https://github.com/ntucker/anansi/issues/524)) ([328f991](https://github.com/ntucker/anansi/commit/328f991d9e2c3fb03507a9a87a43d2c147d946f2))
* bump mini-css-extract-plugin from 1.6.0 to 1.6.2 ([#527](https://github.com/ntucker/anansi/issues/527)) ([ce71426](https://github.com/ntucker/anansi/commit/ce714263e967f4b1b7f7769161de9f26cb558d4d))
* bump svgo from 2.3.0 to 2.3.1 ([#532](https://github.com/ntucker/anansi/issues/532)) ([669471f](https://github.com/ntucker/anansi/commit/669471f9a196232e8bebf4320efd108b793cdeaa))
* bump terser-webpack-plugin from 5.1.3 to 5.1.4 ([#522](https://github.com/ntucker/anansi/issues/522)) ([961005a](https://github.com/ntucker/anansi/commit/961005a2f58756c2e20b7e1777b23f39cd748234))



### [7.4.1](https://github.com/ntucker/anansi/compare/@anansi/webpack-config@7.4.0...@anansi/webpack-config@7.4.1) (2021-06-25)


### 💅 Enhancement

* Improve babel detection ([#521](https://github.com/ntucker/anansi/issues/521)) ([eb59b70](https://github.com/ntucker/anansi/commit/eb59b700e5649f26da4c9bbd2672046f79d0f8a5))


### 📦 Package

* bump node-sass from 6.0.0 to 6.0.1 ([#519](https://github.com/ntucker/anansi/issues/519)) ([1c8b8ee](https://github.com/ntucker/anansi/commit/1c8b8eee6b889e9ec46e194a890711dabdbf4d96))
* Linaria ([1503c77](https://github.com/ntucker/anansi/commit/1503c7785b2752fe443463b666789a368df5d219))
* Storybook 6.3 ([#516](https://github.com/ntucker/anansi/issues/516)) ([162cefa](https://github.com/ntucker/anansi/commit/162cefa4b098784a1f68709576efa3f34a056d1b))



## [7.4.0](https://github.com/ntucker/anansi/compare/@anansi/webpack-config@7.3.0...@anansi/webpack-config@7.4.0) (2021-06-23)


### 🚀 Features

* Users can choose svgo and node-sass version by installing it themselves ([63344a1](https://github.com/ntucker/anansi/commit/63344a195eefbf472827dd661768f7cb5ede9b55))


### 📦 Package

* bump core-js from 3.14.0 to 3.15.0 ([#500](https://github.com/ntucker/anansi/issues/500)) ([d64f458](https://github.com/ntucker/anansi/commit/d64f458c446f4334a8c00e68c7eab3ac051e907c))
* bump core-js from 3.15.0 to 3.15.1 ([#508](https://github.com/ntucker/anansi/issues/508)) ([cd22706](https://github.com/ntucker/anansi/commit/cd227065ca4f9b0b5228e575b5fea97a6971a28a))
* bump html-webpack-plugin from 5.3.1 to 5.3.2 ([#503](https://github.com/ntucker/anansi/issues/503)) ([1e53f55](https://github.com/ntucker/anansi/commit/1e53f55da95c6e203732d4235803edf1a06d0604))
* bump sass-resources-loader from 2.2.2 to 2.2.3 ([#506](https://github.com/ntucker/anansi/issues/506)) ([f0b772a](https://github.com/ntucker/anansi/commit/f0b772a62d2fecb824092413df0a7d62a90ed3d8))



## [7.3.0](https://github.com/ntucker/anansi/compare/@anansi/webpack-config@7.2.2...@anansi/webpack-config@7.3.0) (2021-06-19)


### 🚀 Features

* Add terserOptions ([4feea82](https://github.com/ntucker/anansi/commit/4feea8263314e8a4fde6e9aeb0970b68a7f20c07))


### 📦 Package

* bump @babel/runtime from 7.14.5 to 7.14.6 ([#474](https://github.com/ntucker/anansi/issues/474)) ([52c95e0](https://github.com/ntucker/anansi/commit/52c95e0f00e3f252087f6d0a0684adfba556a38e))
* bump postcss from 8.3.2 to 8.3.4 ([#476](https://github.com/ntucker/anansi/issues/476)) ([31109ed](https://github.com/ntucker/anansi/commit/31109edc8115384ab0cda677b1c008e9c7fc072f))
* bump postcss from 8.3.4 to 8.3.5 ([#491](https://github.com/ntucker/anansi/issues/491)) ([67a6cc0](https://github.com/ntucker/anansi/commit/67a6cc0277052a35e74a971fcd799661bee91c2c))
* bump sass-resources-loader from 2.2.1 to 2.2.2 ([#489](https://github.com/ntucker/anansi/issues/489)) ([3ad3b4c](https://github.com/ntucker/anansi/commit/3ad3b4cc3ad6300db2ea3dee448d26cdf42f4892))



### [7.2.2](https://github.com/ntucker/anansi/compare/@anansi/webpack-config@7.2.1...@anansi/webpack-config@7.2.2) (2021-06-13)


### 🐛 Bug Fix

* svog added as dependency to ensure correct version imported ([4ff633e](https://github.com/ntucker/anansi/commit/4ff633ef78f2d7e81065b0bdcb4005c6203dce6a))



### [7.2.1](https://github.com/ntucker/anansi/compare/@anansi/webpack-config@7.2.0...@anansi/webpack-config@7.2.1) (2021-06-11)


### 📦 Package

* bump @babel/runtime from 7.14.0 to 7.14.5 ([#459](https://github.com/ntucker/anansi/issues/459)) ([7b2d6c5](https://github.com/ntucker/anansi/commit/7b2d6c5c7a60ea8349540f0f92f467b190576672))
* bump sass-loader from 12.0.0 to 12.1.0 ([#463](https://github.com/ntucker/anansi/issues/463)) ([562b15c](https://github.com/ntucker/anansi/commit/562b15c3bc42918f6cd4852bb04864964ea6cf29))
* postcss, postcss-loader, @babel/eslint-parser ([925bff7](https://github.com/ntucker/anansi/commit/925bff78022744a0d9e01bff6dbafc286d8afb2a))



## [7.2.0](https://github.com/ntucker/anansi/compare/@anansi/webpack-config@7.1.8...@anansi/webpack-config@7.2.0) (2021-06-10)


### 🚀 Features

* Support react 18 ([#449](https://github.com/ntucker/anansi/issues/449)) ([14ec576](https://github.com/ntucker/anansi/commit/14ec57633b76b5c5ed45dff0a716e83fe0fe49dc))



### [7.1.8](https://github.com/ntucker/anansi/compare/@anansi/webpack-config@7.1.7...@anansi/webpack-config@7.1.8) (2021-06-09)


### 🐛 Bug Fix

* Proper defaults for svgr's svgo integration ([4e3e9eb](https://github.com/ntucker/anansi/commit/4e3e9ebd8a0564c6e902ce1c9dca413e6314e3a8))


### 📦 Package

* bump @linaria/webpack-loader from 3.0.0-beta.4 to 3.0.0-beta.6 ([#441](https://github.com/ntucker/anansi/issues/441)) ([f7b7fb0](https://github.com/ntucker/anansi/commit/f7b7fb0eb4595411709743d5a8f531248a934d0b))
* bump @pmmmwh/react-refresh-webpack-plugin ([#429](https://github.com/ntucker/anansi/issues/429)) ([8022b8e](https://github.com/ntucker/anansi/commit/8022b8e1fc920e8ec7b08eb5a10ad78bbf7311b3))
* bump core-js from 3.13.1 to 3.14.0 ([#435](https://github.com/ntucker/anansi/issues/435)) ([88358a3](https://github.com/ntucker/anansi/commit/88358a3dc9208ae93842def510e9a6b8effe921d))



### [7.1.7](https://github.com/ntucker/anansi/compare/@anansi/webpack-config@7.1.6...@anansi/webpack-config@7.1.7) (2021-06-04)


### 🐛 Bug Fix

* SVGR triggers svgo for more context ([#423](https://github.com/ntucker/anansi/issues/423)) ([f18daa3](https://github.com/ntucker/anansi/commit/f18daa38e2e53bd34b7a050772bfd8e6425797e7))



### [7.1.6](https://github.com/ntucker/anansi/compare/@anansi/webpack-config@7.1.5...@anansi/webpack-config@7.1.6) (2021-06-02)


### 📦 Package

* bump sass-loader from 11.1.1 to 12.0.0 ([#415](https://github.com/ntucker/anansi/issues/415)) ([5942114](https://github.com/ntucker/anansi/commit/59421147b92e95a17f7258cd4fc9cc220ae2c061))



### [7.1.5](https://github.com/ntucker/anansi/compare/@anansi/webpack-config@7.1.4...@anansi/webpack-config@7.1.5) (2021-06-02)


### 💅 Enhancement

* Improve compatibility with node packages ([57d457a](https://github.com/ntucker/anansi/commit/57d457a4fdd4dfef9c5410a45bde9c7ac26dd43c))


### 📦 Package

* bump @pmmmwh/react-refresh-webpack-plugin ([#412](https://github.com/ntucker/anansi/issues/412)) ([1ac8350](https://github.com/ntucker/anansi/commit/1ac8350b9487a9b4828790857f9389e24b500add))
* bump css-minimizer-webpack-plugin from 3.0.0 to 3.0.1 ([#402](https://github.com/ntucker/anansi/issues/402)) ([2d9acd3](https://github.com/ntucker/anansi/commit/2d9acd3e02b493e32b2a64ff06308bb734bc8c74))
* bump terser-webpack-plugin from 5.1.2 to 5.1.3 ([#401](https://github.com/ntucker/anansi/issues/401)) ([c1af1ca](https://github.com/ntucker/anansi/commit/c1af1caa55712a58cbd2aedbbf78cd233a8e81b7))



### [7.1.4](https://github.com/ntucker/anansi/compare/@anansi/webpack-config@7.1.3...@anansi/webpack-config@7.1.4) (2021-05-29)


### 💅 Enhancement

* Detect core-js version to support max proposals ([bf1341b](https://github.com/ntucker/anansi/commit/bf1341b748a6d75680da50a24cee1ed1981a7059))



### [7.1.3](https://github.com/ntucker/anansi/compare/@anansi/webpack-config@7.1.2...@anansi/webpack-config@7.1.3) (2021-05-29)


### 💅 Enhancement

* Improve error handler for compile errors ([96e5ddf](https://github.com/ntucker/anansi/commit/96e5ddf4d85b12f92af1427d09cd7e46afb4c538))



### [7.1.2](https://github.com/ntucker/anansi/compare/@anansi/webpack-config@7.1.1...@anansi/webpack-config@7.1.2) (2021-05-29)

**Note:** Version bump only for package @anansi/webpack-config





### [7.1.1](https://github.com/ntucker/anansi/compare/@anansi/webpack-config@7.1.0...@anansi/webpack-config@7.1.1) (2021-05-29)


### 💅 Enhancement

* Disable InlineChunks until nonce is added ([1014c91](https://github.com/ntucker/anansi/commit/1014c910bbf719d414daa9d0f52ffc061fe27726))


### 📦 Package

* @pmmmwh/react-refresh-webpack-plugin 0.5 ([6d38090](https://github.com/ntucker/anansi/commit/6d38090a3b7b47ebf20261e7a05685d08739fee0))



## [7.1.0](https://github.com/ntucker/anansi/compare/@anansi/webpack-config@7.0.5...@anansi/webpack-config@7.1.0) (2021-05-28)


### 🚀 Features

* Add better error overlay ([#392](https://github.com/ntucker/anansi/issues/392)) ([b1a383c](https://github.com/ntucker/anansi/commit/b1a383c1bdac657721470db4742a3db9ce89cfb6))
* NO_HOT_RELOAD to disable hotreloading ([7285017](https://github.com/ntucker/anansi/commit/728501730928918ab3783fd90d66b0774933cc86))


### 💅 Enhancement

* Don't hotreload workers ([50f0966](https://github.com/ntucker/anansi/commit/50f0966e13e1b4af6dec958ce53ec9798001835b))



### [7.0.5](https://github.com/ntucker/anansi/compare/@anansi/webpack-config@7.0.4...@anansi/webpack-config@7.0.5) (2021-05-28)


### 🐛 Bug Fix

* Don't override mode behavior with NODE_ENV ([25f0429](https://github.com/ntucker/anansi/commit/25f0429d91fe7d27bb3cea7a504a4290313e8a74))
* Only disable svgr's svgo in prod when we use our own svgo ([3fc3403](https://github.com/ntucker/anansi/commit/3fc3403a7eb8f38cc68a9cf5579b04c8616f2663))


### 📦 Package

* util patch ([9b9972d](https://github.com/ntucker/anansi/commit/9b9972d26367c6e1e5c9fcbbca33690a1eb49f04))



### [7.0.4](https://github.com/ntucker/anansi/compare/@anansi/webpack-config@7.0.3...@anansi/webpack-config@7.0.4) (2021-05-28)


### 💅 Enhancement

* Add prefixIds svgo plugin ([9887237](https://github.com/ntucker/anansi/commit/988723779c5cf5d45a2a3b0230c5a708806080af))
* Only override NODE_ENV if not already set ([8dafb0b](https://github.com/ntucker/anansi/commit/8dafb0b1388405f02ab45ced605c8c0cc9017e70))
* Use EnvironmentPlugin instead of DefinePlugin ([c24b48a](https://github.com/ntucker/anansi/commit/c24b48afaea83129e5aba6aabb6b6b4e79f0b44a))



### [7.0.3](https://github.com/ntucker/anansi/compare/@anansi/webpack-config@7.0.2...@anansi/webpack-config@7.0.3) (2021-05-28)


### 💅 Enhancement

* css classes don't have hash when testing ([e4b2eec](https://github.com/ntucker/anansi/commit/e4b2eeca7933db659a05cfd426334abdd4c981c9))
* Run svgo in testing to add ids ([2437df7](https://github.com/ntucker/anansi/commit/2437df72ab592600befa04521b5dbb22e0e965ec))


### 📦 Package

* bump autoprefixer from 10.2.5 to 10.2.6 ([#386](https://github.com/ntucker/anansi/issues/386)) ([c315dbb](https://github.com/ntucker/anansi/commit/c315dbbceaf4e6ba45d8da4c8b6c4f030c276ac8))



### [7.0.2](https://github.com/ntucker/anansi/compare/@anansi/webpack-config@7.0.1...@anansi/webpack-config@7.0.2) (2021-05-26)


### 📦 Package

* bump core-js from 3.12.1 to 3.13.0 ([#376](https://github.com/ntucker/anansi/issues/376)) ([c6da6f5](https://github.com/ntucker/anansi/commit/c6da6f50f03ccb4f71cf4d67501f09bc6a541512))



### [7.0.1](https://github.com/ntucker/anansi/compare/@anansi/webpack-config@7.0.0...@anansi/webpack-config@7.0.1) (2021-05-25)


### 📦 Package

* Remove react-dev-utils ([#373](https://github.com/ntucker/anansi/issues/373)) ([5ad50d0](https://github.com/ntucker/anansi/commit/5ad50d0ad25ffa8446c6692b3772e4c7bdd823e9))



## [7.0.0](https://github.com/ntucker/anansi/compare/@anansi/webpack-config@6.8.4...@anansi/webpack-config@7.0.0) (2021-05-22)


### ⚠ 💥 BREAKING CHANGES

* Min node version 12

### 💅 Enhancement

* Enforce node version used in updated packages ([315c93d](https://github.com/ntucker/anansi/commit/315c93de95a6cf1969ac4486f16acd52b41756b6))


### 📦 Package

* clean-webpack-plugin - webpack5 compat ([1ee36e5](https://github.com/ntucker/anansi/commit/1ee36e5d4308f99f9af5c7c516a1f222c2b8d9db))


### 📝 Documentation

* Reorder advanced config ([355cefa](https://github.com/ntucker/anansi/commit/355cefa6f5f50021e2ab67cc1439fe9b1947f561))



### [6.8.4](https://github.com/ntucker/anansi/compare/@anansi/webpack-config@6.8.3...@anansi/webpack-config@6.8.4) (2021-05-22)


### 💅 Enhancement

* Get rid of webpack 5 deprecation problem ([2f84d7b](https://github.com/ntucker/anansi/commit/2f84d7b87ecc1cdd75aefb5530fdb30fcfbcad33))


### 📦 Package

* bump postcss from 8.2.15 to 8.3.0 ([#362](https://github.com/ntucker/anansi/issues/362)) ([6f6667f](https://github.com/ntucker/anansi/commit/6f6667ff1e76fe450671a92b8ab5cd430113875a))



### [6.8.3](https://github.com/ntucker/anansi/compare/@anansi/webpack-config@6.8.2...@anansi/webpack-config@6.8.3) (2021-05-22)


### 📦 Package

* bump css-loader from 5.2.4 to 5.2.5 ([#361](https://github.com/ntucker/anansi/issues/361)) ([b395ec9](https://github.com/ntucker/anansi/commit/b395ec9334f6364876a5340163b3cafbeee330c7))



### [6.8.2](https://github.com/ntucker/anansi/compare/@anansi/webpack-config@6.8.1...@anansi/webpack-config@6.8.2) (2021-05-18)


### 📦 Package

* bump webpack-bundle-analyzer from 4.4.1 to 4.4.2 ([#346](https://github.com/ntucker/anansi/issues/346)) ([b3270c5](https://github.com/ntucker/anansi/commit/b3270c55f53f72388cd03c6937b36c3868ff4cc0))



### [6.8.1](https://github.com/ntucker/anansi/compare/@anansi/webpack-config@6.8.0...@anansi/webpack-config@6.8.1) (2021-05-15)


### 📦 Package

* bump postcss-loader from 5.2.0 to 5.3.0 ([#339](https://github.com/ntucker/anansi/issues/339)) ([208d322](https://github.com/ntucker/anansi/commit/208d322e64576e2fde4f4d9873a1fbaa20cf94c7))


### 📝 Documentation

* Fix ordering of storybook instructions ([25809ca](https://github.com/ntucker/anansi/commit/25809ca78dd50074ea79dbfa3227584d367631c3))



## [6.8.0](https://github.com/ntucker/anansi/compare/@anansi/webpack-config@6.7.7...@anansi/webpack-config@6.8.0) (2021-05-14)


### 🚀 Features

* Add @anansi/jest-preset ([#337](https://github.com/ntucker/anansi/issues/337)) ([a836ec5](https://github.com/ntucker/anansi/commit/a836ec583b61d0afe764a35de88994517d9ff444))


### 📦 Package

* bump css-minimizer-webpack-plugin from 2.0.0 to 3.0.0 ([#326](https://github.com/ntucker/anansi/issues/326)) ([1c787eb](https://github.com/ntucker/anansi/commit/1c787eb0c578572de25130166710d96cee395a37))
* bump sass-loader from 11.1.0 to 11.1.1 ([#335](https://github.com/ntucker/anansi/issues/335)) ([0412c71](https://github.com/ntucker/anansi/commit/0412c7117fe4dc3b7d8e4aedaa568b4ebb9d275d))



### [6.7.7](https://github.com/ntucker/anansi/compare/@anansi/webpack-config@6.7.6...@anansi/webpack-config@6.7.7) (2021-05-12)

**Note:** Version bump only for package @anansi/webpack-config





### [6.7.6](https://github.com/ntucker/anansi/compare/@anansi/webpack-config@6.7.5...@anansi/webpack-config@6.7.6) (2021-05-11)


### 💅 Enhancement

* Watch ignore map files ([1e0346a](https://github.com/ntucker/anansi/commit/1e0346ad97b9d2c7ada3c2659418c3641ebc562a))


### 🐛 Bug Fix

* Infinite loop storybook devmode ([50dc295](https://github.com/ntucker/anansi/commit/50dc295f2c350f90b7ce4ba9eb7481b6d5ec7cf7))
* Storybook build infinite loop ([16d3cf5](https://github.com/ntucker/anansi/commit/16d3cf506641d8a5b65215a0c1c834111ee5a177))


### 📦 Package

* bump core-js from 3.12.0 to 3.12.1 ([#312](https://github.com/ntucker/anansi/issues/312)) ([e8172f2](https://github.com/ntucker/anansi/commit/e8172f2e092dd8b2be1d816461b89b7b3b3c099a))
* bump node-sass from 5.0.0 to 6.0.0 ([#316](https://github.com/ntucker/anansi/issues/316)) ([5f18626](https://github.com/ntucker/anansi/commit/5f186261b81b0a117d2436e3b40d5a4876e3531a))
* bump prettier from 2.2.1 to 2.3.0 ([#314](https://github.com/ntucker/anansi/issues/314)) ([431d113](https://github.com/ntucker/anansi/commit/431d113fca3318b21970447819ccb0bb1cc61121))
* postcss, thread-loader ([463cac6](https://github.com/ntucker/anansi/commit/463cac61da7173739136f35dd99699aaf6e93eb8))
* sass-loader 11.1 ([f299276](https://github.com/ntucker/anansi/commit/f29927653c5db371069fe04c615a1751ac5d61d7))



### [6.7.5](https://github.com/ntucker/anansi/compare/@anansi/webpack-config@6.7.4...@anansi/webpack-config@6.7.5) (2021-05-07)


### 🐛 Bug Fix

* Need polyfills that are included by babel ([471d4ad](https://github.com/ntucker/anansi/commit/471d4ada97f652df5ce5f7886dafd8fedb4b901a))



### [6.7.4](https://github.com/ntucker/anansi/compare/@anansi/webpack-config@6.7.3...@anansi/webpack-config@6.7.4) (2021-05-07)


### 📦 Package

* Bump linaria ([e94a42f](https://github.com/ntucker/anansi/commit/e94a42f981db01ea7a1c06399b3d38d22371707b))
* bump postcss from 8.2.13 to 8.2.14 ([#305](https://github.com/ntucker/anansi/issues/305)) ([bdbd239](https://github.com/ntucker/anansi/commit/bdbd239b897a2a36b01d2c97b09e7150f2150e19))



### [6.7.3](https://github.com/ntucker/anansi/compare/@anansi/webpack-config@6.7.2...@anansi/webpack-config@6.7.3) (2021-05-05)


### 🐛 Bug Fix

* peerDeps ([da1a5a5](https://github.com/ntucker/anansi/commit/da1a5a50c8fbc0f578c3d01b36d89f79cebee3c3))



### [6.7.2](https://github.com/ntucker/anansi/compare/@anansi/webpack-config@6.7.1...@anansi/webpack-config@6.7.2) (2021-05-05)

**Note:** Version bump only for package @anansi/webpack-config





### [6.7.1](https://github.com/ntucker/anansi/compare/@anansi/webpack-config@6.7.0...@anansi/webpack-config@6.7.1) (2021-05-03)

**Note:** Version bump only for package @anansi/webpack-config





## [6.7.0](https://github.com/ntucker/anansi/compare/@anansi/webpack-config@6.6.0...@anansi/webpack-config@6.7.0) (2021-05-03)


### 🚀 Features

* Leaving opening browser up to context of user ([3acbef3](https://github.com/ntucker/anansi/commit/3acbef36776091695d1a483e0bb270d2a10d02ab))



## [6.6.0](https://github.com/ntucker/anansi/compare/@anansi/webpack-config@6.5.6...@anansi/webpack-config@6.6.0) (2021-05-03)


### 🚀 Features

* Add types ([b7968c4](https://github.com/ntucker/anansi/commit/b7968c4e54099dc3c7510a6930b7ab0536bc8130))


### 💅 Enhancement

* peerDep to full release ([6353809](https://github.com/ntucker/anansi/commit/6353809110ecb8f7f2d2413d533289fc7ed51cec))



### [6.5.6](https://github.com/ntucker/anansi/compare/@anansi/webpack-config@6.5.5...@anansi/webpack-config@6.5.6) (2021-05-01)


### 🐛 Bug Fix

* dev-middleware must be v3 for now ([55e030d](https://github.com/ntucker/anansi/commit/55e030dd54622ee0ef17ee16c62c6facea7a5f4e))


### 📝 Documentation

* Add package resolutions to storybook directions ([47bede5](https://github.com/ntucker/anansi/commit/47bede581e36f91d5433a4809aff94cbc86e360e))
* Improve wording ([a28f16e](https://github.com/ntucker/anansi/commit/a28f16edd40c4b95021ae01b637fcb7f9e413bd4))
* More webpack explanations ([abd4336](https://github.com/ntucker/anansi/commit/abd4336a105a10d707b0b21154871ee96724c52f))
* Update style instructions ([168207b](https://github.com/ntucker/anansi/commit/168207bf16b94d3b4a94cadec73ab10dfe5dcb26))



### [6.5.5](https://github.com/ntucker/anansi/compare/@anansi/webpack-config@6.5.4...@anansi/webpack-config@6.5.5) (2021-04-30)


### 🐛 Bug Fix

* Remove unused error overlay plugin as it is incompatible with webpack5 ([a3b6780](https://github.com/ntucker/anansi/commit/a3b67809baccd8f29863b51c53c9a308922d3003))



### [6.5.4](https://github.com/ntucker/anansi/compare/@anansi/webpack-config@6.5.3...@anansi/webpack-config@6.5.4) (2021-04-30)


### 📦 Package

* bump mini-css-extract-plugin from 1.5.1 to 1.6.0 ([#283](https://github.com/ntucker/anansi/issues/283)) ([c1ac1d1](https://github.com/ntucker/anansi/commit/c1ac1d178306600a33824907fbffef4b66a0a460))



### [6.5.3](https://github.com/ntucker/anansi/compare/@anansi/webpack-config@6.5.2...@anansi/webpack-config@6.5.3) (2021-04-29)


### 💅 Enhancement

* Support icss in global style dir ([37b747f](https://github.com/ntucker/anansi/commit/37b747ffbf841f2cdf7a95a0ed859551df38f200))
* Treat .module.scss found in global style folder as css modules ([9db8a7a](https://github.com/ntucker/anansi/commit/9db8a7a86728c639077e96e79746170f5d2a973d))



### [6.5.2](https://github.com/ntucker/anansi/compare/@anansi/webpack-config@6.5.1...@anansi/webpack-config@6.5.2) (2021-04-29)


### 🐛 Bug Fix

* Only add module resolve for globalStyleDir if it is defined ([c3ef706](https://github.com/ntucker/anansi/commit/c3ef70656f02522cce9335a73c7621572e202ba0))



### [6.5.1](https://github.com/ntucker/anansi/compare/@anansi/webpack-config@6.5.0...@anansi/webpack-config@6.5.1) (2021-04-29)


### 💅 Enhancement

* Don't do special publicPath for devmode ([f2c67b7](https://github.com/ntucker/anansi/commit/f2c67b714e855077bd5ed7e3e051164ee2398cca))


### 🐛 Bug Fix

* Avoid recursive watching by moving cache dir out of node_modules ([3e27040](https://github.com/ntucker/anansi/commit/3e270409082b75a622146babf263c96425ed06d8))
* Resolve globalStyleDir ([75e7e9c](https://github.com/ntucker/anansi/commit/75e7e9cd7973b3f081407d919021a400e5bbe863))


### 📦 Package

* bump mini-css-extract-plugin from 1.5.0 to 1.5.1 ([#276](https://github.com/ntucker/anansi/issues/276)) ([70401cb](https://github.com/ntucker/anansi/commit/70401cbf658954460c7c462188e72c98092bd102))



## [6.5.0](https://github.com/ntucker/anansi/compare/@anansi/webpack-config@6.4.1...@anansi/webpack-config@6.5.0) (2021-04-28)


### 🚀 Features

* Add globalStyleDir option ([#272](https://github.com/ntucker/anansi/issues/272)) ([5803312](https://github.com/ntucker/anansi/commit/5803312198bee6fa3e0a75c04dd01bec902dc430))


### 🐛 Bug Fix

* Typo in error message ([0042040](https://github.com/ntucker/anansi/commit/0042040f878491ce69138f56894860503e0ecf74))


### 📝 Documentation

* Document tsconfigPathOptions ([3ba837b](https://github.com/ntucker/anansi/commit/3ba837becaa28d47c30b69f1f8696ebce8f0597f))



### [6.4.1](https://github.com/ntucker/anansi/compare/@anansi/webpack-config@6.4.0...@anansi/webpack-config@6.4.1) (2021-04-27)


### 🐛 Bug Fix

* Include buffer pkg ([eafce6d](https://github.com/ntucker/anansi/commit/eafce6d902e1050572c55c84de32bd6e42c05c9e))



## [6.4.0](https://github.com/ntucker/anansi/compare/@anansi/webpack-config@6.3.5...@anansi/webpack-config@6.4.0) (2021-04-27)


### 🚀 Features

* Add svgrOptions to configure svgr ([d4a6564](https://github.com/ntucker/anansi/commit/d4a6564e0e44fb4ca55f11703ad51898a06c74e8))


### 💅 Enhancement

* Use postcss on [@import](https://github.com/import) from css ([ae40f98](https://github.com/ntucker/anansi/commit/ae40f989930cc5f2cee39b92a0a0231f58966266))


### 📦 Package

* bump postcss from 8.2.12 to 8.2.13 ([#262](https://github.com/ntucker/anansi/issues/262)) ([ae1e860](https://github.com/ntucker/anansi/commit/ae1e86005dda1c8061dd7e9494a92c3fe31ac7a1))



### [6.3.5](https://github.com/ntucker/anansi/compare/@anansi/webpack-config@6.3.4...@anansi/webpack-config@6.3.5) (2021-04-24)


### 📦 Package

* bump postcss from 8.2.10 to 8.2.12 ([#255](https://github.com/ntucker/anansi/issues/255)) ([9913554](https://github.com/ntucker/anansi/commit/9913554da7aa3f9e2f8c51cc2e955bcb0a008f0e))



### [6.3.4](https://github.com/ntucker/anansi/compare/@anansi/webpack-config@6.3.3...@anansi/webpack-config@6.3.4) (2021-04-22)


### 📦 Package

* linaria to beta 3 ([948e9ab](https://github.com/ntucker/anansi/commit/948e9ab20cc741f4526f9235e523ac506509486d))



### [6.3.3](https://github.com/ntucker/anansi/compare/@anansi/webpack-config@6.3.2...@anansi/webpack-config@6.3.3) (2021-04-21)


### 📦 Package

* css-loader, mini-css-extract-plugin ([f5058e2](https://github.com/ntucker/anansi/commit/f5058e27f5bea2668b9447fa0a2e3cb5858a19e5))
* webpack-node-externals major ([c072aba](https://github.com/ntucker/anansi/commit/c072aba9a60e2b52ec659281dfeb699b732f4f7b))



### [6.3.2](https://github.com/ntucker/anansi/compare/@anansi/webpack-config@6.3.1...@anansi/webpack-config@6.3.2) (2021-04-15)

**Note:** Version bump only for package @anansi/webpack-config





### [6.3.1](https://github.com/ntucker/anansi/compare/@anansi/webpack-config@6.3.0...@anansi/webpack-config@6.3.1) (2021-04-15)


### 💅 Enhancement

* Improve chunk naming during analyze and nohash ([df234a7](https://github.com/ntucker/anansi/commit/df234a7788b1ba59b87ba307c0539ea92a9fb2e0))
* Vary webpack cache on browserslist ([9912e5e](https://github.com/ntucker/anansi/commit/9912e5e244d7b6cf5ea8e78c2d33a038912e20ad))


### 📦 Package

* sass-resources-loader ([e79fe8b](https://github.com/ntucker/anansi/commit/e79fe8ba5723472c6e6a950c02b003fa2f93b6c9))


### 📝 Documentation

* Typos in readme ([7e0b4ca](https://github.com/ntucker/anansi/commit/7e0b4ca6ef2a3284a07fe7621175bc0d22660dee))



## [6.3.0](https://github.com/ntucker/anansi/compare/@anansi/webpack-config@6.2.12...@anansi/webpack-config@6.3.0) (2021-04-14)


### 🚀 Features

* Add --env nohash option ([#232](https://github.com/ntucker/anansi/issues/232)) ([71f912c](https://github.com/ntucker/anansi/commit/71f912ca9989d7f823bb7ba7bd6b72d8a4a8a029))


### 📦 Package

* thread-loader, webpack-bundle-analyzer ([bb994f2](https://github.com/ntucker/anansi/commit/bb994f24301c2da5f647e703d0832ded5f4ced1a))



### [6.2.12](https://github.com/ntucker/anansi/compare/@anansi/webpack-config@6.2.11...@anansi/webpack-config@6.2.12) (2021-04-12)


### 📦 Package

* mini-css-extract-plugin ([072e48a](https://github.com/ntucker/anansi/commit/072e48ad8fe9972fdf269ee0918d38fd660d6dad))



### [6.2.11](https://github.com/ntucker/anansi/compare/@anansi/webpack-config@6.2.10...@anansi/webpack-config@6.2.11) (2021-04-11)


### 📦 Package

* Bump linaria to 3-beta.2 ([273b04b](https://github.com/ntucker/anansi/commit/273b04bc49ea2554e0b2b87221edc89aaca2d6e4))
* css-loader, css-minimizer (major), postcss ([be9d829](https://github.com/ntucker/anansi/commit/be9d82952a72e2f7a6a8a7768313b272fa8a2657))



### [6.2.10](https://github.com/ntucker/anansi/compare/@anansi/webpack-config@6.2.9...@anansi/webpack-config@6.2.10) (2021-04-11)

**Note:** Version bump only for package @anansi/webpack-config





### [6.2.9](https://github.com/ntucker/anansi/compare/@anansi/webpack-config@6.2.8...@anansi/webpack-config@6.2.9) (2021-04-06)

**Note:** Version bump only for package @anansi/webpack-config





### [6.2.8](https://github.com/ntucker/anansi/compare/@anansi/webpack-config@6.2.7...@anansi/webpack-config@6.2.8) (2021-04-01)

**Note:** Version bump only for package @anansi/webpack-config





### [6.2.7](https://github.com/ntucker/anansi/compare/@anansi/webpack-config@6.2.6...@anansi/webpack-config@6.2.7) (2021-04-01)


### 📦 Package

* core-js minor ([b1cb302](https://github.com/ntucker/anansi/commit/b1cb3028b3dc5e87f0643b53e1028eb8baff87c6))



### [6.2.6](https://github.com/ntucker/anansi/compare/@anansi/webpack-config@6.2.5...@anansi/webpack-config@6.2.6) (2021-03-29)

**Note:** Version bump only for package @anansi/webpack-config





### [6.2.5](https://github.com/ntucker/anansi/compare/@anansi/webpack-config@6.2.4...@anansi/webpack-config@6.2.5) (2021-03-29)


### 💅 Enhancement

* Invalidate webpack cache based on config version ([80d73ee](https://github.com/ntucker/anansi/commit/80d73ee9b7427af953f78a2859dc3de1d2c4a024))
* Remove extraneous dep ([771a3da](https://github.com/ntucker/anansi/commit/771a3daf211c0eaafcdd851567d8b06c5e3b53c9))
* Webpack 5 recommended config ([037d36f](https://github.com/ntucker/anansi/commit/037d36f6f8dff75fa2a848e32b3925fb7bbb8842))


### 📝 Documentation

* Reorder and make more clear ([c7823e2](https://github.com/ntucker/anansi/commit/c7823e2bbc7b527091ee2649ada08611ee685e27))



### [6.2.4](https://github.com/ntucker/anansi/compare/@anansi/webpack-config@6.2.3...@anansi/webpack-config@6.2.4) (2021-03-28)


### 💅 Enhancement

* Use css-minimizer-webpack-plugin ([3ebe0a3](https://github.com/ntucker/anansi/commit/3ebe0a33553b64eda5e843b853c04ee94210c8fd))



### [6.2.3](https://github.com/ntucker/anansi/compare/@anansi/webpack-config@6.2.2...@anansi/webpack-config@6.2.3) (2021-03-28)


### 🐛 Bug Fix

* readable-stream mapping for current (3.6) version ([77b3c0b](https://github.com/ntucker/anansi/commit/77b3c0badb93c9600aafaad300bc6d7f5e7b7976))
* Storybook resolve.plugins building ([9b8adb6](https://github.com/ntucker/anansi/commit/9b8adb6081800472decad74cdc883805273a25b1))


### 📝 Documentation

* Update project titles ([9e248a4](https://github.com/ntucker/anansi/commit/9e248a4c697f567cd1a92688878c0965f9c95f7c))



### [6.2.2](https://github.com/ntucker/anansi/compare/@anansi/webpack-config@6.2.1...@anansi/webpack-config@6.2.2) (2021-03-28)


### 💅 Enhancement

* Make scripts use more consistent naming ([67d8130](https://github.com/ntucker/anansi/commit/67d8130ca0b135288c1e094728ad50cac8a0903f))


### 🐛 Bug Fix

* Correct peerDep version for storybook ([0e1696d](https://github.com/ntucker/anansi/commit/0e1696d52cd8832869fc1796bae0db1819662502))



### [6.2.1](https://github.com/ntucker/anansi/compare/@anansi/webpack-config@6.2.0...@anansi/webpack-config@6.2.1) (2021-03-28)


### 📝 Documentation

* Note about webpack-cli compatibility ([7f2532f](https://github.com/ntucker/anansi/commit/7f2532fd23e503c5cf01eca13556caf7bc5dc646))
* Update scripts example ([474d26e](https://github.com/ntucker/anansi/commit/474d26ef2119c339c95dc2d7584662519d5f5b83))
* Update tags ([2df65e3](https://github.com/ntucker/anansi/commit/2df65e318ea6e422021188780fb1777a59b37520))



## [6.2.0](https://github.com/ntucker/anansi/compare/@anansi/webpack-config@6.1.6...@anansi/webpack-config@6.2.0) (2021-03-28)


### 🚀 Features

* .html typings ([c038b95](https://github.com/ntucker/anansi/commit/c038b95d55114200d833e090507fd364a3c1d83d))
* Automatic module resolution based on tsconfig ([61bc307](https://github.com/ntucker/anansi/commit/61bc307d0e0fcd8281c54e4913df0a31777636c5))
* Resolve wasm files ([607530b](https://github.com/ntucker/anansi/commit/607530b1043e87038f51f61f77d229cf1774a49f))
* Support .html files ([3591086](https://github.com/ntucker/anansi/commit/35910863e1844da0fed68e9ad56fd3e5286375bb))


### 💅 Enhancement

* More chances to bust babel cache ([44d0bca](https://github.com/ntucker/anansi/commit/44d0bca5e151e75ef5bf36a108b89f4c2678153c))



### [6.1.6](https://github.com/ntucker/anansi/compare/@anansi/webpack-config@6.1.5...@anansi/webpack-config@6.1.6) (2021-03-28)


### 🐛 Bug Fix

* Node builds ([670c297](https://github.com/ntucker/anansi/commit/670c297f5dfddd699863ea5d9a357d500bf9efdf))


### 📦 Package

* css-loader, mini-css-extract-plugin, svgo minor ([c9bfd17](https://github.com/ntucker/anansi/commit/c9bfd1772c6b0a96d888db4dfa03553891323660))



### [6.1.5](https://github.com/ntucker/anansi/compare/@anansi/webpack-config@6.1.4...@anansi/webpack-config@6.1.5) (2021-03-28)


### 💅 Enhancement

* Explicit types inclusion for storybook loaders ([e6077c9](https://github.com/ntucker/anansi/commit/e6077c9e88c3139aaec5c490c03db219617e073a))


### 📦 Package

* readable-stream explicit dep ([17e6635](https://github.com/ntucker/anansi/commit/17e6635864f8606e7b54893114402f2b446af88a))


### 📝 Documentation

* Explain how to work with webpack 4 ([fee5e87](https://github.com/ntucker/anansi/commit/fee5e87337a2289bd6dbc3aeead9785af69669cd))



### [6.1.4](https://github.com/ntucker/anansi/compare/@anansi/webpack-config@6.1.3...@anansi/webpack-config@6.1.4) (2021-03-28)


### 💅 Enhancement

* Improve storybook rules detection to ignore ([96e7028](https://github.com/ntucker/anansi/commit/96e7028f5fcf75bb65182dc94cea20faff800570))



### [6.1.3](https://github.com/ntucker/anansi/compare/@anansi/webpack-config@6.1.2...@anansi/webpack-config@6.1.3) (2021-03-25)


### 🐛 Bug Fix

* Latest storybook config with hoisted node_modules ([77cc13f](https://github.com/ntucker/anansi/commit/77cc13f92d002fd6f6f2798c13768239e39a6f61))


### 📝 Documentation

* Webpack supports only 5 now ([86eca63](https://github.com/ntucker/anansi/commit/86eca6308ab8d9cb11140f337d4d8d0dae43d2a1))



### [6.1.2](https://github.com/ntucker/anansi/compare/@anansi/webpack-config@6.1.1...@anansi/webpack-config@6.1.2) (2021-03-25)


### 🐛 Bug Fix

* Hot reloading in dev mode with dev-server v3 ([e716c9d](https://github.com/ntucker/anansi/commit/e716c9de459f2abdbd4f7642d8496ae50a7b1fb8))



### [6.1.1](https://github.com/ntucker/anansi/compare/@anansi/webpack-config@6.1.0...@anansi/webpack-config@6.1.1) (2021-03-22)


### 💅 Enhancement

* Use default webpack targets (browserslist if found, then web) ([f28d1ed](https://github.com/ntucker/anansi/commit/f28d1edfa646aeebbb0b25270682ae7bcc0e2581))



## [6.1.0](https://github.com/ntucker/anansi/compare/@anansi/webpack-config@6.0.0...@anansi/webpack-config@6.1.0) (2021-03-21)


### 🚀 Features

* Enable linaria out of the box ([#157](https://github.com/ntucker/anansi/issues/157)) ([473ca19](https://github.com/ntucker/anansi/commit/473ca193753a3f0bf26f18717666f2913931ce8a))


### 💅 Enhancement

* Detect apng, cur, ani for PreloadWebpackPlugin ([8c86483](https://github.com/ntucker/anansi/commit/8c8648339014e5dbba1a174e53feabe51f542e2d))
* Handle case where react cannot be imported ([afb0d5a](https://github.com/ntucker/anansi/commit/afb0d5ac55ea98344612dacc3a97473b60867fb0))
* Make process.env more robust ([8b87227](https://github.com/ntucker/anansi/commit/8b8722783a29aad3d1c69b1b88a09ce59c9ee8f2))
* Only predefine process for non-node ([40084ee](https://github.com/ntucker/anansi/commit/40084ee67e99b4148c28611ef888a351a4129e85))
* Use webpack 5 asset modules ([#158](https://github.com/ntucker/anansi/issues/158)) ([06baa85](https://github.com/ntucker/anansi/commit/06baa856a77d7b28737df9a5359b46b5b6bf4f5f))
* Use webpack5 recommendations ([cff4dc7](https://github.com/ntucker/anansi/commit/cff4dc7dd81ed4d5623b9fbe5895038bff7437f9))



## [6.0.0](https://github.com/ntucker/anansi/compare/@anansi/webpack-config@6.0.0-rc.0...@anansi/webpack-config@6.0.0) (2021-03-21)


### 💅 Enhancement

* Remove webpack 4 conditionals ([#156](https://github.com/ntucker/anansi/issues/156)) ([cc0e28b](https://github.com/ntucker/anansi/commit/cc0e28b04bc18ad52ee61a95e9965c97cc41e314))



## [6.0.0-rc.0](https://github.com/ntucker/anansi/compare/@anansi/webpack-config@5.4.1...@anansi/webpack-config@6.0.0-rc.0) (2021-03-21)


### ⚠ 💥 BREAKING CHANGES

* - drop support for webpack 4
- remove ~ prefix in sass imports (should still work without it)

### 📦 Package

* Major webpack plugin upgrades for v5 support ([#75](https://github.com/ntucker/anansi/issues/75)) ([ff04988](https://github.com/ntucker/anansi/commit/ff049881d4a5894af4ceecc88de97c32fd7c5115))



### [5.4.1](https://github.com/ntucker/anansi/compare/@anansi/webpack-config@5.4.0...@anansi/webpack-config@5.4.1) (2021-03-21)


### 🐛 Bug Fix

* No more infinite loop in 6.2 storybook ([19c26db](https://github.com/ntucker/anansi/commit/19c26dbd7512abad5ddb55dd997cb89d132ce997))
* process ENV needed to use node polyfills ([de53ee7](https://github.com/ntucker/anansi/commit/de53ee727d0431b7a8b1f2d99f0997cc1b824be8))



## [5.4.0](https://github.com/ntucker/anansi/compare/@anansi/webpack-config@5.3.0...@anansi/webpack-config@5.4.0) (2021-03-21)


### 🚀 Features

* Support apng, cur, ani files ([48e4087](https://github.com/ntucker/anansi/commit/48e4087270225518450e0ee4533c86e940b11e11))


### 💅 Enhancement

* Simplify issuer regex ([5ebd06f](https://github.com/ntucker/anansi/commit/5ebd06f7c336f6dea0fe6036b9e01d63845e2701))


### 🐛 Bug Fix

* Global css might have side effects ([8d53c9e](https://github.com/ntucker/anansi/commit/8d53c9ed330d9f3217e7b81f320f0cc7ee8aca82))


### 📦 Package

* mini-css-extract-plugin, postcss, svgo patch ([b01a7b8](https://github.com/ntucker/anansi/commit/b01a7b88c1128d55c7e5be3365830973c9082a6a))



## [5.3.0](https://github.com/ntucker/anansi/compare/@anansi/webpack-config@5.2.4...@anansi/webpack-config@5.3.0) (2021-03-08)


### 🚀 Features

* Add svgoOptions to override SVGO optimization ([021d427](https://github.com/ntucker/anansi/commit/021d42700f1efebd1adf6086aff8fec6bec2d730))



### [5.2.4](https://github.com/ntucker/anansi/compare/@anansi/webpack-config@5.2.3...@anansi/webpack-config@5.2.4) (2021-03-06)


### 📦 Package

* SVGO and loader major ([dd7c594](https://github.com/ntucker/anansi/commit/dd7c594f50d25a7e59287d291f4ac23b0bf98972))



### [5.2.3](https://github.com/ntucker/anansi/compare/@anansi/webpack-config@5.2.2...@anansi/webpack-config@5.2.3) (2021-03-04)

**Note:** Version bump only for package @anansi/webpack-config





### [5.2.2](https://github.com/ntucker/anansi/compare/@anansi/webpack-config@5.2.1...@anansi/webpack-config@5.2.2) (2021-02-24)


### 💅 Enhancement

* Remove need for fancy loader resolution ([#110](https://github.com/ntucker/anansi/issues/110)) ([85d7a1c](https://github.com/ntucker/anansi/commit/85d7a1cf12037a919a1738285201e22535a2f28c))


### 🐛 Bug Fix

* Storybook ([9f6d526](https://github.com/ntucker/anansi/commit/9f6d52636e13e224aac024fcddfde00a970e2a71))


### 📦 Package

* mini-css-extract-plugin, react-dev-utils patch ([1959f32](https://github.com/ntucker/anansi/commit/1959f3260c7e7db322c131fead460fd1c6a51ea2))



### [5.2.1](https://github.com/ntucker/anansi/compare/@anansi/webpack-config@5.2.0...@anansi/webpack-config@5.2.1) (2021-02-20)


### 📦 Package

* bump autoprefixer from 10.2.3 to 10.2.4 ([#97](https://github.com/ntucker/anansi/issues/97)) ([123dd86](https://github.com/ntucker/anansi/commit/123dd86167b297fbfcdc7d775aa6cd5bd594cd34))
* bump postcss from 8.2.3 to 8.2.6 ([#93](https://github.com/ntucker/anansi/issues/93)) ([4190b40](https://github.com/ntucker/anansi/commit/4190b405c7bf2f83604dc93b639f4601d638b538))
* bump react-dev-utils from 10.2.1 to 11.0.2 ([#94](https://github.com/ntucker/anansi/issues/94)) ([a38c7c4](https://github.com/ntucker/anansi/commit/a38c7c4aad67fc455d5a52eff0fbb153270422a2))
* bump rimraf from 3.0.0 to 3.0.2 ([#96](https://github.com/ntucker/anansi/issues/96)) ([d3a9f95](https://github.com/ntucker/anansi/commit/d3a9f95c401c72941b0fc2e4dd76a95c4039ab08))


### 📝 Documentation

* Add upgrade guide to changelog ([63128c0](https://github.com/ntucker/anansi/commit/63128c03fc5c71b056c9e7673ecabea6aae7e1e6))



## [5.2.0](https://github.com/ntucker/anansi/compare/@anansi/webpack-config@5.1.14...@anansi/webpack-config@5.2.0) (2021-02-13)


### 🚀 Features

* Option to preload fonts ([#92](https://github.com/ntucker/anansi/issues/92)) ([8976436](https://github.com/ntucker/anansi/commit/8976436466b9627ef2ac370acc7ab105466f9f17))


### 📝 Documentation

* Add htmlOptions to readme ([3231fbd](https://github.com/ntucker/anansi/commit/3231fbde6ea7f793b1bce7be88b12a90180cc111))
* Formatting improvements ([245e59b](https://github.com/ntucker/anansi/commit/245e59b07ee551ba3c80207c176151c13078ee01))



### [5.1.14](https://github.com/ntucker/anansi/compare/@anansi/webpack-config@5.1.13...@anansi/webpack-config@5.1.14) (2021-02-13)


### 💅 Enhancement

* Move NoEmitOnErrorsPlugin to non-deprecated method ([b25bdfb](https://github.com/ntucker/anansi/commit/b25bdfb12b56474a8051467ab57cd201d5c25bb5))


### 📦 Package

* error-overlay-webpack-plugin, mini-css-extract-plugin patch ([89af772](https://github.com/ntucker/anansi/commit/89af772810d2d664ca63f5d24d724b89e3245854))


### 📝 Documentation

* Update linaria instructions ([b0092b8](https://github.com/ntucker/anansi/commit/b0092b8bb0fe9424860387bacdfa5eb02c98458a))



### [5.1.13](https://github.com/ntucker/anansi/compare/@anansi/webpack-config@5.1.12...@anansi/webpack-config@5.1.13) (2021-02-13)

**Note:** Version bump only for package @anansi/webpack-config





### [5.1.12](https://github.com/ntucker/anansi/compare/@anansi/webpack-config@5.1.11...@anansi/webpack-config@5.1.12) (2021-02-13)


### 🐛 Bug Fix

* Include webpack config types ([6d2f0e2](https://github.com/ntucker/anansi/commit/6d2f0e2d3bbeb99ee5fc756c8023e29bd1efc05f))



### [5.1.11](https://github.com/ntucker/anansi/compare/@anansi/webpack-config@5.1.10...@anansi/webpack-config@5.1.11) (2021-02-13)


### 📦 Package

* Bump babel (patch) ([22152c5](https://github.com/ntucker/anansi/commit/22152c51fce5534890a8737fc285a35228ee90ba))
* bump worker-loader from 3.0.7 to 3.0.8 ([#91](https://github.com/ntucker/anansi/issues/91)) ([c260de8](https://github.com/ntucker/anansi/commit/c260de83a85e7085f7e8afe980533428dbbcb152))



### [5.1.10](https://github.com/ntucker/anansi/compare/@anansi/webpack-config@5.1.9...@anansi/webpack-config@5.1.10) (2021-02-05)


### 📦 Package

* bump ramda from 0.26.1 to 0.27.1 ([#78](https://github.com/ntucker/anansi/issues/78)) ([498e327](https://github.com/ntucker/anansi/commit/498e32768f195c8cc3b0e7aa37f24c63739467e4))
* webpack-fix-style-only-entries patch ([4881852](https://github.com/ntucker/anansi/commit/4881852c2e73bd3c12d2c2eacc3ea05c38d20a1b))



### [5.1.9](https://github.com/ntucker/anansi/compare/@anansi/webpack-config@5.1.8...@anansi/webpack-config@5.1.9) (2021-02-03)

**Note:** Version bump only for package @anansi/webpack-config





### [5.1.8](https://github.com/ntucker/anansi/compare/@anansi/webpack-config@5.1.7...@anansi/webpack-config@5.1.8) (2021-01-23)


### 📦 Package

* autoprefixer, html-webpack-plugin, mini-css-extract-plugin, worker-loader ([8dd7bd0](https://github.com/ntucker/anansi/commit/8dd7bd07f3929c1ea0a832cfe682b2700065ef05))



### [5.1.7](https://github.com/ntucker/anansi/compare/@anansi/webpack-config@5.1.6...@anansi/webpack-config@5.1.7) (2021-01-18)


### 📦 Package

* minor post-css ([2b7d3a1](https://github.com/ntucker/anansi/commit/2b7d3a1f9f512cc2d4f0fa5bcfdaf83c8366f5a4))
* Require 5.12 webpack for html-plugin compat ([52d628c](https://github.com/ntucker/anansi/commit/52d628cb5afcbb7a94087085b433bd58c8dabadc))



### [5.1.6](https://github.com/ntucker/anansi/compare/@anansi/webpack-config@5.1.5...@anansi/webpack-config@5.1.6) (2020-12-29)


### 💅 Enhancement

* Improve storybook support ([#58](https://github.com/ntucker/anansi/issues/58)) ([8d1d572](https://github.com/ntucker/anansi/commit/8d1d572a1574be83fc02e923378d81f5e3972c1c))



### [5.1.5](https://github.com/ntucker/anansi/compare/@anansi/webpack-config@5.1.4...@anansi/webpack-config@5.1.5) (2020-12-17)

**Note:** Version bump only for package @anansi/webpack-config





### [5.1.4](https://github.com/ntucker/anansi/compare/@anansi/webpack-config@5.1.3...@anansi/webpack-config@5.1.4) (2020-12-04)


### 📦 Package

* many patch updates, node-sass major ([7747784](https://github.com/ntucker/anansi/commit/774778458a1a7261902fc2afc14793a7dfb8c9fc))



### [5.1.3](https://github.com/ntucker/anansi/compare/@anansi/webpack-config@5.1.2...@anansi/webpack-config@5.1.3) (2020-11-14)


### 🐛 Bug Fix

* Use normal node resolution ([#55](https://github.com/ntucker/anansi/issues/55)) ([96a90b7](https://github.com/ntucker/anansi/commit/96a90b7a1a18c9d5173cb27cf56ba8f530da2c1b))


### 📦 Package

* @pmmmwh/react-refresh-webpack-plugin patch ([a00ee91](https://github.com/ntucker/anansi/commit/a00ee91dbd444bef936b1a869eb4e2d1d904e3cd))
* babel-loader minor, mini-css-extract-plugin patch ([4cb8e71](https://github.com/ntucker/anansi/commit/4cb8e71e805584b30c7f2ed5af0c68b5b2bb4d91))
* mini-css-extract-plugin minor ([47de30e](https://github.com/ntucker/anansi/commit/47de30ebfc9c6b498e11f8c67ce9ff4d5a3e59be))



### [5.1.2](https://github.com/ntucker/anansi/compare/@anansi/webpack-config@5.1.1...@anansi/webpack-config@5.1.2) (2020-10-27)

**Note:** Version bump only for package @anansi/webpack-config





### [5.1.1](https://github.com/ntucker/anansi/compare/@anansi/webpack-config@5.1.0...@anansi/webpack-config@5.1.1) (2020-10-26)

**Note:** Version bump only for package @anansi/webpack-config





## [5.1.0](https://github.com/ntucker/anansi/compare/@anansi/webpack-config@5.0.0...@anansi/webpack-config@5.1.0) (2020-10-24)


### 🚀 Features

* Support new jsx transform for react 17 ([#53](https://github.com/ntucker/anansi/issues/53)) ([44c4a6a](https://github.com/ntucker/anansi/commit/44c4a6a7a60aa58d28ffd889b09841da9adfdb7a))


### 📦 Package

* Babel patch to 7.12.1 ([14db1ab](https://github.com/ntucker/anansi/commit/14db1abf4f2853c30c8baf9a6aec100780d8d578))



## [5.0.0](https://github.com/ntucker/anansi/compare/@anansi/webpack-config@4.2.5...@anansi/webpack-config@5.0.0) (2020-10-24)


### ⚠ 💥 BREAKING CHANGES

* args from period to space
(e.g., --env readable)

Also requires webpack-cli v4
* --analyze, --profile, --check, --readable
now use --env. prefix: e.g., --env.analyze
* module resolution now looks in package's node_modules
before hoisted
* Potential change to css output based on major postcss upgrade.

### 🚀 Features

* Support class static initialization blocks ([#47](https://github.com/ntucker/anansi/issues/47)) ([8625b5b](https://github.com/ntucker/anansi/commit/8625b5bd5b5745aaecfec09e9b09f723b23739a6))


### 💅 Enhancement

* Switch webpack args to use --env. prefix. ([#50](https://github.com/ntucker/anansi/issues/50)) ([11933ef](https://github.com/ntucker/anansi/commit/11933ef4db7322303943c5cf152dff329cfdd935))


### 🐛 Bug Fix

* Improve monorepo package resolution ([#49](https://github.com/ntucker/anansi/issues/49)) ([703af34](https://github.com/ntucker/anansi/commit/703af344c9ca33ce5442b4f86335479314b63f75))


### 📦 Package

* Major: autoprefixer, postcss-loader ([#45](https://github.com/ntucker/anansi/issues/45)) ([1b3ec85](https://github.com/ntucker/anansi/commit/1b3ec851afadd5822bbd5b1ec62c4ceec33c7038))
* Major: markdown-loader, mini-css-extract-plugin ([#44](https://github.com/ntucker/anansi/issues/44)) ([963441d](https://github.com/ntucker/anansi/commit/963441d02ecc7c61e0133eb8006af52f0d4a7f05))
* Require webpack-cli v4 ([#51](https://github.com/ntucker/anansi/issues/51)) ([4cc699f](https://github.com/ntucker/anansi/commit/4cc699ff60e943c69933d5f88368bd2b763a585c))
* Use webpack 5 by default ([#48](https://github.com/ntucker/anansi/issues/48)) ([f1e6631](https://github.com/ntucker/anansi/commit/f1e6631c47cf14360a224cdd8fbd9825179ff47a))


### ⏫ Upgrade Guide

1) Upgrade webpack-cli to v4 `yarn add --dev webpack-cli@4`

2) Update launch scripts to use `--env`

    <details open><summary><b>/package.json</b></summary>

    ```json
    {
      "scripts": {
        "start:dev": "webpack serve --mode=development",
        "build": "webpack --mode=production",
        "build:server": "webpack --mode=production --target=node",
        "analyze": "webpack --mode=production --env analyze",
        "profile": "webpack --mode=production --env profile",
        "pkgcheck": "webpack --env check=nobuild",
      }
    }
    ```
    </details>



### [4.2.5](https://github.com/ntucker/anansi/compare/@anansi/webpack-config@4.2.4...@anansi/webpack-config@4.2.5) (2020-10-02)


### 💅 Enhancement

* Default to gzip when analyzing ([28bfe20](https://github.com/ntucker/anansi/commit/28bfe206f3af9e165d60932c6e1a858023febfa4))
* webpack-dev-server no longer peerDep ([16f8ea0](https://github.com/ntucker/anansi/commit/16f8ea06b1b2372db733602f223a3fc22b11eaff))


### 📦 Package

* minor: css-loader, html-webpack-plugin, thread-loader; patch: mini-css-extract-plugin, worker-loader ([d95c0c9](https://github.com/ntucker/anansi/commit/d95c0c9fa78e4a179b1e5b6d34b5d9c5a8b0c469))



### [4.2.4](https://github.com/ntucker/anansi/compare/@anansi/webpack-config@4.2.3...@anansi/webpack-config@4.2.4) (2020-09-05)


### 🐛 Bug Fix

* Storybook webpack reoslution ([4b00ff1](https://github.com/ntucker/anansi/commit/4b00ff107266472fa95db63d99950fba7608fd18))



### [4.2.3](https://github.com/ntucker/anansi/compare/@anansi/webpack-config@4.2.2...@anansi/webpack-config@4.2.3) (2020-09-05)


### 💅 Enhancement

* Remove redundant postcss optimize, since we're using OptimizeCSSAssetsPlugin ([54e8540](https://github.com/ntucker/anansi/commit/54e85403b252ede003b08c33ef39e2a8744b9444))


### 📦 Package

* react-refresh, optimize-css, autoprefixer patch ([c993d67](https://github.com/ntucker/anansi/commit/c993d6715f02d74e6acd77cebb5fcfa6520160c4))



### [4.2.2](https://github.com/ntucker/anansi/compare/@anansi/webpack-config@4.2.1...@anansi/webpack-config@4.2.2) (2020-09-01)

**Note:** Version bump only for package @anansi/webpack-config





### [4.2.1](https://github.com/ntucker/anansi/compare/@anansi/webpack-config@4.2.0...@anansi/webpack-config@4.2.1) (2020-08-31)


### 💅 Enhancement

* Warn about using unsupported storybook version ([7382a32](https://github.com/ntucker/anansi/commit/7382a32866cb1329d37740cff305efa2fe2209f5))


### 📦 Package

* file-loader, html-webpack-plugin minor ([a7d4aed](https://github.com/ntucker/anansi/commit/a7d4aed2a415df1dbbe40e72dfcee036a0495c1c))


### 📝 Documentation

* Notice about versions supported ([e270145](https://github.com/ntucker/anansi/commit/e270145d1eb4340c7c68ea3478c596ebfa7d15fa))



## [4.2.0](https://github.com/ntucker/anansi/compare/@anansi/webpack-config@4.1.2...@anansi/webpack-config@4.2.0) (2020-08-31)


### 🚀 Features

* Fully support webpack 5 ([a095546](https://github.com/ntucker/anansi/commit/a0955460f27182e68cb3150abce2531cd649ea65))



### [4.1.2](https://github.com/ntucker/anansi/compare/@anansi/webpack-config@4.1.1...@anansi/webpack-config@4.1.2) (2020-08-30)


### 💅 Enhancement

* Increase compatability with webpack 5 ([644a5d2](https://github.com/ntucker/anansi/commit/644a5d2f27eae9947507daffcaacbc7ed7fd771d))


### 🐛 Bug Fix

* Storybook 6 compatibility ([f236cf6](https://github.com/ntucker/anansi/commit/f236cf62cba030abf26fb267cc44f5587b5edd85))



### [4.1.1](https://github.com/ntucker/anansi/compare/@anansi/webpack-config@4.1.0...@anansi/webpack-config@4.1.1) (2020-08-26)


### 💅 Enhancement

* Streamline TypeScript webpack integration ([5ecb8c4](https://github.com/ntucker/anansi/commit/5ecb8c43c6a5b598f5e07bafb1b1c2f6f272d0bf))


### 📝 Documentation

* Add badges to readmes ([e377889](https://github.com/ntucker/anansi/commit/e3778896d0e3f24a7ba4f35592b1de2e51273c85))



## [4.1.0](https://github.com/ntucker/anansi/compare/@anansi/webpack-config@4.0.1...@anansi/webpack-config@4.1.0) (2020-08-26)


### 🚀 Features

* Support more video formats ([ffc03a0](https://github.com/ntucker/anansi/commit/ffc03a0f35fa702bb07625b85bfcf3cc134fd0eb))


### 🐛 Bug Fix

* Don't apply sass to .css files ([c1cf8ca](https://github.com/ntucker/anansi/commit/c1cf8ca33829023c195b878137681a93ccfa6f80))
* Prioritize own loaders over user's for compatibility ([e86a9c9](https://github.com/ntucker/anansi/commit/e86a9c9eb3a58db124db13b93e3d337c57da67e8))
* Symlink no longer set in storybook ([e660d90](https://github.com/ntucker/anansi/commit/e660d90384eab97dfd3fb4a6fcec043699d5b257))



### [4.0.1](https://github.com/ntucker/anansi/compare/@anansi/webpack-config@4.0.0...@anansi/webpack-config@4.0.1) (2020-08-25)


### 📝 Documentation

* Add linaria instructions step about including preset ([6f9bb5d](https://github.com/ntucker/anansi/commit/6f9bb5df2675da8e4bf4fbf5956cee1c8d7de1fe))
* Fix heading level in readme ([fe1ebd1](https://github.com/ntucker/anansi/commit/fe1ebd104a1205bc463a784bc906103993372f5f))



## [4.0.0](https://github.com/ntucker/anansi/compare/@anansi/webpack-config@3.0.1...@anansi/webpack-config@4.0.0) (2020-08-25)


### ⚠ 💥 BREAKING CHANGES

* Path resolution will now resolve to symlink location,
see https://webpack.js.org/configuration/resolve/#resolvesymlinks
* cssLoaderOptions have changed, see https://github.com/webpack-contrib/css-loader/releases/tag/v4.0.0

node_modules only use cssmodules if .module extension is used

### 🚀 Features

* Add cssModuleOptions to customize how css modules work ([46eaf53](https://github.com/ntucker/anansi/commit/46eaf536a24d837e2134b86e60b2078034548e3e))
* Add extraJsLoaders option ([04e252c](https://github.com/ntucker/anansi/commit/04e252c5f33d78a8f2ce4d7436bce647bb7d5966))
* Support linaria and other css flexibility ([#41](https://github.com/ntucker/anansi/issues/41)) ([00cd6fd](https://github.com/ntucker/anansi/commit/00cd6fd4fe1a973fef4915613bdac372f1f91151))


### 💅 Enhancement

* Remove resolve.symlinks = false ([c89f3e6](https://github.com/ntucker/anansi/commit/c89f3e62d887cc8938e46b58e7e2405bfa06d81c))


### 🐛 Bug Fix

* Consistent css module options when in dev mode ([7a27d96](https://github.com/ntucker/anansi/commit/7a27d96726275a4a165aa96d392f721828af38c5))


### 📦 Package

* Upgrade css-loader to v4 (major) ([32d57d2](https://github.com/ntucker/anansi/commit/32d57d2e885fd2fb129bad732cbbdcbaa513b584))



## <small>3.0.1 (2020-08-14)</small>

* enhance: Upgrade to storybook 6 (major) ([da30bf7](https://github.com/ntucker/anansi/commit/da30bf7))
* pkg: Antd, terser ([ec300c1](https://github.com/ntucker/anansi/commit/ec300c1))





## [3.0.0](https://github.com/ntucker/anansi/compare/@anansi/webpack-config@2.1.1...@anansi/webpack-config@3.0.0) (2020-08-08)


### ⚠ 💥 BREAKING CHANGES

* Set hardCacheOptions={} to re-enable plugin
* Webpack min version 4.43

### 💅 Enhancement

* Disable hard-cache-plugin by default ([d0facde](https://github.com/ntucker/anansi/commit/d0facde55f94ebeb55fbb483a0f9e269ac60e72c))


### 🐛 Bug Fix

* worker-loader integration ([31ca6ac](https://github.com/ntucker/anansi/commit/31ca6ac07ede4d3f6ec2f36a3de8e52e5fe46fa1))


### 📦 Package

* major worker-loader, webpack-node-externals (not affecting our config) ([ef7f8fd](https://github.com/ntucker/anansi/commit/ef7f8fdf59c722f01726dae02d38e0eb7905f5a2))
* react-refresh-webpack-plugin v4 ([9e3e64d](https://github.com/ntucker/anansi/commit/9e3e64d7cc7ef83d2760c399b6cf62488ef49a78))
* Terser major upgrade ([e860b73](https://github.com/ntucker/anansi/commit/e860b73372b229fc3a2f091aab1b4a663dbfa726))



### [2.1.1](https://github.com/ntucker/anansi/compare/@anansi/webpack-config@2.1.0...@anansi/webpack-config@2.1.1) (2020-07-31)


### 🏠 Internal

* Bump internal packages ([f87eb44](https://github.com/ntucker/anansi/commit/f87eb44e59e1481ab8dd16c84d501b922071a919))



## [2.1.0](https://github.com/ntucker/anansi/compare/@anansi/webpack-config@2.0.4...@anansi/webpack-config@2.1.0) (2020-07-31)


### 🚀 Features

* New CLI option --readable ([00beef8](https://github.com/ntucker/anansi/commit/00beef88419175f080d20efebbebb7e26b5c05d0))


### 📦 Package

* Upgrade babel to 7.11 ([9d8cd12](https://github.com/ntucker/anansi/commit/9d8cd124b7cd5d2f31bfda57dccae32bef46af1c))



### [2.0.4](https://github.com/ntucker/anansi/compare/@anansi/webpack-config@2.0.3...@anansi/webpack-config@2.0.4) (2020-07-18)


### 📦 Package

* terser-webpack-plugin, autoprefixer ([94a7f99](https://github.com/ntucker/anansi/commit/94a7f99bb0a8ce15db88439b32afa8d99556165c))



### [2.0.3](https://github.com/ntucker/anansi/compare/@anansi/webpack-config@2.0.2...@anansi/webpack-config@2.0.3) (2020-07-11)


### 📦 Package

* raw-loader, terser-webpack-plugin major ([5d2e5b0](https://github.com/ntucker/anansi/commit/5d2e5b026439c4845f190b767270e44112e1e0af))



### [2.0.2](https://github.com/ntucker/anansi/compare/@anansi/webpack-config@2.0.1...@anansi/webpack-config@2.0.2) (2020-07-11)


### 📦 Package

* react-dev-utils, react-docgen-typescript-loader, sass-loader ([3d7cbc5](https://github.com/ntucker/anansi/commit/3d7cbc59473a9472bb7da940de22df95994ddb43))
* webpack-bundle-analyzer, webpack-fix-style-only-entries ([3f5b85f](https://github.com/ntucker/anansi/commit/3f5b85fd010a7c9a0d7b4b14a4804c8d9233a61d))



### [2.0.1](https://github.com/ntucker/anansi/compare/@anansi/webpack-config@2.0.0...@anansi/webpack-config@2.0.1) (2020-07-01)


### 💅 Enhancement

* Bump style plugins/loaders ([2e25bd3](https://github.com/ntucker/anansi/commit/2e25bd33da6d1aa5230a989388b15fdacab8457c))
* Don't extract global css into js ([82abbdb](https://github.com/ntucker/anansi/commit/82abbdbc31e767a5ef57faf46347b79ba152ffd4))



## [2.0.0](https://github.com/ntucker/anansi/compare/@anansi/webpack-config@1.0.6...@anansi/webpack-config@2.0.0) (2020-07-01)


### ⚠ 💥 BREAKING CHANGES

* export.scss is no longer automatically included.
* To import SVG as Component, use { ReactComponent }

### 🚀 Features

* Add sassResources option. Without it export.scss is not provided ([34901d2](https://github.com/ntucker/anansi/commit/34901d24cdd6ce48da47fbc584439f0abbcbfc6f))
* SVG as component or url string based on import ([#36](https://github.com/ntucker/anansi/issues/36)) ([1497183](https://github.com/ntucker/anansi/commit/14971839054e8dbc352a8ba8267a28f915541369))


### 🐛 Bug Fix

* Optional chaining 'Module parse failed' when targetting newer browsers ([55d7c1e](https://github.com/ntucker/anansi/commit/55d7c1e5ba3ab9d8e22567790173ca868b9536ef))



### [1.0.6](https://github.com/ntucker/anansi/compare/@anansi/webpack-config@1.0.5...@anansi/webpack-config@1.0.6) (2020-06-28)


### 📦 Package

* Minor html-webpack-plugin, patch react-refresh-webpack-plugin ([466462d](https://github.com/ntucker/anansi/commit/466462dc3c5561d61a3504094b575fe245e81838))



### [1.0.5](https://github.com/ntucker/anansi/compare/@anansi/webpack-config@1.0.4...@anansi/webpack-config@1.0.5) (2020-05-28)


### 📦 Package

* Upgrade to babel 7.10 ([b97dca4](https://github.com/ntucker/anansi/commit/b97dca4dcd2eb02bd65a8377b1fea94b466c97ec))



### [1.0.4](https://github.com/ntucker/anansi/compare/@anansi/webpack-config@1.0.3...@anansi/webpack-config@1.0.4) (2020-05-25)


### 📦 Package

* react-refresh patch ([84a4a0a](https://github.com/ntucker/anansi/commit/84a4a0a31c99f4320b0a16774a114cda1c4b4030))



### [1.0.3](https://github.com/ntucker/anansi/compare/@anansi/webpack-config@1.0.2...@anansi/webpack-config@1.0.3) (2020-05-13)

**Note:** Version bump only for package @anansi/webpack-config





### [1.0.2](https://github.com/ntucker/anansi/compare/@anansi/webpack-config@1.0.1...@anansi/webpack-config@1.0.2) (2020-05-11)


### 🐛 Bug Fix

* Security vuln package updates ([#35](https://github.com/ntucker/anansi/issues/35)) ([ce15d09](https://github.com/ntucker/anansi/commit/ce15d09f7c16ce06c0e9d84cd9a8311e55ccdc81))


### 📦 Package

* Upgrade react-refresh webpack plugin to 0.3.1 ([7a47c7e](https://github.com/ntucker/anansi/commit/7a47c7e5b91c7293f2421a1ace7f3104d4178b17))



### [1.0.1](https://github.com/ntucker/anansi/compare/@anansi/webpack-config@1.0.0...@anansi/webpack-config@1.0.1) (2020-05-02)


### 📦 Package

* url-loader (major) ([8a1de61](https://github.com/ntucker/anansi/commit/8a1de61b0cea1af0df3de2bad35996adf04f76a8))



## [1.0.0](https://github.com/ntucker/anansi/compare/@anansi/webpack-config@0.20.2...@anansi/webpack-config@1.0.0) (2020-04-19)


### ⚠ 💥 BREAKING CHANGES

* Use of html plugin has changed. See:
https://dev.to/jantimon/html-webpack-plugin-4-has-been-released-125d
* Required node 10

### 📦 Package

* Bump a few webpack plugins ([#34](https://github.com/ntucker/anansi/issues/34)) ([7b29fb1](https://github.com/ntucker/anansi/commit/7b29fb1811f66f19dd44d26e7b2bf5f1177dc919))
* Upgrade html-webpack-plugin to 4 series ([044f9ef](https://github.com/ntucker/anansi/commit/044f9ef89bebdfee96e63e7d5b99d3b06a0b56e1))


### 🏠 Internal

* Bump dev webpack for plugin ([f696d31](https://github.com/ntucker/anansi/commit/f696d31d456f855b71cc64a4e0aa55788311be98))



### [0.20.2](https://github.com/ntucker/anansi/compare/@anansi/webpack-config@0.20.1...@anansi/webpack-config@0.20.2) (2020-04-09)

**Note:** Version bump only for package @anansi/webpack-config





### [0.20.1](https://github.com/ntucker/anansi/compare/@anansi/webpack-config@0.20.0...@anansi/webpack-config@0.20.1) (2020-03-22)

**Note:** Version bump only for package @anansi/webpack-config





## [0.20.0](https://github.com/ntucker/anansi/compare/@anansi/webpack-config@0.19.8...@anansi/webpack-config@0.20.0) (2020-03-22)


### 🚀 Features

* Automatically detect webpack target in babel ([#32](https://github.com/ntucker/anansi/issues/32)) ([257b64e](https://github.com/ntucker/anansi/commit/257b64e539c662693d31e1335eade9ad25d5a633))



### [0.19.8](https://github.com/ntucker/anansi/compare/@anansi/webpack-config@0.19.7...@anansi/webpack-config@0.19.8) (2020-03-14)

**Note:** Version bump only for package @anansi/webpack-config





### [0.19.7](https://github.com/ntucker/anansi/compare/@anansi/webpack-config@0.19.6...@anansi/webpack-config@0.19.7) (2020-03-08)


### 📦 Package

* Babel typescript, preset-env ([ec8adcf](https://github.com/ntucker/anansi/commit/ec8adcf96a5001ea734e906d42eb47c6369caaac))


### 📝 Documentation

* Add more keywords ([2a080e5](https://github.com/ntucker/anansi/commit/2a080e5ff3b2498297afd2603a51a8700a2e8100))



### [0.19.6](https://github.com/ntucker/anansi/compare/@anansi/webpack-config@0.19.5...@anansi/webpack-config@0.19.6) (2020-02-17)


### 🏠 Internal

* Update linting configs ([df4447e](https://github.com/ntucker/anansi/commit/df4447eed9401b7d01361c80bcd13cc4fc49f7a1))



### [0.19.5](https://github.com/ntucker/anansi/compare/@anansi/webpack-config@0.19.4...@anansi/webpack-config@0.19.5) (2020-02-16)

**Note:** Version bump only for package @anansi/webpack-config





### [0.19.4](https://github.com/ntucker/anansi/compare/@anansi/webpack-config@0.19.3...@anansi/webpack-config@0.19.4) (2020-01-29)


### 🐛 Bug Fix

* Remove inline chunks until htmlwebpackplugin is v4 ([cbf55c9](https://github.com/ntucker/anansi/commit/cbf55c97a47ca357969a25d34b2b3dc786a12329))


### 📦 Package

* react-refresh, terser-plugin ([e25caad](https://github.com/ntucker/anansi/commit/e25caadc73847006e62497b05cbcaf7df5347b47))



### [0.19.3](https://github.com/ntucker/anansi/compare/@anansi/webpack-config@0.19.2...@anansi/webpack-config@0.19.3) (2020-01-27)

**Note:** Version bump only for package @anansi/webpack-config





### [0.19.2](https://github.com/ntucker/anansi/compare/@anansi/webpack-config@0.19.1...@anansi/webpack-config@0.19.2) (2020-01-13)


### 💅 Enhancement

* Inline webpack runtime chunk in prod ([#22](https://github.com/ntucker/anansi/issues/22)) ([075eed0](https://github.com/ntucker/anansi/commit/075eed00ff65f75701120fb5ca80fddfd13b3602))



### [0.19.1](https://github.com/ntucker/anansi/compare/@anansi/webpack-config@0.19.0...@anansi/webpack-config@0.19.1) (2020-01-07)


### 📦 Package

* lerna, eslint ([ce1eaa3](https://github.com/ntucker/anansi/commit/ce1eaa37a02914ddb6ca83a28dfef1f0ec9e5a38))



## [0.19.0](https://github.com/ntucker/anansi/compare/@anansi/webpack-config@0.18.1...@anansi/webpack-config@0.19.0) (2019-12-18)


### 🚀 Features

* Add babelLoader to customize babel loader options ([#16](https://github.com/ntucker/anansi/issues/16)) ([38667a4](https://github.com/ntucker/anansi/commit/38667a4d14638f8b8928863191c198c9516c8845))
* Add babelRoot to webpack config generator ([#15](https://github.com/ntucker/anansi/issues/15)) ([f5d95d6](https://github.com/ntucker/anansi/commit/f5d95d6fb6d0be2d29e1249f804e8158a0b8d5d3))


### 🐛 Bug Fix

* Fix webpack's babel loader ([854c4be](https://github.com/ntucker/anansi/commit/854c4befc5146d44e95dc57d305a38910b2fb8e0))
* Storybook with webpack - don't use react-refresh with it ([#17](https://github.com/ntucker/anansi/issues/17)) ([70a4b1f](https://github.com/ntucker/anansi/commit/70a4b1f7180e1a22fa323338504ae5a7cdab338d))



### [0.18.1](https://github.com/ntucker/anansi/compare/@anansi/webpack-config@0.18.0...@anansi/webpack-config@0.18.1) (2019-12-11)


### 🐛 Bug Fix

* Disable react-refresh in storybook context ([63b299e](https://github.com/ntucker/anansi/commit/63b299eb8c49173db08b3ef46fe34199888d647a))


### 📝 Documentation

* Link to monorepo directories in npm repo listing ([b7dc1d5](https://github.com/ntucker/anansi/commit/b7dc1d5b1a6f3b163c9d155e3847c8d079f6b4cf))



## [0.18.0](https://github.com/ntucker/anansi/compare/@anansi/webpack-config@0.17.6...@anansi/webpack-config@0.18.0) (2019-12-09)


### 🚀 Features

* Eslint TypeScript support ([#14](https://github.com/ntucker/anansi/issues/14)) ([2679e26](https://github.com/ntucker/anansi/commit/2679e2683759b3200bb2985b947cf07208e49005))
* Use react fast-refresh instead of hot-reloader ([#13](https://github.com/ntucker/anansi/issues/13)) ([1ca29a4](https://github.com/ntucker/anansi/commit/1ca29a4d19746e5238771782192e24289abb59b8))



### [0.17.6](https://github.com/ntucker/anansi/compare/@anansi/webpack-config@0.17.5...@anansi/webpack-config@0.17.6) (2019-12-01)


### 💅 Enhancement

* Change default production htmlOptions to have empty title ([#11](https://github.com/ntucker/anansi/issues/11)) ([36ac2e6](https://github.com/ntucker/anansi/commit/36ac2e6a14e9ed49f43d43e8242817245d435fe9))



### [0.17.5](https://github.com/ntucker/anansi/compare/@anansi/webpack-config@0.17.4...@anansi/webpack-config@0.17.5) (2019-11-19)


### 💅 Enhancement

* ENV configurable publicPath ([#9](https://github.com/ntucker/anansi/issues/9)) ([c5b6aa2](https://github.com/ntucker/anansi/commit/c5b6aa27f3a31e2c23e39301823a3e84bdcb21e7))
* Error on htmlOptions set to 'undefined' ([#8](https://github.com/ntucker/anansi/issues/8)) ([76b44da](https://github.com/ntucker/anansi/commit/76b44dafd0ae581dcac5653e890913c22e2d9058))


### 📦 Package

* svgo patch, react-docgen-typescript-loader minor ([#10](https://github.com/ntucker/anansi/issues/10)) ([d59dc85](https://github.com/ntucker/anansi/commit/d59dc858188d08643bcd1f083f8928969e5dc404))



## <small>0.17.4 (2019-11-13)</small>

* internal: Configure changelog tags ([6d752d0](https://github.com/ntucker/anansi/commit/6d752d0))





## [0.17.1](https://github.com/ntucker/anansi/compare/@anansi/webpack-config@0.17.0...@anansi/webpack-config@0.17.1) (2019-11-10)

**Note:** Version bump only for package @anansi/webpack-config
