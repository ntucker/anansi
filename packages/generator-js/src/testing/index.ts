import { BetterGenerator } from '../utils';

class TestingGenerator extends BetterGenerator {
  constructor(args: string | string[], options: {}) {
    super(args, options);
    this.config.set('testing', true);
  }

  configuring() {
    // extending files
    this.fs.extendJSONTpl(
      this.templatePath('package.json'),
      this.destinationPath('package.json'),
    );
    this.fs.extendJSONTpl(
      this.templatePath('tsconfig.json'),
      this.destinationPath('tsconfig.json'),
    );
    (this.fs as any).append(
      this.destinationPath('.gitignore'),
      this.fs.read(this.templatePath('.npmignore')),
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
    this.fs.copyTpl(
      this.templatePath('scripts/**'),
      this.destinationRoot() + '/scripts',
      this.config.getAll(),
      {},
      { globOptions: { dot: true } },
    );
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

  installTestUtils() {
    this.yarnInstall(
      ['jest', '@types/jest', 'babel-jest', 'ts-jest', 'core-js', 'cross-env'],
      { dev: true },
    );
  }
}
export = TestingGenerator;
