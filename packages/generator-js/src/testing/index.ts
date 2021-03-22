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

  writingPkg() {
    const reactVersion =
      this.config.get('reactMode') === 'legacy' ? 'latest' : 'experimental';
    const pkgJson = {
      devDependencies: {
        jest: 'latest',
        '@types/jest': 'latest',
        'babel-jest': 'latest',
        'ts-jest': 'latest',
        'core-js': 'latest',
        'cross-env': 'latest',
        'react-test-renderer': reactVersion,
      },
      dependencies: {
        '@babel/runtime': 'latest',
        'rest-hooks': 'latest',
        '@rest-hooks/rest': 'latest',
      },
    };

    this.fs.extendJSON(this.destinationPath('package.json'), pkgJson);
  }
}
export = TestingGenerator;
