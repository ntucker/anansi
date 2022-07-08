# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

### [0.14.4](https://github.com/ntucker/anansi/compare/@anansi/core@0.14.3...@anansi/core@0.14.4) (2022-07-08)

**Note:** Version bump only for package @anansi/core





### [0.14.3](https://github.com/ntucker/anansi/compare/@anansi/core@0.14.1...@anansi/core@0.14.3) (2022-07-01)


### 🐛 Bug Fix

* Spout type removes provided props from needed props ([#1572](https://github.com/ntucker/anansi/issues/1572)) ([caa25fd](https://github.com/ntucker/anansi/commit/caa25fd73b1b381fea84427a26b44199d4b12314))



### [0.14.2](https://github.com/ntucker/anansi/compare/@anansi/core@0.14.1...@anansi/core@0.14.2) (2022-07-01)


### 🐛 Bug Fix

* Spout type removes provided props from needed props ([#1572](https://github.com/ntucker/anansi/issues/1572)) ([caa25fd](https://github.com/ntucker/anansi/commit/caa25fd73b1b381fea84427a26b44199d4b12314))



### [0.14.1](https://github.com/ntucker/anansi/compare/@anansi/core@0.14.0...@anansi/core@0.14.1) (2022-06-29)


### 🐛 Bug Fix

* Provide rest-hooks package for rest-hooks/ssr ([#1569](https://github.com/ntucker/anansi/issues/1569)) ([1dbb8ae](https://github.com/ntucker/anansi/commit/1dbb8aec39ad3180a96e76827611b05b53d7e02f))


### 📦 Package

* Update babel monorepo to v7.18.6 ([#1566](https://github.com/ntucker/anansi/issues/1566)) ([1634f13](https://github.com/ntucker/anansi/commit/1634f1358de98ba724433ffb462094ad17f88b72))
* Update jest monorepo to ^28.1.2 ([#1567](https://github.com/ntucker/anansi/issues/1567)) ([2e614b1](https://github.com/ntucker/anansi/commit/2e614b1bc54ade3cf78717e7d26d606f5e917888))



## [0.14.0](https://github.com/ntucker/anansi/compare/@anansi/core@0.13.0...@anansi/core@0.14.0) (2022-06-24)


### 🚀 Features

* Add Spout type for easy spout construction ([8f93eb3](https://github.com/ntucker/anansi/commit/8f93eb363f1bfe30d1ac30395df1a3d9fbd9cab3))



## [0.13.0](https://github.com/ntucker/anansi/compare/@anansi/core@0.12.0...@anansi/core@0.13.0) (2022-06-23)


### ⚠ 💥 BREAKING CHANGES

* Must use appSpout; Spouts need two generics

### 💅 Enhancement

* Spouts produce props in both directions ([#1559](https://github.com/ntucker/anansi/issues/1559)) ([898cdde](https://github.com/ntucker/anansi/commit/898cdde500a204a7a4dc155ac7ee51930172380e))



## [0.12.0](https://github.com/ntucker/anansi/compare/@anansi/core@0.11.2...@anansi/core@0.12.0) (2022-06-15)


### 🚀 Features

* Add onError option to laySpouts ([a0ef72b](https://github.com/ntucker/anansi/commit/a0ef72bcaab1440a3d997d21636f81ca767a5a1c))


### 💅 Enhancement

* Don't crash devserver on compiler errors ([3c764e4](https://github.com/ntucker/anansi/commit/3c764e4dd67a57409c64ff7dd144386623a1d93f))


### 📦 Package

* Update babel monorepo to v7.18.5 ([#1545](https://github.com/ntucker/anansi/issues/1545)) ([aaaa8bc](https://github.com/ntucker/anansi/commit/aaaa8bcaa4d9188e9671ee31dc09b7aa9e3ce988))



### [0.11.2](https://github.com/ntucker/anansi/compare/@anansi/core@0.11.1...@anansi/core@0.11.2) (2022-06-13)


### 💅 Enhancement

* Do not override 'unsafe-inline' with nonce for CSP ([cfbd2bd](https://github.com/ntucker/anansi/commit/cfbd2bdfa69ae97ef2db6a824496888420251371))
* Use 'text' to get inline JSON ([9ecdb07](https://github.com/ntucker/anansi/commit/9ecdb074d01e6f09c28a685433105cf0d6f711cc))


### 📦 Package

* Update `webpack-cli` to v4.10.0 ([#1543](https://github.com/ntucker/anansi/issues/1543)) ([298cb01](https://github.com/ntucker/anansi/commit/298cb018db2975fb5c926c48d2145d7c1f4515b9))



### [0.11.1](https://github.com/ntucker/anansi/compare/@anansi/core@0.11.0...@anansi/core@0.11.1) (2022-06-13)


### 🐛 Bug Fix

* Use call user-config devServer.setupMiddleware ([99acd8c](https://github.com/ntucker/anansi/commit/99acd8c9386bfc338ef8733d19a734b2a8be21dd))



## [0.11.0](https://github.com/ntucker/anansi/compare/@anansi/core@0.10.0...@anansi/core@0.11.0) (2022-06-12)


### 🚀 Features

* Add CSP support ([#1541](https://github.com/ntucker/anansi/issues/1541)) ([e8a7415](https://github.com/ntucker/anansi/commit/e8a7415db892d725b76a2d7d451670437d6fb8eb))


### 💅 Enhancement

* Multi-module server side devserver ([b1b6f87](https://github.com/ntucker/anansi/commit/b1b6f873f2a50a9af05683a80d587ac87d90f8f9))



## [0.10.0](https://github.com/ntucker/anansi/compare/@anansi/core@0.9.0...@anansi/core@0.10.0) (2022-06-09)


### 🚀 Features

* add router onChange() ([5c981ed](https://github.com/ntucker/anansi/commit/5c981ed587b55a80fd4f604fc24fb143d2355a06))


### 💅 Enhancement

* Do require cache invalidation ourselves ([22b4e4c](https://github.com/ntucker/anansi/commit/22b4e4c2e4ce3d7de999813bd4e9397e770fe788))
* Improve devserver node 'require' reliability ([#1538](https://github.com/ntucker/anansi/issues/1538)) ([96b6a54](https://github.com/ntucker/anansi/commit/96b6a54562b97f116fc987b41fbf7547770debc8))


### 🐛 Bug Fix

* rootId is optional ([ff43166](https://github.com/ntucker/anansi/commit/ff43166d457ac93ffca2eae0738d81e734b6936e))
* SSR hot-reloading ([9809ad5](https://github.com/ntucker/anansi/commit/9809ad5798e9082554f0358fcd9c301a87e4acbf))


### 📦 Package

* Move compression to correct package ([1ce18ba](https://github.com/ntucker/anansi/commit/1ce18ba9d7dc4d04682184bc1fa74354684294bb))
* Update all non-major dependencies ([#1531](https://github.com/ntucker/anansi/issues/1531)) ([2677241](https://github.com/ntucker/anansi/commit/26772415c2763f35c1720a08bb4b5417214f20d3))
* Update jest monorepo to ^28.1.1 ([#1534](https://github.com/ntucker/anansi/issues/1534)) ([b73dea2](https://github.com/ntucker/anansi/commit/b73dea2ee14f914bdbca189000265693d7fb112f))



## [0.9.0](https://github.com/ntucker/anansi/compare/@anansi/core@0.8.0...@anansi/core@0.9.0) (2022-05-29)


### 🚀 Features

* --serveProxy: [non-dev] uses webpack proxy config ([774f826](https://github.com/ntucker/anansi/commit/774f82646542d8acfcb0ddceb6fc75fcc2851a01))
* Add option to serve assets with production server ([bfb20eb](https://github.com/ntucker/anansi/commit/bfb20eb1564fc2c6b72fea79d0722ac6186797fe))


### 💅 Enhancement

* Handle root asset path ([a770c77](https://github.com/ntucker/anansi/commit/a770c77c4775b09ff86f26cfd5983eab5d211f74))


### 🐛 Bug Fix

* documentSpout options type ([6707d35](https://github.com/ntucker/anansi/commit/6707d3592f7f0ab772a10d623d1d765a9301c3ae))



## [0.8.0](https://github.com/ntucker/anansi/compare/@anansi/core@0.7.4...@anansi/core@0.8.0) (2022-05-29)


### 🚀 Features

* Add anansi serve command ([#1525](https://github.com/ntucker/anansi/issues/1525)) ([ac5a396](https://github.com/ntucker/anansi/commit/ac5a396f9640ce18058813c1594d49367a8aa468))
* Add charSet option to documentSpout ([51d3168](https://github.com/ntucker/anansi/commit/51d31681d27144d06b8ed4c7da9aae43fd10f12b))
* Add production node service ([bceeb56](https://github.com/ntucker/anansi/commit/bceeb56c23c8f8c3dc4a15d35dc8877f277e3d2f))
* Handle devserver proxy ([e7c5b38](https://github.com/ntucker/anansi/commit/e7c5b38cdb60b236db15ffb28622889b0b771515))



### [0.7.4](https://github.com/ntucker/anansi/compare/@anansi/core@0.7.3...@anansi/core@0.7.4) (2022-05-28)


### 💅 Enhancement

* Stall SSR requests until build is ready ([fe2616a](https://github.com/ntucker/anansi/commit/fe2616ac2d957f7243310d896f4a2ad5cb7d910e))



### [0.7.3](https://github.com/ntucker/anansi/compare/@anansi/core@0.7.2...@anansi/core@0.7.3) (2022-05-28)


### 💅 Enhancement

* Require, then import fresh ([7de7d8d](https://github.com/ntucker/anansi/commit/7de7d8d73e533b69bdf78698965121a35375692c))



### [0.7.2](https://github.com/ntucker/anansi/compare/@anansi/core@0.7.1...@anansi/core@0.7.2) (2022-05-28)


### 💅 Enhancement

* More error handling ([129d444](https://github.com/ntucker/anansi/commit/129d44407ac3ea9838e240d82f774c73100cc9da))



### [0.7.1](https://github.com/ntucker/anansi/compare/@anansi/core@0.7.0...@anansi/core@0.7.1) (2022-05-28)


### 💅 Enhancement

* Do not use additional express server for dev ([ce29cbb](https://github.com/ntucker/anansi/commit/ce29cbb0b8547b736a31f9bac6309338b6114bae))
* Target current node for server devbuild ([262bd1e](https://github.com/ntucker/anansi/commit/262bd1e79d56dacdb4114d8ea959d819df16b687))


### 🐛 Bug Fix

* SSR hot reloading ([3b08106](https://github.com/ntucker/anansi/commit/3b081066463020fdbef2c01efd4922d09e02d8aa))



## [0.7.0](https://github.com/ntucker/anansi/compare/@anansi/core@0.6.1...@anansi/core@0.7.0) (2022-05-28)


### 🚀 Features

* env.entrypath override ([a918d32](https://github.com/ntucker/anansi/commit/a918d3247c22ea00d0e1d5395553752280d32d99))


### 💅 Enhancement

* Improve route asset identification ([c07e9a2](https://github.com/ntucker/anansi/commit/c07e9a29935e0e24f815371ad6610bed77da967e))


### 📦 Package

* Update babel monorepo to v7.18.2 ([#1520](https://github.com/ntucker/anansi/issues/1520)) ([e0fe514](https://github.com/ntucker/anansi/commit/e0fe5142b0c308aff24b86faef6d70084c80691f))



### [0.6.1](https://github.com/ntucker/anansi/compare/@anansi/core@0.6.0...@anansi/core@0.6.1) (2022-05-24)


### 🐛 Bug Fix

* Don't error with 'React currently only supports piping to one writable stream' ([cf55fdb](https://github.com/ntucker/anansi/commit/cf55fdb82ee158e26ee596f86db0231faa8e98f5))



## [0.6.0](https://github.com/ntucker/anansi/compare/@anansi/core@0.5.2...@anansi/core@0.6.0) (2022-05-22)


### 🚀 Features

* Return router in spout ([dfbb685](https://github.com/ntucker/anansi/commit/dfbb68577e05216178671262db488d8aab55021e))



### [0.5.2](https://github.com/ntucker/anansi/compare/@anansi/core@0.5.1...@anansi/core@0.5.2) (2022-05-21)

**Note:** Version bump only for package @anansi/core





### [0.5.1](https://github.com/ntucker/anansi/compare/@anansi/core@0.5.0...@anansi/core@0.5.1) (2022-05-20)


### 📦 Package

* Update babel monorepo ([#1515](https://github.com/ntucker/anansi/issues/1515)) ([9d51b13](https://github.com/ntucker/anansi/commit/9d51b13218a67c17cfef56a1be88ac4af7933d03))



## [0.5.0](https://github.com/ntucker/anansi/compare/@anansi/core@0.4.4...@anansi/core@0.5.0) (2022-05-18)


### 🚀 Features

* Add commonjs bundles ([#1508](https://github.com/ntucker/anansi/issues/1508)) ([3f1f5a2](https://github.com/ntucker/anansi/commit/3f1f5a2f881d3e314d9fd08d63607e0c8dbd34d1))


### 💅 Enhancement

* Ensure output works without WEBPACK_PUBLIC_HOST set ([1df3f57](https://github.com/ntucker/anansi/commit/1df3f57cf0d3966a371e89f8c2333f3f29e23b65))
* Only hydrate body content ([1a6412c](https://github.com/ntucker/anansi/commit/1a6412c2e2b55b176fa0491228888490e45de98f))



### [0.4.4](https://github.com/ntucker/anansi/compare/@anansi/core@0.4.3...@anansi/core@0.4.4) (2022-05-18)


### 💅 Enhancement

* Supress hydration warnings in head for stackblitz compat ([38ac992](https://github.com/ntucker/anansi/commit/38ac99237af30d97408fb23bfb95b3bbe5384a03))



### [0.4.3](https://github.com/ntucker/anansi/compare/@anansi/core@0.4.2...@anansi/core@0.4.3) (2022-05-18)


### 💅 Enhancement

* Use relative asset paths ([799b69e](https://github.com/ntucker/anansi/commit/799b69e52394edc26290b9f01ff60ad772f739da))



### [0.4.2](https://github.com/ntucker/anansi/compare/@anansi/core@0.4.1...@anansi/core@0.4.2) (2022-05-18)

**Note:** Version bump only for package @anansi/core





### [0.4.1](https://github.com/ntucker/anansi/compare/@anansi/core@0.4.0...@anansi/core@0.4.1) (2022-05-18)


### 🐛 Bug Fix

* Server compilation ([d8a1c9a](https://github.com/ntucker/anansi/commit/d8a1c9a05718cde13c99d56dcc79a5cc823fa6bb))



## [0.4.0](https://github.com/ntucker/anansi/compare/@anansi/core@0.3.1...@anansi/core@0.4.0) (2022-05-17)


### 🚀 Features

* SSR uses webpack devserver and responds to code changes ([#1504](https://github.com/ntucker/anansi/issues/1504)) ([25803a5](https://github.com/ntucker/anansi/commit/25803a5b49316c7e73846efbe774d5cbe3eb28a3))


### 📦 Package

* Update babel monorepo to v7.17.12 ([#1505](https://github.com/ntucker/anansi/issues/1505)) ([cdf449c](https://github.com/ntucker/anansi/commit/cdf449c234da377c6968847a500ef77d7340c5bb))
* Update jest monorepo to ^28.1.0 ([#1493](https://github.com/ntucker/anansi/issues/1493)) ([7cc9df4](https://github.com/ntucker/anansi/commit/7cc9df4a439a0743bf243a5ad8393c62c067aa44))



### [0.3.1](https://github.com/ntucker/anansi/compare/@anansi/core@0.3.0...@anansi/core@0.3.1) (2022-05-04)


### 📦 Package

* Update all non-major dependencies ([#1490](https://github.com/ntucker/anansi/issues/1490)) ([c333a59](https://github.com/ntucker/anansi/commit/c333a595dd912e67f64e22b4c4af58e825e75cad))



## [0.3.0](https://github.com/ntucker/anansi/compare/@anansi/core@0.2.2...@anansi/core@0.3.0) (2022-04-30)


### ⚠ 💥 BREAKING CHANGES

* Requires TypeScript 4.3 and Jest 28

Co-authored-by: Renovate Bot <bot@renovateapp.com>
Co-authored-by: Nathaniel Tucker <me@ntucker.me>

### 📦 Package

* Update babel monorepo to v7.17.10 ([#1487](https://github.com/ntucker/anansi/issues/1487)) ([4cae6b5](https://github.com/ntucker/anansi/commit/4cae6b50855c2307ba1cf4e7293579d51614f978))
* Update jest monorepo to ^28.0.2 ([#1484](https://github.com/ntucker/anansi/issues/1484)) ([0792dbf](https://github.com/ntucker/anansi/commit/0792dbf9e9fe2c6b22eb5414ec2a7c7aaf1d9e48))
* Update jest monorepo to ^28.0.3 ([#1486](https://github.com/ntucker/anansi/issues/1486)) ([a5b325a](https://github.com/ntucker/anansi/commit/a5b325af0166351f40c421d4a3a0bef59f6d1218))
* Update jest monorepo to v28 (major) ([#1479](https://github.com/ntucker/anansi/issues/1479)) ([06338de](https://github.com/ntucker/anansi/commit/06338de8bf871945dac4b6b35155e49fd062bfdb))



### [0.2.2](https://github.com/ntucker/anansi/compare/@anansi/core@0.2.1...@anansi/core@0.2.2) (2022-04-22)


### 💅 Enhancement

* Indicate compilation errors ([82682b9](https://github.com/ntucker/anansi/commit/82682b9ed22686eb58f5421b6043852d2006842e))



### [0.2.1](https://github.com/ntucker/anansi/compare/@anansi/core@0.2.0...@anansi/core@0.2.1) (2022-04-18)


### 🐛 Bug Fix

* Make start-anansi command executable in bash ([4ae313c](https://github.com/ntucker/anansi/commit/4ae313c7d2137df63e74e5a8064237189c04adc8))



## 0.2.0 (2022-04-18)


### 🚀 Features

* React 18 partial hydration SSR ([#1427](https://github.com/ntucker/anansi/issues/1427)) ([afe12fe](https://github.com/ntucker/anansi/commit/afe12fea2e0a0f9d9a759c2f533ab925ba0e8957)), closes [#1456](https://github.com/ntucker/anansi/issues/1456)


### 📦 Package

* Update all non-major dependencies ([#1472](https://github.com/ntucker/anansi/issues/1472)) ([903e452](https://github.com/ntucker/anansi/commit/903e452e58dfacb14808d23e1aa883d6126dae1f))
