import { BetterGenerator, InstallPeersMixin } from '../utils';

module.exports = class extends InstallPeersMixin(BetterGenerator) {
  props?: Record<string, any>;

  constructor(args: string | string[], options: Record<string, unknown>) {
    super(args, options);
    this.config.set('badges', '');
  }

  async prompting() {
    const prompts = [
      // TODO: actually do something with this
      {
        type: 'list',
        name: 'reactMode',
        message: 'What mode would you like to run React?',
        default: 'legacy',
        choices: [
          {
            name: 'Legacy',
            value: 'legacy',
          },
          {
            name: 'Blocking',
            value: 'blocking',
          },
          {
            name: 'Concurrent',
            value: 'concurrent',
          },
        ],
        store: true,
      },
    ];

    this.props = await this.prompt(prompts);
    this.config.set('reactMode', this?.props?.reactMode);
  }

  initializing() {
    this.composeWith(require.resolve('../webpack'), {});
    if (this.options.branded) {
      this.composeWith(require.resolve('../anansi-splash'), {});
    }
  }

  configuring() {
    this.fs.extendJSONTpl(
      this.templatePath('package.json.tpl'),
      this.destinationPath('package.json'),
    );
    this.fs.extendJSONTpl(
      this.templatePath('tsconfig.json'),
      this.destinationPath('tsconfig.json'),
    );
    this.fs.extendJSONTpl(
      this.templatePath('src/.eslintrc'),
      this.destinationPath('src/.eslintrc'),
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
    this.fs.copyTpl(
      this.templatePath('README.md'),
      this.destinationPath('README.md'),
      this.config.getAll(),
    );
  }

  writingPkg() {
    const reactVersion =
      this.config.get('reactMode') === 'legacy' ? 'latest' : 'experimental';
    const pkgJson = {
      devDependencies: {
        serve: 'latest',
        react: reactVersion,
        'react-dom': reactVersion,
        'react-test-renderer': reactVersion,
        'react-refresh': reactVersion,
        '@types/react': 'latest',
        '@types/react-dom': 'latest',
        '@rest-hooks/test': 'latest',
      },
      dependencies: {
        '@babel/runtime': 'latest',
        'rest-hooks': 'latest',
        '@rest-hooks/rest': 'latest',
      },
    };

    this.fs.extendJSON(this.destinationPath('package.json'), pkgJson);
  }
};
