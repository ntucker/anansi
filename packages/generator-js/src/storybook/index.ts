import { BetterGenerator, InstallPeersMixin } from '../utils';

class WebpackGenerator extends InstallPeersMixin(BetterGenerator) {
  constructor(args: string | string[], options: {}) {
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
      this.templatePath('.storybook/config.js'),
      this.destinationPath('.storybook/config.js'),
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
        '@storybook/addon-actions',
        '@storybook/addon-info',
        '@storybook/addon-links',
        '@storybook/addons',
        '@storybook/react',
      ],
      {
        dev: true,
      },
    );
  }
}
export = WebpackGenerator;
