# Yeoman Generator powering Anansi CLI
[![CircleCI](https://circleci.com/gh/ntucker/anansi.svg?style=shield)](https://circleci.com/gh/ntucker/anansi)
[![npm downloads](https://img.shields.io/npm/dm/@anansi/generator-js.svg?style=flat-square)](https://www.npmjs.com/package/@anansi/generator-js)
[![npm version](https://img.shields.io/npm/v/@anansi/generator-js.svg?style=flat-square)](https://www.npmjs.com/package/@anansi/generator-js)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)


> Fast React Web Apps

Created by [@melissafzhang](https://github.com/melissafzhang) and [@ntucker](https://github.com/ntucker). Feedback and contributions welcome!

[Anansi](https://en.wikipedia.org/wiki/Anansi) (/əˈnɑːnsi/ ə-NAHN-see) is an Akan folktale character. He often takes the shape of a spider and is considered to be the god of all knowledge of stories. Anansi uses his knowledge to help JavaScript developers spin new web projects.

## Installation

It's recommended to use [@anansi/cli](https://www.npmjs.com/package/@anansi/cli) to use this generator.

```bash
npm install -g @anansi/cli yarn
```

Then generate your new project:

```bash
anansi hatch my-app-name
```

This creates a `my-app-name` directory in your current directory and sets up the project there.

## Updates

Features can be incrementally adopted by running sub-generators from an existing project directory.

### E.g., Adding Testing

```shell
cd MyProject
anansi add testing
```

## Sub-Generators

- [base](./src/base#readme)
   - TypeScript
   - Babel
   - Eslint
   - Git
   - VSCode
- [circle](./src/circle#readme)
- [testing](./src/testing#readme)
- [storybook](./src/storybook#readme)
- [library](./src/library#readme)
  - [rollup](./src/rollup#readme)
- [spa](./src/spa#readme)
  - [webpack](./src/webpack#readme)
  - [anansi-splash](./src/anansi-splash#readme)
  - [Reactive Data Client](https://dataclient.io)

## Features

### Basics:

- [x] eslint
- [x] typescript
- [x] jest
- [x] babel
- [x] webpack
- [x] storybook
- [x] stackblitz (for demos)
- [ ] precommit hooks

### React SPA:

- [x] Experimental React concurrent mode
- [x] routing
- [x] data-client

### Library:

- [x] generate library
- [ ] works within monorepo

### Infra:

- [x] PR checks (salus, test, typecheck, linting)
- [x] Build & deploy
- [ ] metrics
- [ ] monitoring (sentry)

## License

Apache-2.0 © Nathaniel Tucker, Melissa Zhang

[npm-image]: https://badge.fury.io/js/%40anansi%2Fgenerator-js.svg
[npm-url]: https://npmjs.com/package/@anansi/generator-js
[circle-image]: https://circleci.com/gh/ntucker/anansi.svg?style=shield
[circle-url]: https://circleci.com/gh/ntucker/anansi
[daviddm-image]: https://david-dm.org/ntucker/anansi.svg?theme=shields.io
[daviddm-url]: https://david-dm.org/ntucker/anansi
