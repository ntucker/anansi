import { BetterGenerator, InstallPeersMixin } from '../utils.js';

export default class extends InstallPeersMixin(BetterGenerator) {
  configuring() {
    this.packageJson.merge(
      this.fs.readJSONTpl(this.templatePath('package.json.tpl')),
    );
  }

  writing() {
    this.fs.copyTpl(
      this.templatePath('dot-github/**'),
      this.destinationPath('.github'),
      this.config.getAll(),
      {},
      { globOptions: { dot: true } },
    );
  }
}
