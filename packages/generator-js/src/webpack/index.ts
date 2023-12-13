import { execa } from 'execa';
import { BaseFeatures, BaseOptions } from 'yeoman-generator';

import { BetterGenerator } from '../utils.js';

export default class WebpackGenerator extends BetterGenerator<WebpackOptions> {
  props?: Record<string, any>;

  constructor(
    args: string | string[],
    options: WebpackOptions,
    features: BaseFeatures,
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
            name: 'SASS/CSS modules',
            value: 'sass',
          },
          {
            name: 'Linaria (CSS-in-JS)',
            value: 'linaria',
          },
        ],
        store: true,
      },
    ];

    this.props = await this.prompt(prompts);
    this.config.set('style', this?.props?.style);

    await this.createCert();
  }

  async createCert() {
    const cwd = this.destinationRoot();
    try {
      await execa(`mkcert localhost 127.0.0.1`, [], {
        cwd,
        shell: true,
      });
      this.config.set('devssl', /*true*/ false); //TODO: figure out how to make this actually work
    } catch (e) {
      this.config.set('devssl', false);
    }
  }

  configuring() {
    this.packageJson.merge(
      this.fs.readJSONTpl(this.templatePath('package.json.tpl')),
    );
    // TODO: Remove once https://github.com/facebook/create-react-app/issues/11773 is fixed
    this.packageJson.merge({
      resolutions: {
        'react-error-overlay': '6.0.9',
      },
    });
  }

  async writingDependencies() {
    await this.addDevDependencies([
      'webpack',
      'webpack-cli',
      'webpack-dev-server',
      '@anansi/webpack-config',
    ]);
    if (!this.config.get('features').includes('SSR')) {
      await this.addDevDependencies(['serve']);
    }
    if (this?.props?.style === 'linaria') {
      await this.addDevDependencies(['@linaria/core', '@linaria/react']);
      if (this.config.get('features')?.includes?.('testing')) {
        await this.addDevDependencies(['@wyw-in-js/babel-preset']);
      }
    } else if (this?.props?.style === 'sass') {
      await this.addDevDependencies(['sass']);
    }
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
      this.fs.copyTpl(
        this.templatePath('.babelrc.js'),
        this.destinationPath('.babelrc.js'),
        this.config.getAll(),
      );
      this.fs.appendTpl(
        this.templatePath('.gitignore.tpl'),
        this.destinationPath('.gitignore'),
        this.config.getAll(),
      );
    }
  }
}

type WebpackOptions = BaseOptions;
