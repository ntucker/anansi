import { BetterGenerator } from '../utils.js';

export default class extends BetterGenerator {
  writing() {
    this.fs.copyTpl(
      this.templatePath('src/**/*.ts*'),
      this.destinationPath(this.config.get('rootPath')),
      this.config.getAll(),
      {},
      { globOptions: { dot: true } },
    );
    this.fs.copyTpl(
      this.templatePath('src/**/*.woff'),
      this.destinationPath(this.config.get('rootPath')),
      this.config.getAll(),
      {},
      { globOptions: { dot: true } },
    );
    if (!this.config.get('testing')) {
      this.fs.delete('src/__tests__');
    }
    if (this.config.get('storybook')) {
      this.fs.copyTpl(
        this.templatePath('stories/**'),
        this.destinationPath(this.config.get('rootPath'), 'pages/Home'),
        this.config.getAll(),
        {},
        { globOptions: { dot: true } },
      );
    }
    if (this.config.get('style') === 'sass') {
      this.fs.copyTpl(
        this.templatePath('src/**/*.scss'),
        this.destinationPath(this.config.get('rootPath')),
        this.config.getAll(),
        {},
        { globOptions: { dot: true } },
      );
    } else {
      this.fs.copyTpl(
        this.templatePath('src/style/main.scss'),
        this.destinationPath(this.config.get('rootPath'), 'style/main.css'),
        this.config.getAll(),
        {},
      );
    }
  }
}
