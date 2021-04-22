import { BetterGenerator, InstallPeersMixin } from '../utils';

module.exports = class extends InstallPeersMixin(BetterGenerator) {
  configuring() {
    this.fs.extendJSONTpl(
      this.templatePath('package.json.tpl'),
      this.destinationPath('package.json'),
    );
  }

  writing() {
    this.fs.copyTpl(
      this.templatePath('.github/**'),
      this.destinationPath('.github'),
      this.config.getAll(),
      {},
      { globOptions: { dot: true } },
    );
  }
};
