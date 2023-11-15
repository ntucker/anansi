import chalk from 'chalk';
import filter from 'gulp-filter';
import prettier from 'gulp-prettier';
import shelobsay from 'shelobsay';
import { BaseFeatures } from 'yeoman-generator';

import ConfigureGenerator, {
  type ConfigureOptions,
} from './ConfigureGenerator.js';
import { resolvePath } from '../utils.js';

export { ConfigureGenerator, ConfigureOptions };

export default class AppGenerator<
  O extends ConfigureOptions = ConfigureOptions,
  F extends BaseFeatures = BaseFeatures,
> extends ConfigureGenerator<O, F> {
  constructor(args: string | string[], options: O, features: F) {
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
    this.queueTransformStream([
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      jsFilter,
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      prettier({
        printWidth: 80,
        semi: true,
        singleQuote: true,
        trailingComma: 'all',
      }),
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      jsFilter.restore,
    ]);
  }

  async prompting() {
    this.log(shelobsay(`Creating a new ${chalk.red('Anansi')} project!`));
    const props = await super.prompting();
    this.composeWith(await resolvePath('../base', import.meta.url), {
      ...this.options,
      arguments: this.args,
      branded: true,
      projectType: props.projectType,
    });
    return props;
  }
}
