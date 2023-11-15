import { BaseGenerator } from '@yeoman/types';
import ejs from 'ejs';
import { execa } from 'execa';
import { resolve } from 'import-meta-resolve';
import type {
  MemFsEditor,
  MemFsEditorFile,
  VinylMemFsEditorFile,
} from 'mem-fs-editor';
import path, {
  dirname,
  resolve as pathResolve,
  join as pathJoin,
} from 'node:path';
import pacote from 'pacote';
import Generator, { BaseFeatures, BaseOptions } from 'yeoman-generator';

export interface FsEditor<
  EditorFile extends MemFsEditorFile = VinylMemFsEditorFile,
> extends MemFsEditor<EditorFile> {
  extendJSONTpl(
    from: string,
    to: string,
    context?: Record<string, any>,
    templateOptions?: Record<string, any>,
    ...extendArgs: any[]
  ): void;
  appendTpl(
    from: string,
    to: string | Buffer,
    context?: Record<string, any>,
    templateOptions?: Record<string, any>,
    appendOptions?: Record<string, any>,
  ): void;
  readJSONTpl(
    from: string,
    context?: Record<string, any>,
    templateOptions?: Record<string, any>,
  ): any;
}

export class BetterGenerator<
  O extends BaseOptions = BaseOptions,
  F extends BaseFeatures = BaseFeatures,
> extends Generator<O, F> {
  declare fs: FsEditor;

  constructor(args: string | string[], options: O, features: F) {
    // fix broken logic in path combining in yeoman-generator
    if (options.resolved?.startsWith('file://'))
      options.resolved = options.resolved.substring(7);
    super(args, options, features);

    // environment will let us work from correct directory when copying files
    //this.fs = this.env.sharedFs as any;
    this.fs.extendJSONTpl = (
      from: string,
      to: string,
      context?: Record<string, any>,
      templateOptions?: Record<string, any>,
      ...extendArgs: any[]
    ) => {
      const input: string = ejs.render(
        this.fs.read(from) ?? '',
        context || this.config.getAll(),
        templateOptions,
      ) as any;
      this.fs.extendJSON(to, JSON.parse(input), ...extendArgs);
    };

    this.fs.readJSONTpl = (
      from: string,
      context?: Record<string, any>,
      templateOptions?: Record<string, any>,
    ) => {
      const input: string = ejs.render(
        this.fs.read(from) ?? '',
        context || this.config.getAll(),
        templateOptions,
      ) as any;
      return JSON.parse(input);
    };

    this.fs.appendTpl = (from, to, context, templateOptions, appendOptions) => {
      const input = ejs.render(
        this.fs.read(from) ?? '',
        context || this.config.getAll(),
        templateOptions,
      );
      (this.fs as any).append(to, input, appendOptions);
    };

    // we're overriding a private member
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const superDetectPackageManager = this.env.detectPackageManager;
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    this.env.detectPackageManager = async function () {
      const name = await superDetectPackageManager.call(this);
      // use yarn if installed.
      // if someone installed yarn they probably mean to use it on any new projects.
      if (!name) {
        try {
          await execa('which', ['yarn'], { shell: true });

          try {
            await execa(`corepack`, ['use yarn@*'], {
              shell: true,
            });
            // eslint-disable-next-line no-empty
          } catch (e) {}

          return 'yarn';
          // eslint-disable-next-line no-empty
        } catch (e) {}
      }
      return name;
    };
  }

  async addPeers(
    pkgName: string,
    exclude: string[] = [],
    deptype: 'dependencies' | 'devDependencies' = 'dependencies',
  ) {
    const manifest = await pacote.manifest(pkgName);
    if (!manifest) {
      return undefined;
    }
    const peers = Object.fromEntries(
      Object.entries(manifest?.peerDependencies ?? {}).filter(
        ([pkg, version]) => !exclude.includes(pkg),
      ),
    );
    const funcKey = `add${capitalize(deptype)}` as const;
    await this[funcKey](peers);
  }
}

// export function InstallPeersMixin<
//   Class extends new (
//     ...args: any[]
//   ) => BaseGenerator & { addDependencies: any; addDevDependencies: any },
// >(Cls: Class) {
//   return class extends Cls {
//     async addPeers(
//       pkgName: string,
//       exclude: string[] = [],
//       deptype: 'dependencies' | 'devDependencies' = 'dependencies',
//     ) {
//       const manifest = await pacote.manifest(pkgName);
//       if (!manifest) {
//         return undefined;
//       }
//       const peers = Object.fromEntries(
//         Object.entries(manifest?.peerDependencies ?? {}).filter(
//           ([pkg, version]) => !exclude.includes(pkg),
//         ),
//       );
//       const funcKey = `add${capitalize(deptype)}` as const;
//       await this[funcKey](peers);
//     }
//   };
// }

const capitalize = <T extends string>(s: T): Capitalize<T> => {
  return (s.charAt(0).toUpperCase() + s.slice(1)) as any;
};

export function resolvePath(path: string, url: string) {
  return resolve(path, url).substring(7);
}
