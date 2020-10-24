import { BetterGenerator, InstallPeersMixin } from '../utils';

class WebpackGenerator extends InstallPeersMixin(BetterGenerator) {
  props?: Record<string, any>;

  constructor(args: string | string[], options: Record<string, unknown>) {
    super(args, options);
    this.config.set('webpack', true);
  }

  async prompting() {
    const prompts = [
      // TODO: actually do something with this
      {
        type: 'list',
        name: 'style',
        message: 'How would you like to define your styles?',
        default: 'sass',
        choices: [
          {
            name: 'SASS/CSS',
            value: 'sass',
          },
          {
            name: 'Linaria',
            value: 'linaria',
          },
        ],
        store: true,
      },
    ];

    this.props = await this.prompt(prompts);
    this.config.set('style', this?.props?.style);
  }

  configuring() {
    this.fs.extendJSONTpl(
      this.templatePath('package.json.tpl'),
      this.destinationPath('package.json'),
    );
  }

  writing() {
    if (this?.props?.style === 'sass') {
      this.fs.copyTpl(
        this.templatePath('src/style/**'),
        this.destinationPath(this.config.get('rootPath'), 'style'),
        this.config.getAll(),
        {},
        { globOptions: { dot: true } },
      );
    }
    this.fs.copyTpl(
      this.templatePath('webpack.config.js'),
      this.destinationPath('webpack.config.js'),
      this.config.getAll(),
    );
    this.fs.appendTpl(
      this.templatePath('README.md'),
      this.destinationPath('README.md'),
      this.config.getAll(),
    );

    if (this?.props?.style === 'linaria') {
      this.fs.copy(
        this.templatePath('.babelrc.js'),
        this.destinationPath('.babelrc.js'),
      );
      this.fs.appendTpl(
        this.templatePath('.gitignore.tpl'),
        this.destinationPath('.gitignore'),
        this.config.getAll(),
      );
    }
  }

  installConfig() {
    this.installPeers('@anansi/webpack-config', [], { dev: true });
    const devDeps = [
      '@anansi/webpack-config',
      'webpack-cli@4',
      'webpack-dev-server@3',
    ];
    if (this?.props?.style === 'linaria') {
      devDeps.push('linaria');
    }
    this.yarnInstall(devDeps, {
      dev: true,
    });
  }
}
export = WebpackGenerator;
