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
    this.config.set('reactMode', this.props.reactMode);
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

  installServe() {
    this.yarnInstall(['serve'], { dev: true });
  }

  installReact() {
    if (this.config.get('reactMode') === 'legacy') {
      this.yarnInstall(['react', 'react-dom']);
    } else {
      this.yarnInstall(['react@experimental', 'react-dom@experimental']);
    }
    this.yarnInstall(['@types/react', '@types/react-dom'], { dev: true });
  }

  installRestHooks() {
    this.yarnInstall(['rest-hooks@beta', '@rest-hooks/rest']);
  }
};
