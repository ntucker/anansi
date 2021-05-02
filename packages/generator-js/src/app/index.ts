import chalk from 'chalk';
import shelobsay from 'shelobsay';
import prettier from 'gulp-prettier';
import filter from 'gulp-filter';

import ConfigureGenerator from './ConfigureGenerator';

export { ConfigureGenerator };

export default class extends ConfigureGenerator {
  constructor(args: string | string[], options: Record<string, unknown>) {
    super(args, options);
    const jsFilter = filter(
      [
        '**/*.js',
        '**/*.ts',
        '**/*.tsx',
        '**/*.json',
        '**/*.html',
        '**/*.scss',
        '**/*.css',
      ],
      { restore: true },
    );
    this.registerTransformStream([
      jsFilter,
      prettier({
        printWidth: 80,
        semi: true,
        singleQuote: true,
        trailingComma: 'all',
      }),
      jsFilter.restore,
    ]);
  }

  async prompting() {
    this.log(shelobsay(`Creating a new ${chalk.red('Anansi')} project!`));
    const props = await super.prompting();
    this.composeWith(require.resolve('../base'), {
      ...this.options,
      arguments: this.args,
      branded: true,
      projectType: props.projectType,
    });
    return props;
  }
}
