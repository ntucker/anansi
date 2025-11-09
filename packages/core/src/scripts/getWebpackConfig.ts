import { default as enhanced } from 'enhanced-resolve';
import type { Configuration } from 'webpack';

const resolve = enhanced.create.sync({
  modules: ['.'],
  // or resolve.create.sync
  extensions: ['.js', '.cjs', '.mjs'],
  // see more options below
});

export async function getWebpackConfig(): Promise<
  (env: any, argv: any) => Configuration
> {
  const configPath = resolve({}, process.cwd(), 'webpack.config');
  if (!configPath) {
    throw new Error('Cannot find webpack.config in ' + process.cwd());
  }

  return (await import(configPath)).default;
}
