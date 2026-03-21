import chalk from 'chalk';
import filter from 'gulp-filter';
import prettier from 'gulp-prettier';
import shelobsay from 'shelobsay';
import { BaseFeatures } from 'yeoman-generator';

import ConfigureGenerator, {
  type ConfigureOptions,
} from './ConfigureGenerator.js';
import installWithYarn from '../installWithYarn.js';
import { resolvePath } from '../utils.js';

export { ConfigureGenerator, ConfigureOptions };

export default class AppGenerator<
  O extends ConfigureOptions = ConfigureOptions,
  F extends BaseFeatures = BaseFeatures,
> extends ConfigureGenerator<O, F> {
  constructor(args: string | string[], options: O, features: F) {
    super(args, options, { ...features, customInstallTask: installWithYarn });
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

    this.queueTransformStream(
      {},
      jsFilter,
      prettier({
        printWidth: 80,
        semi: true,
        singleQuote: true,
        trailingComma: 'all',
      }),
      jsFilter.restore,
    );
  }

  async prompting() {
    this.log(shelobsay(`Creating a new ${chalk.red('Anansi')} project!`));
    const props = await super.prompting();
    this.composeWith(await resolvePath('../base', import.meta.url), this.args, {
      ...this.options,
      branded: true,
      projectType: props.projectType,
    } as any);
    return props;
  }
}
