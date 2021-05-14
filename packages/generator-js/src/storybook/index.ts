import { BetterGenerator, InstallPeersMixin } from '../utils';

class WebpackGenerator extends InstallPeersMixin(BetterGenerator) {
  constructor(args: string | string[], options: Record<string, unknown>) {
    super(args, options);
    this.config.set('storybook', true);
  }

  initializing() {
    // SPA will already have webpack
    if (this.options.projectType !== 'SPA') {
      this.composeWith(require.resolve('../webpack'), {});
    }
  }

  configuring() {
    this.fs.extendJSONTpl(
      this.templatePath('package.json.tpl'),
      this.destinationPath('package.json'),
    );
    this.fs.copyTpl(
      this.templatePath('.storybook/.babelrc.js'),
      this.destinationPath('.storybook/.babelrc.js'),
      this.config.getAll(),
    );
    this.fs.copyTpl(
      this.templatePath('.storybook/main.js'),
      this.destinationPath('.storybook/main.js'),
      this.config.getAll(),
    );
    // only use rest hooks by default for applications
    if (this.options.projectType === 'SPA') {
      this.fs.copyTpl(
        this.templatePath('.storybook/preview.tsx'),
        this.destinationPath('.storybook/preview.tsx'),
        this.config.getAll(),
      );
    }
    if (this.config.get('webpack')) {
      this.fs.copyTpl(
        this.templatePath('.storybook/webpack.config.js'),
        this.destinationPath('.storybook/webpack.config.js'),
        this.config.getAll(),
      );
    }
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
    const pkgJson = {
      devDependencies: {
        '@storybook/addon-essentials': '^6.2.0',
        '@storybook/addon-links': '^6.2.0',
        '@storybook/addons': '^6.2.0',
        '@storybook/react': '^6.2.0',
        '@storybook/builder-webpack5': '^6.2.0',
      },
      // storybook with webpack 5 is a bit tricky
      resolutions: {
        '@types/webpack': '^5.0.0',
        immer: '^8.0.1',
        webpack: '^5.35.0',
        'css-loader': '^5.2.4',
        'dotenv-webpack': '^6.0.0',
        'html-webpack-plugin': '^5.0.0',
        'style-loader': '^2.0.0',
        'terser-webpack-plugin': '^5.0.0',
        'webpack-virtual-modules': '^0.4.2',
      },
    };
    this.fs.extendJSON(this.destinationPath('package.json'), pkgJson);
  }
}
export = WebpackGenerator;
