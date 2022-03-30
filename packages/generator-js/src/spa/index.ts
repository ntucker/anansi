import { BetterGenerator, InstallPeersMixin } from '../utils';

module.exports = class extends InstallPeersMixin(BetterGenerator) {
  props?: Record<string, any>;

  constructor(
    args: string | string[],
    options: Record<string, unknown>,
    features: Record<string, unknown>,
  ) {
    super(args, options, features);
    this.config.set('badges', '');
    this.config.set('spa', true);
  }

  async prompting() {
    const prompts = [
      // TODO: actually do something with this
      {
        type: 'list',
        name: 'reactMode',
        message:
          'What version of React?\nMore info: https://reactjs.org/blog/2022/03/29/react-v18.html',
        default: 'concurrent',
        choices: [
          {
            name: 'Concurrent (v18.0)',
            value: 'concurrent',
          },
          {
            name: 'Legacy (v17.0)',
            value: 'legacy',
          },
        ],
        store: true,
      },
    ];

    this.props = await this.prompt(prompts);
    this.config.set('reactMode', this?.props?.reactMode);
  }

  initializing() {
    this.composeWith(require.resolve('../webpack'), this.options);
    if (this.options.branded) {
      this.composeWith(require.resolve('../anansi-splash'), this.options);
    }
  }

  configuring() {
    this.packageJson.merge(
      this.fs.readJSONTpl(this.templatePath('package.json.tpl')),
    );
    this.fs.extendJSONTpl(
      this.templatePath('tsconfig.json'),
      this.destinationPath('tsconfig.json'),
    );
    this.fs.extendJSONTpl(
      this.templatePath('src/.eslintrc'),
      this.destinationPath('src/.eslintrc'),
    );
    this.fs.extendJSONTpl(
      this.templatePath('.vscode/launch.json'),
      this.destinationPath('.vscode/launch.json'),
    );
    this.fs.extendJSONTpl(
      this.templatePath('.vscode/tasks.json'),
      this.destinationPath('.vscode/tasks.json'),
    );
  }

  async writingDependencies() {
    const reactVersion =
      // falsy is same as 'resolve latest'
      this.config.get('reactMode') === 'legacy' ? '' : '18.0.0';

    const dependencies: Record<string, string> = {
      'rest-hooks': '',
      '@rest-hooks/rest': '',
      '@rest-hooks/core': '',
      '@rest-hooks/endpoint': '',
      react: reactVersion,
      'react-dom': reactVersion,
    };
    if (reactVersion === '18.0.0') {
      dependencies['@rest-hooks/img'] = '';
    }
    await Promise.all([
      this.addDevDependencies([
        'serve',
        '@types/react',
        '@types/react-dom',
        '@rest-hooks/test',
      ]),
      await this.addDevDependencies({
        'react-test-renderer': reactVersion,
        'react-refresh':
          this.config.get('reactMode') === 'legacy' ? '' : '^0.11.0',
      }),
      await this.addDependencies(dependencies),
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
    this.fs.copyTpl(
      this.templatePath('README.md'),
      this.destinationPath('README.md'),
      this.config.getAll(),
    );
  }
};
