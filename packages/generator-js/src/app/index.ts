import chalk from 'chalk';
import filter from 'gulp-filter';
import prettier from 'gulp-prettier';
import shelobsay from 'shelobsay';

import ConfigureGenerator from './ConfigureGenerator';

export { ConfigureGenerator };

export default class extends ConfigureGenerator {
  constructor(
    args: string | string[],
    options: Record<string, unknown>,
    features: Record<string, unknown>,
  ) {
    // this is actually improperly typed
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    super(args, options, features);
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

    // this is actually improperly typed
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    this.queueTransformStream([
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
