# Storybook for Anansi

---

Storybook for Anansi is a UI development environment for the [Anansi framework](https://github.com/ntucker/anansi).
With it, storybook will automatically work with all components you build, even when customizing and extending
your Anansi integration.

![Storybook Screenshot](https://github.com/storybookjs/storybook/blob/main/media/storybook-intro.gif)

Storybook runs outside of your app.
So you can develop UI components in isolation without worrying about app specific dependencies and requirements.

## Getting Started

If you already have an existing Anansi project

```sh
cd my-app
anansi add storybook
```

For new projects

```bash
npm install -g @anansi/cli
```

Then generate your new project:

```bash
anansi hatch my-app-name
```

### Typescript

`npx sb init` will select `.ts` starter stories if your `package.json` has typescript as a dependency. If starting a new project,
run `npm init` and `npm install typescript --save-dev` before initializing storybook to get the typescript starter stories.

---

Storybook also comes with a lot of [addons](https://storybook.js.org/addons) and a great API to customize as you wish.
You can also build a [static version](https://storybook.js.org/docs/html/sharing/publish-storybook) of your Storybook and deploy it anywhere you want.
