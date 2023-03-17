import type {
  StorybookConfigWebpack,
  BuilderOptions,
  TypescriptOptions as TypescriptOptionsBuilder,
} from '@storybook/builder-webpack5';
import type {
  ReactOptions,
  StorybookConfig as StorybookConfigBase,
  TypescriptOptions as TypescriptOptionsReact,
} from '@storybook/preset-react-webpack';

type FrameworkName = '@anansi/storybook';
type BuilderName = '@storybook/builder-webpack5';

export type FrameworkOptions = ReactOptions & {
  builder?: BuilderOptions;
  babelOptions?: { typing?: 'typescript'; loose: boolean };
};

type StorybookConfigFramework = {
  framework:
    | FrameworkName
    | {
        name: FrameworkName;
        options: FrameworkOptions;
      };
  core?: StorybookConfigBase['core'] & {
    builder?:
      | BuilderName
      | {
          name: BuilderName;
          options: BuilderOptions;
        };
  };
  typescript?: Partial<TypescriptOptionsBuilder & TypescriptOptionsReact> &
    StorybookConfigBase['typescript'];
};

/**
 * The interface for Storybook configuration in `main.ts` files.
 */
export type StorybookConfig = Omit<
  StorybookConfigBase,
  keyof StorybookConfigWebpack | keyof StorybookConfigFramework
> &
  StorybookConfigWebpack &
  StorybookConfigFramework;
