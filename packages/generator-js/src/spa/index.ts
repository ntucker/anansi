import { BaseFeatures, BaseOptions } from 'yeoman-generator';

import { BetterGenerator, resolvePath } from '../utils.js';

export default class extends BetterGenerator {
  props?: Record<string, any>;

  constructor(
    args: string | string[],
    options: BaseOptions,
    features: BaseFeatures,
  ) {
    super(args, options, features);
    this.config.set('badges', '');
    this.config.set('spa', true);
  }

  async initializing() {
    this.composeWith(
      await resolvePath('../webpack', import.meta.url),
      this.options,
    );
    if (this.config.get('features')?.includes('SSR')) {
      this.composeWith(
        await resolvePath('../ssr', import.meta.url),
        this.options,
      );
    }
    if (this.options.branded) {
      this.composeWith(
        await resolvePath('../anansi-splash', import.meta.url),
        this.options,
      );
    }
  }

  configuring() {
    this.packageJson.merge(
      this.fs.readJSONTpl(this.templatePath('package.json.tpl')),
    );
    this.fs.extendJSONTpl(
      this.templatePath('tsconfig.json'),
      this.destinationPath('tsconfig.json'),
    );
    this.fs.copyTpl(
      this.templatePath('eslint.config.mjs'),
      this.destinationPath('eslint.config.mjs'),
    );
    this.fs.extendJSONTpl(
      this.templatePath('.vscode/launch.json'),
      this.destinationPath('.vscode/launch.json'),
    );
    this.fs.extendJSONTpl(
      this.templatePath('.vscode/tasks.json'),
      this.destinationPath('.vscode/tasks.json'),
    );
  }

  async writingDependencies() {
    await Promise.all([
      this.addDevDependencies([
        '@types/react',
        '@types/react-dom',
        '@data-client/test',
        '@types/react-test-renderer',
        'react-test-renderer',
        'react-refresh',
      ]),
      await this.addDependencies([
        '@anansi/router',
        '@data-client/react',
        '@data-client/rest',
        'react',
        'react-dom',
        '@data-client/img',
        'history',
      ]),
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
    this.fs.copyTpl(
      this.templatePath('README.md'),
      this.destinationPath('README.md'),
      this.config.getAll(),
    );

    if (this.config.get('features')?.includes('SSR')) {
      // We don't use RootProvider in SSR config
      this.fs.delete(
        this.destinationPath(this.config.get('rootPath'), 'RootProvider.tsx'),
      );
    }
  }
}
