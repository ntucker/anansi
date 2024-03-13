import { BaseFeatures, BaseOptions } from 'yeoman-generator';

import { BetterGenerator, resolvePath } from '../utils.js';

export default class StorybookGenerator extends BetterGenerator<StorybookOptions> {
  constructor(
    args: string | string[],
    options: StorybookOptions,
    features: BaseFeatures,
  ) {
    super(args, options, features);
    this.config.set('storybook', true);
  }

  async initializing() {
    // SPA will already have webpack
    if (this.options.projectType !== 'SPA') {
      this.composeWith(
        await resolvePath('../webpack', import.meta.url),
        this.options,
      );
    }
  }

  configuring() {
    this.packageJson.merge(
      this.fs.readJSONTpl(this.templatePath('package.json.tpl')),
    );

    this.fs.copyTpl(
      this.templatePath('.storybook/main.js'),
      this.destinationPath('.storybook/main.js'),
      this.config.getAll(),
    );
    // only use reactive data client by default for applications
    if (this.options.projectType === 'SPA') {
      this.fs.copyTpl(
        this.templatePath('.storybook/preview.tsx'),
        this.destinationPath('.storybook/preview.tsx'),
        this.config.getAll(),
      );
    }
  }

  async writingDependencies() {
    await this.addDevDependencies([
      'storybook',
      '@storybook/addon-essentials',
      '@storybook/addon-links',
      '@storybook/react',
      '@anansi/storybook',
    ]);
  }

  writing() {
    this.fs.copyTpl(
      this.templatePath('src/**'),
      this.destinationPath(this.config.get('rootPath')),
      this.config.getAll(),
      {},
      { globOptions: { dot: true } },
    );
  }
}

type StorybookOptions = BaseOptions & { projectType: string };
