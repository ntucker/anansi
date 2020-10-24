# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [2.0.0](https://github.com/ntucker/anansi/compare/anansi-example-linaria@1.0.12...anansi-example-linaria@2.0.0) (2020-10-24)


### ⚠ 💥 BREAKING CHANGES

* args from period to space
(e.g., --env readable)

Also requires webpack-cli v4
* --analyze, --profile, --check, --readable
now use --env. prefix: e.g., --env.analyze
* Requires @babel/core and @babel/runtime of at least
7.12

### 💅 Enhancement

* Switch webpack args to use --env. prefix. ([#50](https://github.com/ntucker/anansi/issues/50)) ([11933ef](https://github.com/ntucker/anansi/commit/11933ef4db7322303943c5cf152dff329cfdd935))


### 📦 Package

* babel to 7.12 ([#46](https://github.com/ntucker/anansi/issues/46)) ([b4154f8](https://github.com/ntucker/anansi/commit/b4154f8f867c1ed245b5f34bb7c3ff28ae20dbc8))
* Require webpack-cli v4 ([#51](https://github.com/ntucker/anansi/issues/51)) ([4cc699f](https://github.com/ntucker/anansi/commit/4cc699ff60e943c69933d5f88368bd2b763a585c))
* Use webpack 5 by default ([#48](https://github.com/ntucker/anansi/issues/48)) ([f1e6631](https://github.com/ntucker/anansi/commit/f1e6631c47cf14360a224cdd8fbd9825179ff47a))


### 🏠 Internal

* Tsconfig target same as build ([1908e03](https://github.com/ntucker/anansi/commit/1908e032675cb0347d5f953626e7ab3dcee0aff3))



### [1.0.12](https://github.com/ntucker/anansi/compare/anansi-example-linaria@1.0.11...anansi-example-linaria@1.0.12) (2020-10-02)

**Note:** Version bump only for package anansi-example-linaria





### [1.0.11](https://github.com/ntucker/anansi/compare/anansi-example-linaria@1.0.10...anansi-example-linaria@1.0.11) (2020-09-06)


### 🏠 Internal

* lint, typescript bumps ([9d77863](https://github.com/ntucker/anansi/commit/9d77863dca02b8a1e22ee99542025e86c7a108b6))



### [1.0.10](https://github.com/ntucker/anansi/compare/anansi-example-linaria@1.0.9...anansi-example-linaria@1.0.10) (2020-09-05)

**Note:** Version bump only for package anansi-example-linaria





### [1.0.9](https://github.com/ntucker/anansi/compare/anansi-example-linaria@1.0.8...anansi-example-linaria@1.0.9) (2020-09-05)

**Note:** Version bump only for package anansi-example-linaria





### [1.0.8](https://github.com/ntucker/anansi/compare/anansi-example-linaria@1.0.7...anansi-example-linaria@1.0.8) (2020-09-01)

**Note:** Version bump only for package anansi-example-linaria





### [1.0.7](https://github.com/ntucker/anansi/compare/anansi-example-linaria@1.0.6...anansi-example-linaria@1.0.7) (2020-08-31)

**Note:** Version bump only for package anansi-example-linaria





### [1.0.6](https://github.com/ntucker/anansi/compare/anansi-example-linaria@1.0.5...anansi-example-linaria@1.0.6) (2020-08-31)

**Note:** Version bump only for package anansi-example-linaria





### [1.0.5](https://github.com/ntucker/anansi/compare/anansi-example-linaria@1.0.4...anansi-example-linaria@1.0.5) (2020-08-30)


### 💅 Enhancement

* Increase compatability with webpack 5 ([644a5d2](https://github.com/ntucker/anansi/commit/644a5d2f27eae9947507daffcaacbc7ed7fd771d))



### [1.0.4](https://github.com/ntucker/anansi/compare/anansi-example-linaria@1.0.3...anansi-example-linaria@1.0.4) (2020-08-26)

**Note:** Version bump only for package anansi-example-linaria





### [1.0.3](https://github.com/ntucker/anansi/compare/anansi-example-linaria@1.0.2...anansi-example-linaria@1.0.3) (2020-08-26)


### 💅 Enhancement

* We aren't using storybook in linaria example ([e5343c0](https://github.com/ntucker/anansi/commit/e5343c09b5707a9bfa3905488b719fe1274942b5))



### [1.0.2](https://github.com/ntucker/anansi/compare/anansi-example-linaria@1.0.1...anansi-example-linaria@1.0.2) (2020-08-26)

**Note:** Version bump only for package anansi-example-linaria





### [1.0.1](https://github.com/ntucker/anansi/compare/anansi-example-linaria@1.0.0...anansi-example-linaria@1.0.1) (2020-08-25)

**Note:** Version bump only for package anansi-example-linaria





## 1.0.0 (2020-08-25)


### ⚠ 💥 BREAKING CHANGES

* cssLoaderOptions have changed, see https://github.com/webpack-contrib/css-loader/releases/tag/v4.0.0

node_modules only use cssmodules if .module extension is used

### 🚀 Features

* Support linaria and other css flexibility ([#41](https://github.com/ntucker/anansi/issues/41)) ([00cd6fd](https://github.com/ntucker/anansi/commit/00cd6fd4fe1a973fef4915613bdac372f1f91151))


### 🐛 Bug Fix

* Consistent css module options when in dev mode ([7a27d96](https://github.com/ntucker/anansi/commit/7a27d96726275a4a165aa96d392f721828af38c5))


### 📦 Package

* Upgrade css-loader to v4 (major) ([32d57d2](https://github.com/ntucker/anansi/commit/32d57d2e885fd2fb129bad732cbbdcbaa513b584))
