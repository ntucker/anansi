# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

### [2.1.11](https://github.com/ntucker/anansi/compare/@anansi/babel-preset@2.1.10...@anansi/babel-preset@2.1.11) (2021-02-24)


### 📦 Package

* Babel plugins minor - 7.13 ([6380669](https://github.com/ntucker/anansi/commit/6380669b3f7050f34188c4b35fb1070587b552fb))


### 📝 Documentation

* Note deprecation of 'targets' option ([20e7d82](https://github.com/ntucker/anansi/commit/20e7d824b3ed7b028961e49c964add383327e9cc))



### [2.1.10](https://github.com/ntucker/anansi/compare/@anansi/babel-preset@2.1.9...@anansi/babel-preset@2.1.10) (2021-02-20)


### 📦 Package

* Babel plugin patch - 7.12.17 ([8a70653](https://github.com/ntucker/anansi/commit/8a70653162d049bafd0309689ced724ac8c6b640))


### 📝 Documentation

* Add upgrade guide to changelog ([63128c0](https://github.com/ntucker/anansi/commit/63128c03fc5c71b056c9e7673ecabea6aae7e1e6))



### [2.1.9](https://github.com/ntucker/anansi/compare/@anansi/babel-preset@2.1.8...@anansi/babel-preset@2.1.9) (2021-02-13)


### 📝 Documentation

* Use simpler package name for namespaced babel-preset ([0da22ad](https://github.com/ntucker/anansi/commit/0da22ad71f5b600ec67c1ce103c680b52b1f358b))



### [2.1.8](https://github.com/ntucker/anansi/compare/@anansi/babel-preset@2.1.7...@anansi/babel-preset@2.1.8) (2021-02-13)


### 📦 Package

* Bump babel (patch) ([22152c5](https://github.com/ntucker/anansi/commit/22152c51fce5534890a8737fc285a35228ee90ba))



### [2.1.7](https://github.com/ntucker/anansi/compare/@anansi/babel-preset@2.1.6...@anansi/babel-preset@2.1.7) (2021-02-05)


### 📦 Package

* Relax @babel/runtime requirements to 7.7 ([48eba52](https://github.com/ntucker/anansi/commit/48eba52398c1bf9a01c5cd658b0de03ba0349d09))



### [2.1.6](https://github.com/ntucker/anansi/compare/@anansi/babel-preset@2.1.5...@anansi/babel-preset@2.1.6) (2021-02-03)


### 📦 Package

* bump @babel/preset-env from 7.12.11 to 7.12.13 ([#74](https://github.com/ntucker/anansi/issues/74)) ([8b1225d](https://github.com/ntucker/anansi/commit/8b1225d1f9e42f1b113bef9e2eabfa353ae7f93a))



### [2.1.5](https://github.com/ntucker/anansi/compare/@anansi/babel-preset@2.1.4...@anansi/babel-preset@2.1.5) (2020-12-17)


### 📦 Package

* Patch bump for transform-runtime, transform-typescript, preset-env, preset-react ([68e5110](https://github.com/ntucker/anansi/commit/68e511056e1dfb87b93fc4a5a64c903a5ad3cb56))



### [2.1.4](https://github.com/ntucker/anansi/compare/@anansi/babel-preset@2.1.3...@anansi/babel-preset@2.1.4) (2020-12-04)


### 📦 Package

* preset-env, preset-react, plugin-macros ([8cbfc93](https://github.com/ntucker/anansi/commit/8cbfc93ab60c9820a3e81d62ce39b9a8a0904225))



### [2.1.3](https://github.com/ntucker/anansi/compare/@anansi/babel-preset@2.1.2...@anansi/babel-preset@2.1.3) (2020-11-14)


### 📦 Package

* babel/preset-react patch ([80b874b](https://github.com/ntucker/anansi/commit/80b874be24a01058d0c80ddeab089654f89ef6cd))



### [2.1.2](https://github.com/ntucker/anansi/compare/@anansi/babel-preset@2.1.1...@anansi/babel-preset@2.1.2) (2020-10-27)


### 🐛 Bug Fix

* No pragma for react ([6f59cb1](https://github.com/ntucker/anansi/commit/6f59cb18130f1af83087548df101f06bd57a0018))



### [2.1.1](https://github.com/ntucker/anansi/compare/@anansi/babel-preset@2.1.0...@anansi/babel-preset@2.1.1) (2020-10-26)


### 📦 Package

* babel-plugin-root-import - support template imports ([2393014](https://github.com/ntucker/anansi/commit/23930149dedd2fba56e417c2643301888e4d6b41))



## [2.1.0](https://github.com/ntucker/anansi/compare/@anansi/babel-preset@2.0.0...@anansi/babel-preset@2.1.0) (2020-10-24)


### 🚀 Features

* Support new jsx transform for react 17 ([#53](https://github.com/ntucker/anansi/issues/53)) ([44c4a6a](https://github.com/ntucker/anansi/commit/44c4a6a7a60aa58d28ffd889b09841da9adfdb7a))


### 📦 Package

* Babel patch to 7.12.1 ([14db1ab](https://github.com/ntucker/anansi/commit/14db1abf4f2853c30c8baf9a6aec100780d8d578))



## [2.0.0](https://github.com/ntucker/anansi/compare/@anansi/babel-preset@1.2.9...@anansi/babel-preset@2.0.0) (2020-10-24)


### ⚠ 💥 BREAKING CHANGES

* Requires @babel/core and @babel/runtime of at least
7.12

### 🚀 Features

* Support class static initialization blocks ([#47](https://github.com/ntucker/anansi/issues/47)) ([8625b5b](https://github.com/ntucker/anansi/commit/8625b5bd5b5745aaecfec09e9b09f723b23739a6))

### ⏫ Upgrade Guide

1) Upgrade @babel/core to >7.12: `yarn upgrade @babel/core`
2) Test
3) Upgrade @anansi/babel-preset: `yarn upgrade @anansi/babel-preset`
4) Test

### 📦 Package

* babel to 7.12 ([#46](https://github.com/ntucker/anansi/issues/46)) ([b4154f8](https://github.com/ntucker/anansi/commit/b4154f8f867c1ed245b5f34bb7c3ff28ae20dbc8))



### [1.2.9](https://github.com/ntucker/anansi/compare/@anansi/babel-preset@1.2.8...@anansi/babel-preset@1.2.9) (2020-09-01)


### 📦 Package

* transform-runtime, preset-env patch ([16f7eb5](https://github.com/ntucker/anansi/commit/16f7eb5b564f5950e9ab7713feabaa0e59ed91e1))



### [1.2.8](https://github.com/ntucker/anansi/compare/@anansi/babel-preset@1.2.7...@anansi/babel-preset@1.2.8) (2020-08-25)


### 📝 Documentation

* Add reference to Decimal parsing ([9a0df4b](https://github.com/ntucker/anansi/commit/9a0df4b57701fd42570fc8fdad7b31ddf07a5d84))



### [1.2.7](https://github.com/ntucker/anansi/compare/@anansi/babel-preset@1.2.6...@anansi/babel-preset@1.2.7) (2020-07-31)


### 📦 Package

* Upgrade babel to 7.11 ([9d8cd12](https://github.com/ntucker/anansi/commit/9d8cd124b7cd5d2f31bfda57dccae32bef46af1c))



### [1.2.6](https://github.com/ntucker/anansi/compare/@anansi/babel-preset@1.2.5...@anansi/babel-preset@1.2.6) (2020-07-18)


### 📦 Package

* Bump decorators, runtime, typescript ([324d2f9](https://github.com/ntucker/anansi/commit/324d2f9b0b5a68e5f050de6771af31a3c97a5ee0))



### [1.2.5](https://github.com/ntucker/anansi/compare/@anansi/babel-preset@1.2.4...@anansi/babel-preset@1.2.5) (2020-07-01)


### 🐛 Bug Fix

* Optional chaining 'Module parse failed' when targetting newer browsers ([55d7c1e](https://github.com/ntucker/anansi/commit/55d7c1e5ba3ab9d8e22567790173ca868b9536ef))


### 📦 Package

* Patch bump on babel plugins ([cc26a5c](https://github.com/ntucker/anansi/commit/cc26a5c4fc1bbb02fc0637875b1cb89389cdf1b7))



### [1.2.4](https://github.com/ntucker/anansi/compare/@anansi/babel-preset@1.2.3...@anansi/babel-preset@1.2.4) (2020-06-28)


### 📦 Package

* Bump babel plugins patch ([bf19938](https://github.com/ntucker/anansi/commit/bf19938109c92f359b6459dc06d4764da3ed1556))



### [1.2.3](https://github.com/ntucker/anansi/compare/@anansi/babel-preset@1.2.2...@anansi/babel-preset@1.2.3) (2020-05-28)


### 📦 Package

* Upgrade to babel 7.10 ([b97dca4](https://github.com/ntucker/anansi/commit/b97dca4dcd2eb02bd65a8377b1fea94b466c97ec))



### [1.2.2](https://github.com/ntucker/anansi/compare/@anansi/babel-preset@1.2.1...@anansi/babel-preset@1.2.2) (2020-05-02)


### 💅 Enhancement

* Make babel-minify an optional peerdep to not polute standard case ([0701f6e](https://github.com/ntucker/anansi/commit/0701f6ed8ae066483e9b5b054e8ceb6b238d2eb9))


### 📦 Package

* Patch bump of runtime, typescript, env ([a84b3af](https://github.com/ntucker/anansi/commit/a84b3afc18d3fac38440a0cfef055e8ce09c1450))



### [1.2.1](https://github.com/ntucker/anansi/compare/@anansi/babel-preset@1.2.0...@anansi/babel-preset@1.2.1) (2020-04-09)


### 🐛 Bug Fix

* Process classes in plain JS files when typescript is enabled ([908023f](https://github.com/ntucker/anansi/commit/908023fe88e03feaefade981b42d46ddcb69fb57))


### 📦 Package

* Bump plugin-transform-typescript, preset-react ([6ae906c](https://github.com/ntucker/anansi/commit/6ae906c747e0f011ea776f1699e61c4c6e907c44))



## [1.2.0](https://github.com/ntucker/anansi/compare/@anansi/babel-preset@1.1.3...@anansi/babel-preset@1.2.0) (2020-03-22)


### 🚀 Features

* Automatically detect webpack target in babel ([#32](https://github.com/ntucker/anansi/issues/32)) ([257b64e](https://github.com/ntucker/anansi/commit/257b64e539c662693d31e1335eade9ad25d5a633))
* Support new babel 7.9 features ([#31](https://github.com/ntucker/anansi/issues/31)) ([99cf988](https://github.com/ntucker/anansi/commit/99cf9885bc4b33eb0b6efcb8598b942ea97cdeb9))



### [1.1.3](https://github.com/ntucker/anansi/compare/@anansi/babel-preset@1.1.2...@anansi/babel-preset@1.1.3) (2020-03-08)


### 📦 Package

* Babel typescript, preset-env ([ec8adcf](https://github.com/ntucker/anansi/commit/ec8adcf96a5001ea734e906d42eb47c6369caaac))
* Bump babel preset env ([d6ee866](https://github.com/ntucker/anansi/commit/d6ee8665cd2f2a7cf864c4d35a30a2b23fe9058d))


### 📝 Documentation

* Add more keywords ([2a080e5](https://github.com/ntucker/anansi/commit/2a080e5ff3b2498297afd2603a51a8700a2e8100))



### [1.1.2](https://github.com/ntucker/anansi/compare/@anansi/babel-preset@1.1.1...@anansi/babel-preset@1.1.2) (2020-02-19)


### 📝 Documentation

* Add badges to readme ([40b161f](https://github.com/ntucker/anansi/commit/40b161f620e6a7db5d09f9f8f344cb86eeee3761))



### [1.1.1](https://github.com/ntucker/anansi/compare/@anansi/babel-preset@1.1.0...@anansi/babel-preset@1.1.1) (2020-02-19)


### 🐛 Bug Fix

* Also include ROOT_PATH_ROOT ([871643f](https://github.com/ntucker/anansi/commit/871643feb36681c46e52fc4fb623f1f230c99168))



## [1.1.0](https://github.com/ntucker/anansi/compare/@anansi/babel-preset@1.0.1...@anansi/babel-preset@1.1.0) (2020-02-18)


### 🚀 Features

* Allow ENV setting for import rewrites ([2563837](https://github.com/ntucker/anansi/commit/256383760709949cb9580407c0f79861ed60baf5))


### 📝 Documentation

* Graduate stage 4 item in readme ([d3f1ac6](https://github.com/ntucker/anansi/commit/d3f1ac6a7690a97aa241ea47ba1c5407e91ece8c))



### [1.0.1](https://github.com/ntucker/anansi/compare/@anansi/babel-preset@1.0.0...@anansi/babel-preset@1.0.1) (2020-02-17)


### 📝 Documentation

* Update 'future language support' notes ([22b2c20](https://github.com/ntucker/anansi/commit/22b2c2087b3e463a3edd4b8f39a6b65ed57e0b46))



## [1.0.0](https://github.com/ntucker/anansi/compare/@anansi/babel-preset@0.26.2...@anansi/babel-preset@1.0.0) (2020-02-16)


### ⚠ 💥 BREAKING CHANGES

* Requires TypeScript 3.8

### 🚀 Features

* Support 'export * as' with TypeScript ([f3d40c8](https://github.com/ntucker/anansi/commit/f3d40c8675162497f048c6e3d60e6023703e6fbc))


### 💅 Enhancement

* Auto detect babel runtime version ([986d32b](https://github.com/ntucker/anansi/commit/986d32bfc0e5b18b688df6446a547c09ddd390bd))



### [0.26.2](https://github.com/ntucker/anansi/compare/@anansi/babel-preset@0.26.1...@anansi/babel-preset@0.26.2) (2020-01-14)


### 📦 Package

* Bump babel plugins ([989eb90](https://github.com/ntucker/anansi/commit/989eb90c177ae8d2d829c5af9411fd873aecd596))



### [0.26.1](https://github.com/ntucker/anansi/compare/@anansi/babel-preset@0.26.0...@anansi/babel-preset@0.26.1) (2020-01-13)


### 💅 Enhancement

* Let preset-env handle dynamic imports ([#20](https://github.com/ntucker/anansi/issues/20)) ([2e15629](https://github.com/ntucker/anansi/commit/2e1562964c6dbff382206949a0858aeba3421831))


### 📦 Package

* Upgrade to babel 7.8 ([2b743a6](https://github.com/ntucker/anansi/commit/2b743a67712ce0f4aeac9728175fe37c12ca9b63))



## [0.26.0](https://github.com/ntucker/anansi/compare/@anansi/babel-preset@0.25.1...@anansi/babel-preset@0.26.0) (2020-01-07)


### 🚀 Features

* Allow namespaces in TypeScript ([915fd49](https://github.com/ntucker/anansi/commit/915fd4991aecbfe1aecd1dcad4cfc62684b7c8df))



### [0.25.1](https://github.com/ntucker/anansi/compare/@anansi/babel-preset@0.25.0...@anansi/babel-preset@0.25.1) (2019-12-19)


### 🐛 Bug Fix

* private-methods must be applied after decorators ([d4bfb25](https://github.com/ntucker/anansi/commit/d4bfb25c7ae9fe026b81d8d64570dcc4c2aa568e))



## [0.25.0](https://github.com/ntucker/anansi/compare/@anansi/babel-preset@0.24.4...@anansi/babel-preset@0.25.0) (2019-12-19)


### 🚀 Features

* Add reactConstantElementsOptions to configure the optimization ([#19](https://github.com/ntucker/anansi/issues/19)) ([5fb14ba](https://github.com/ntucker/anansi/commit/5fb14badc555228cf228670afc599b4dd1ee24f9))



### [0.24.4](https://github.com/ntucker/anansi/compare/@anansi/babel-preset@0.24.3...@anansi/babel-preset@0.24.4) (2019-12-18)


### 🐛 Bug Fix

* Do private methods transform after typescript ([b4a85c9](https://github.com/ntucker/anansi/commit/b4a85c9b9d8ba3a5fed33c3d586b85c5936d5133))



### [0.24.3](https://github.com/ntucker/anansi/compare/@anansi/babel-preset@0.24.2...@anansi/babel-preset@0.24.3) (2019-12-18)


### 📦 Package

* core-js-compat, macros, and preset-env ([754d64d](https://github.com/ntucker/anansi/commit/754d64d0d204249b1a7140c39b34702a086dae1e))



### [0.24.2](https://github.com/ntucker/anansi/compare/@anansi/babel-preset@0.24.1...@anansi/babel-preset@0.24.2) (2019-12-18)


### 🐛 Bug Fix

* Fix order of class transforms and flow ([#18](https://github.com/ntucker/anansi/issues/18)) ([688d7de](https://github.com/ntucker/anansi/commit/688d7de7cdf38ec1b82c271cda03b3454b6b1fbb))
* Storybook with webpack - don't use react-refresh with it ([#17](https://github.com/ntucker/anansi/issues/17)) ([70a4b1f](https://github.com/ntucker/anansi/commit/70a4b1f7180e1a22fa323338504ae5a7cdab338d))



### [0.24.1](https://github.com/ntucker/anansi/compare/@anansi/babel-preset@0.24.0...@anansi/babel-preset@0.24.1) (2019-12-11)


### 📝 Documentation

* Link to monorepo directories in npm repo listing ([b7dc1d5](https://github.com/ntucker/anansi/commit/b7dc1d5b1a6f3b163c9d155e3847c8d079f6b4cf))



## [0.24.0](https://github.com/ntucker/anansi/compare/@anansi/babel-preset@0.23.0...@anansi/babel-preset@0.24.0) (2019-12-09)


### 🚀 Features

* Use react fast-refresh instead of hot-reloader ([#13](https://github.com/ntucker/anansi/issues/13)) ([1ca29a4](https://github.com/ntucker/anansi/commit/1ca29a4d19746e5238771782192e24289abb59b8))



## [0.23.0](https://github.com/ntucker/anansi/compare/@anansi/babel-preset@0.22.1...@anansi/babel-preset@0.23.0) (2019-12-01)


### 🚀 Features

* Add rootPathRoot option ([#12](https://github.com/ntucker/anansi/issues/12)) ([3107577](https://github.com/ntucker/anansi/commit/310757739128fba2e1a1c52fb44a5aabb0b14eeb))



## <small>0.22.1 (2019-11-17)</small>

* docs: Add purpose to babel readme ([aa5e30d](https://github.com/ntucker/anansi/commit/aa5e30d))





## 0.22.0 (2019-11-13)

* internal: Configure changelog tags ([6d752d0](https://github.com/ntucker/anansi/commit/6d752d0))
* feat: Use preset-modules when target is set to esmodules: true (#7) ([553ae53](https://github.com/ntucker/anansi/commit/553ae53)), closes [#7](https://github.com/ntucker/anansi/issues/7)
* enhance: Re-enable plugin-transform-react-constant-elements due to fix ([08b27d1](https://github.com/ntucker/anansi/commit/08b27d1))
