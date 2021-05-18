import { BetterGenerator, InstallPeersMixin } from '../utils';

module.exports = class WebpackGenerator extends (
  InstallPeersMixin(BetterGenerator)
) {
  props?: Record<string, any>;

  constructor(
    args: string | string[],
    options: Record<string, unknown>,
    features: Record<string, unknown>,
  ) {
    super(args, options, features);
    this.config.set('webpack', true);
  }

  async prompting() {
    const prompts = [
      // TODO: actually do something with this
      {
        type: 'list',
        name: 'style',
        message:
          'SCSS with CSS modules and Linaria can both be used for styling.\nWhich would you like in the generated example?',
        default: 'linaria',
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
    this.packageJson.merge(
      this.fs.readJSONTpl(this.templatePath('package.json.tpl')),
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
    this.fs.copy(
      this.templatePath('index.ejs'),
      this.destinationPath('index.ejs'),
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

  writingDependencies() {
    this.addDevDependencies(['webpack', 'webpack-cli', 'webpack-dev-server']);
    if (this?.props?.style === 'linaria') {
      this.addDevDependencies([
        '@linaria/core',
        '@linaria/react',
        '@linaria/babel-preset',
        '@linaria/shaker',
      ]);
    }
    if (this.config.get('webpack-version')) {
      this.addDevDependencies({
        webpack: this.config.get('webpack-version'),
        '@anansi/webpack-config': '^5',
      });
    } else {
      this.addDevDependencies(['webpack', '@anansi/webpack-config']);
    }
  }
};
