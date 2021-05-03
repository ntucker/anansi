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

  writingPkg() {
    const pkgJson = {
      devDependencies: {
        'webpack-cli': 'latest',
        'webpack-dev-server': 'latest',
      },
    };
    if (this?.props?.style === 'linaria') {
      Object.assign(pkgJson.devDependencies, {
        '@linaria/core': '^3.0.0-beta.2',
        '@linaria/react': '^3.0.0-beta.2',
        '@linaria/babel-preset': '^3.0.0-beta.2',
        '@linaria/shaker': '^3.0.0-beta.2',
      });
    }
    if (this.config.get('webpack-version')) {
      Object.assign(pkgJson.devDependencies, {
        webpack: this.config.get('webpack-version'),
        '@anansi/webpack-config': '^5',
      });
    } else {
      Object.assign(pkgJson.devDependencies, {
        webpack: 'latest',
        '@anansi/webpack-config': 'latest',
      });
    }
    this.fs.extendJSON(this.destinationPath('package.json'), pkgJson);
  }
}
export = WebpackGenerator;
