# 🕷 Anansi

> Production ready, developer friendly. Opinionated yet extensible.

[Anansi](https://en.wikipedia.org/wiki/Anansi) (/əˈnɑːnsi/ ə-NAHN-see) is an Akan folktale character. He often takes the shape of a spider and is considered to be the god of all knowledge of stories. Anansi uses his knowledge to help JavaScript developers spin new web projects.

## Motivation

- Modular
- Upgradable
- Best Practices
  - Get started fast
  - Quick development iteration
  - Optimized production deploys
- Batteries included - support the best of the ecosystem out of the box


## Installation

First, install [Yeoman](http://yeoman.io), [yarn](https://yarnpkg.com) and @anansi/generator-js using [npm](https://www.npmjs.com/) (we assume you have pre-installed [node.js](https://nodejs.org/)).

```bash
brew install yarn
npm install -g yo @anansi/generator-js
```

Then generate your new project:


```bash
hatch-anansi my-app-name
```

This creates a `my-app-name` directory in your current directory and sets up the project there.

## Updates

Features can be incrementally adopted by running sub-generators from an existing project directory.

### E.g., Adding Testing

```shell
cd MyProject
yo @anansi/js:testing
```
