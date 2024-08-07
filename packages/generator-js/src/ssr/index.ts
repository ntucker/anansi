import { BaseFeatures, BaseOptions } from 'yeoman-generator';

import { BetterGenerator } from '../utils.js';

export default class extends BetterGenerator {
  props?: Record<string, any>;

  constructor(
    args: string | string[],
    options: BaseOptions,
    features: BaseFeatures,
  ) {
    super(args, options, features);
  }

  configuring() {
    this.packageJson.merge(
      this.fs.readJSONTpl(this.templatePath('package.json.tpl')),
    );
  }

  async writingDependencies() {
    await Promise.all([this.addDependencies(['@anansi/cli', '@anansi/core'])]);
  }

  writing() {
    this.fs.copyTpl(
      this.templatePath('src/**'),
      this.destinationPath(this.config.get('rootPath')),
      this.config.getAll(),
      {},
      { globOptions: { dot: true } },
    );
    this.fs.delete(this.destinationPath('index.ejs'));
  }
}
