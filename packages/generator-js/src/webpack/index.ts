import { BetterGenerator, InstallPeersMixin } from '../utils';

class WebpackGenerator extends InstallPeersMixin(BetterGenerator) {
  constructor(args: string | string[], options: {}) {
    super(args, options);
    this.config.set('webpack', true);
  }

  configuring() {
    this.fs.extendJSONTpl(
      this.templatePath('package.json'),
      this.destinationPath('package.json'),
    );
  }

  writing() {
    this.fs.copyTpl(
      this.templatePath('webpack.config.js'),
      this.destinationPath('webpack.config.js'),
      this.config.getAll(),
    );
    this.fs.appendTpl(
      this.templatePath('README.md'),
      this.destinationPath('README.md'),
      this.config.getAll(),
    );
  }

  installConfig() {
    this.installPeers('@anansi/webpack-config', [], { dev: true });
    this.yarnInstall(['@anansi/webpack-config', 'webpack-cli'], {
      dev: true,
    });
  }
}
export = WebpackGenerator;
