# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

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
