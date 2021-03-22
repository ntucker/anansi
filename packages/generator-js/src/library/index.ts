import { BetterGenerator, InstallPeersMixin } from '../utils';

const DEFAULT_LIB_PATH = 'lib';

module.exports = class extends InstallPeersMixin(BetterGenerator) {
  props?: Record<string, any>;

  constructor(args: string | string[], options: Record<string, unknown>) {
    super(args, options);

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

  initializing() {
    if (this.options['lib-path']) {
      this.config.set('libPath', this.options['lib-path']);
    } else if (!this.config.get('libPath')) {
      this.config.set('libPath', DEFAULT_LIB_PATH);
    }
    this.composeWith(require.resolve('../rollup'), {});
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
    this.fs.appendTpl(
      this.templatePath('.gitignore.tpl'),
      this.destinationPath('.gitignore'),
      this.config.getAll(),
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

  writingPkg() {
    const pkgJson = {
      devDependencies: {
        '@babel/cli': 'latest',
        '@zerollup/ts-transform-paths': 'latest',
        ttypescript: 'latest',
        'cross-env': 'latest',
        rimraf: 'latest',
      },
    };
    this.fs.extendJSON(this.destinationPath('package.json'), pkgJson);
  }
};
