import { BetterGenerator, InstallPeersMixin } from '../utils';

module.exports = class extends InstallPeersMixin(BetterGenerator) {
  configuring() {
    this.fs.extendJSONTpl(
      this.templatePath('package.json'),
      this.destinationPath('package.json'),
    );
    this.fs.copyTpl(
      this.templatePath('rollup.config.js'),
      this.destinationPath('rollup.config.js'),
      this.config.getAll(),
    );
  }

  installDev() {
    this.yarnInstall(
      [
        'rollup',
        'rollup-plugin-babel',
        'rollup-plugin-commonjs',
        'rollup-plugin-filesize',
        'rollup-plugin-json',
        'rollup-plugin-node-resolve',
        'rollup-plugin-replace',
        'rollup-plugin-terser',
      ],
      { dev: true },
    );
  }
};
