import { BaseFeatures, BaseOptions } from 'yeoman-generator';

import { BetterGenerator } from '../utils.js';

export default class TestingGenerator extends BetterGenerator {
  constructor(
    args: string | string[],
    options: BaseOptions,
    features: BaseFeatures,
  ) {
    super(args, options, features);
    this.config.set('testing', true);
  }

  configuring() {
    // extending files
    this.packageJson.merge(
      this.fs.readJSONTpl(this.templatePath('package.json.tpl')),
    );
    this.fs.extendJSONTpl(
      this.templatePath('tsconfig.json'),
      this.destinationPath('tsconfig.json'),
    );
    (this.fs as any).append(
      this.destinationPath('.gitignore'),
      this.fs.read(this.templatePath('.gitignore.tpl')),
    );

    // new files
    this.fs.copyTpl(
      this.templatePath('jest.config.js'),
      this.destinationPath('jest.config.js'),
      this.config.getAll(),
    );
  }

  async writingDependencies() {
    await Promise.all([
      await this.addDevDependencies([
        '@anansi/jest-preset',
        'jest',
        '@types/jest',
        '@testing-library/react',
        '@testing-library/dom',
        'jest-environment-jsdom',
      ]),
    ]);
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
}
