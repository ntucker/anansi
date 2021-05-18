import { BetterGenerator, InstallPeersMixin } from '../utils';

module.exports = class WebpackGenerator extends (
  InstallPeersMixin(BetterGenerator)
) {
  constructor(
    args: string | string[],
    options: Record<string, unknown>,
    features: Record<string, unknown>,
  ) {
    super(args, options, features);
    this.config.set('storybook', true);
  }

  initializing() {
    // SPA will already have webpack
    if (this.options.projectType !== 'SPA') {
      this.composeWith(require.resolve('../webpack'), {});
    }
  }

  configuring() {
    this.packageJson.merge(
      this.fs.readJSONTpl(this.templatePath('package.json.tpl')),
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

  writingDependencies() {
    this.addDevDependencies([
      '@storybook/addon-essentials',
      '@storybook/addon-links',
      '@storybook/addons',
      '@storybook/react',
      '@storybook/builder-webpack5',
    ]);
    // storybook with webpack 5 is a bit tricky
    this.packageJson.merge({
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
    });
  }
};
