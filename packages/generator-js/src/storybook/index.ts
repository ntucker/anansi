import { BetterGenerator, InstallPeersMixin, resolvePath } from '../utils.js';

export default class WebpackGenerator extends InstallPeersMixin(
  BetterGenerator,
) {
  constructor(
    args: string | string[],
    options: Record<string, unknown>,
    features: Record<string, unknown>,
  ) {
    super(args, options, features);
    this.config.set('storybook', true);
  }

  async initializing() {
    // SPA will already have webpack
    if (this.options.projectType !== 'SPA') {
      this.composeWith(
        await resolvePath('../webpack', import.meta.url),
        this.options,
      );
    }
  }

  configuring() {
    this.packageJson.merge(
      this.fs.readJSONTpl(this.templatePath('package.json.tpl')),
    );
    // storybook with webpack 5 is a bit tricky
    this.packageJson.merge({
      resolutions: {
        '@types/webpack': '^5.0.0',
        immer: '^9.0.0',
        webpack: '^5.73.0',
        'css-loader': '^6.0.0',
        'dotenv-webpack': '^8.0.0',
        'html-webpack-plugin': '^5.0.0',
        'style-loader': '^3.0.0',
        'terser-webpack-plugin': '^5.2.1',
        'webpack-virtual-modules': '^0.4.2',
      },
    });

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

  async writingDependencies() {
    await this.addDevDependencies([
      '@storybook/addon-essentials',
      '@storybook/addon-links',
      '@storybook/addons',
      '@storybook/react',
      '@storybook/builder-webpack5',
      '@storybook/manager-webpack5',
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
  }
}
