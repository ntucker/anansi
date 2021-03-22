import { BetterGenerator, InstallPeersMixin } from '../utils';

module.exports = class extends InstallPeersMixin(BetterGenerator) {
  configuring() {
    this.fs.extendJSONTpl(
      this.templatePath('package.json.tpl'),
      this.destinationPath('package.json'),
    );
    this.fs.copyTpl(
      this.templatePath('rollup.config.js'),
      this.destinationPath('rollup.config.js'),
      this.config.getAll(),
    );
  }

  writingPkg() {
    const pkgJson = {
      devDependencies: {
        rollup: 'latest',
        'rollup-plugin-babel': 'latest',
        'rollup-plugin-commonjs': 'latest',
        'rollup-plugin-filesize': 'latest',
        'rollup-plugin-json': 'latest',
        'rollup-plugin-node-resolve': 'latest',
        'rollup-plugin-replace': 'latest',
        'rollup-plugin-terser': 'latest',
      },
    };
    this.fs.extendJSON(this.destinationPath('package.json'), pkgJson);
  }
};
