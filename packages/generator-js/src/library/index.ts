import { BaseFeatures, BaseOptions } from 'yeoman-generator';

import { BetterGenerator, resolvePath } from '../utils.js';

const DEFAULT_LIB_PATH = 'lib';

export default class extends BetterGenerator<LibraryOptions, BaseFeatures> {
  props?: Record<string, any>;

  constructor(
    args: string | string[],
    options: LibraryOptions,
    features: BaseFeatures,
  ) {
    super(args, options, features);

    this.option('lib-path', {
      alias: 'l',
      description: 'ES6 module destination',
      type: String,
      default: DEFAULT_LIB_PATH,
    });

    const { appName, badges = '' } = this.config.getAll();
    this.config.set(
      'badges',
      `${badges}
[![npm downloads](https://img.shields.io/npm/dm/${appName}.svg?style=flat-square)](https://www.npmjs.com/package/${appName})
[![gzip size](https://img.badgesize.io/https://unpkg.com/${appName}?compression=gzip&style=flat-square)](https://unpkg.com/${appName})
[![npm version](https://img.shields.io/npm/v/${appName}s.svg?style=flat-square)](https://www.npmjs.com/package/${appName})
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)`,
    );
  }

  async initializing() {
    if (this.options['lib-path']) {
      this.config.set('libPath', this.options['lib-path']);
    } else if (!this.config.get('libPath')) {
      this.config.set('libPath', DEFAULT_LIB_PATH);
    }
    this.composeWith(
      await resolvePath('../rollup', import.meta.url),
      this.options,
    );
  }

  configuring() {
    this.packageJson.merge(
      this.fs.readJSONTpl(this.templatePath('package.json.tpl')),
    );
    this.fs.extendJSONTpl(
      this.templatePath('tsconfig.json'),
      this.destinationPath('tsconfig.json'),
    );
    this.fs.appendTpl(
      this.templatePath('.gitignore.tpl'),
      this.destinationPath('.gitignore'),
      this.config.getAll(),
    );
  }

  async writingDependencies() {
    await this.addDevDependencies([
      '@babel/cli',
      '@zerollup/ts-transform-paths',
      'rimraf',
    ]);
    await this.addDependencies(['core-js-pure']);
    if (this.config.get('features').includes('storybook')) {
      await this.addDevDependencies([
        '@types/react',
        '@types/react-dom',
        'react',
        'react-dom',
      ]);
      this.packageJson.merge({
        peerDependencies: {
          react: '^18.0.0',
          'react-dom': '^18.0.0',
        },
      });
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
    this.fs.copyTpl(
      this.templatePath('README.md'),
      this.destinationPath('README.md'),
      this.config.getAll(),
    );
  }
}

type LibraryOptions = BaseOptions & { 'lib-path': string; features: string[] };
