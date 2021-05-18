import { BetterGenerator, InstallPeersMixin } from '../utils';

module.exports = class extends InstallPeersMixin(BetterGenerator) {
  configuring() {
    this.packageJson.merge(
      this.fs.readJSONTpl(this.templatePath('package.json.tpl')),
    );
    this.fs.copyTpl(
      this.templatePath('rollup.config.js'),
      this.destinationPath('rollup.config.js'),
      this.config.getAll(),
    );
  }

  writingDependencies() {
    this.addDevDependencies([
      'rollup',
      'rollup-plugin-babel',
      'rollup-plugin-commonjs',
      'rollup-plugin-filesize',
      'rollup-plugin-json',
      'rollup-plugin-node-resolve',
      'rollup-plugin-replace',
      'rollup-plugin-terser',
    ]);
  }
};
