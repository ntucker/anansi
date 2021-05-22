
### Usage

With [Visual Studio Code](https://code.visualstudio.com), simply press `F5` to start the development server and browser.

#### Run dev:

```bash
yarn start
```

#### Build prod:

`Ctrl+shift+B` in [Visual Studio Code](https://code.visualstudio.com)

```bash
yarn build
```

#### Run prod: (after build)

```bash
yarn start:prod
```

#### Analyze production bundle sizes:

```bash
yarn build:analyze
```

#### Run with [React Profiler](https://reactjs.org/blog/2018/09/10/introducing-the-react-profiler.html):

```bash
yarn build:profile
```

#### Check Packages for duplicates or circular dependencies:

```bash
yarn pkgcheck
```
<% if (storybook) { %>

#### Run with [Storybook](https://storybook.js.org/):

```bash
yarn storybook
```
<% } %>
