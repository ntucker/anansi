import { BaseFeatures, BaseOptions } from 'yeoman-generator';

import { BetterGenerator } from '../utils.js';

export default class extends BetterGenerator {
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

  async writingDependencies() {
    await this.addDevDependencies({ rollup: '2' });
    await this.addDevDependencies([
      'rollup-plugin-babel',
      'rollup-plugin-commonjs',
      'rollup-plugin-filesize',
      'rollup-plugin-json',
      'rollup-plugin-node-resolve',
      'rollup-plugin-replace',
      'rollup-plugin-terser',
    ]);
  }
}
