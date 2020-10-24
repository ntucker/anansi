# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

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
