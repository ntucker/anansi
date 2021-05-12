import { BetterGenerator } from '../utils';

class TestingGenerator extends BetterGenerator {
  constructor(args: string | string[], options: Record<string, unknown>) {
    super(args, options);
    this.config.set('testing', true);
  }

  configuring() {
    // extending files
    this.fs.extendJSONTpl(
      this.templatePath('package.json.tpl'),
      this.destinationPath('package.json'),
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

  writing() {
    this.fs.copyTpl(
      this.templatePath('src/**'),
      this.destinationPath(this.config.get('rootPath')),
      this.config.getAll(),
      {},
      { globOptions: { dot: true } },
    );
  }

  writingPkg() {
    const reactVersion =
      this.config.get('reactMode') === 'legacy' ? 'latest' : 'experimental';
    const pkgJson = {
      devDependencies: {
        '@anansi/jest-preset': 'latest',
        jest: 'latest',
        '@types/jest': 'latest',
        'cross-env': 'latest',
        'react-test-renderer': reactVersion,
      },
    };

    this.fs.extendJSON(this.destinationPath('package.json'), pkgJson);
  }
}
export = TestingGenerator;
