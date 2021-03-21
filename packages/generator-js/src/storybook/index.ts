import { BetterGenerator, InstallPeersMixin } from '../utils';

class WebpackGenerator extends InstallPeersMixin(BetterGenerator) {
  constructor(args: string | string[], options: Record<string, unknown>) {
    super(args, options);
    this.config.set('storybook', true);
  }

  configuring() {
    this.fs.extendJSONTpl(
      this.templatePath('package.json.tpl'),
      this.destinationPath('package.json'),
    );
    this.fs.extendJSONTpl(
      this.templatePath('tsconfig.json'),
      this.destinationPath('tsconfig.json'),
    );
    this.fs.copyTpl(
      this.templatePath('.storybook/.babelrc.js'),
      this.destinationPath('.storybook/.babelrc.js'),
      this.config.getAll(),
    );
    this.fs.copyTpl(
      this.templatePath('.storybook/main.js'),
      this.destinationPath('.storybook/main.js'),
      this.config.getAll(),
    );
    this.fs.copyTpl(
      this.templatePath('.storybook/preview.tsx'),
      this.destinationPath('.storybook/preview.tsx'),
      this.config.getAll(),
    );
    if (this.config.get('webpack')) {
      this.fs.copyTpl(
        this.templatePath('.storybook/webpack.config.js'),
        this.destinationPath('.storybook/webpack.config.js'),
        this.config.getAll(),
      );
    }
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

  installConfig() {
    this.yarnInstall(
      [
        '@storybook/addon-essentials@6.2.0-rc.6',
        '@storybook/addon-links@6.2.0-rc.6',
        '@storybook/addons@6.2.0-rc.6',
        '@storybook/react@6.2.0-rc.6',
        '@storybook/builder-webpack5@6.2.0-rc.6',
      ],
      {
        dev: true,
      },
    );
  }
}
export = WebpackGenerator;
