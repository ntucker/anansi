import { BetterGenerator } from '../utils';

module.exports = class TestingGenerator extends BetterGenerator {
  constructor(
    args: string | string[],
    options: Record<string, unknown>,
    features: Record<string, unknown>,
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
    (this.fs as any).append(
      this.destinationPath('.eslintignore'),
      this.fs.read(this.templatePath('.eslintignore')),
    );

    // new files
    this.fs.copyTpl(
      this.templatePath('jest.config.js'),
      this.destinationPath('jest.config.js'),
      this.config.getAll(),
    );
  }

  async writingDependencies() {
    const reactVersion =
      this.config.get('reactMode') === 'legacy' ? 'latest' : 'experimental';
    await this.addDevDependencies([
      '@anansi/jest-preset',
      'jest',
      '@types/jest',
      'cross-env',
    ]);
    await this.addDevDependencies({
      'react-test-renderer': reactVersion,
    });
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
};
