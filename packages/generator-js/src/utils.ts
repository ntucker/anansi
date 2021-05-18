import path from 'path';
import Generator from 'yeoman-generator';
import ejs from 'ejs';
import execa from 'execa';

import type { Editor } from 'mem-fs-editor';

interface FsEditor extends Editor {
  extendJSONTpl(
    from: string,
    to: string,
    context?: Record<string, any>,
    templateOptions?: Record<string, any>,
    ...extendArgs: any[]
  ): void;
  appendTpl(
    from: string,
    to: string,
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
  T extends Generator.GeneratorOptions = Generator.GeneratorOptions,
> extends Generator<T> {
  fs!: FsEditor;

  constructor(args: string | string[], options: T, features: T) {
    // this is actually improperly typed
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    super(args, options, features);

    // types need updating
    this.fs = (this.env as any).fs;
    this.fs.extendJSONTpl = (
      from: string,
      to: string,
      context?: Record<string, any>,
      templateOptions?: Record<string, any>,
      ...extendArgs: any[]
    ) => {
      const input: string = ejs.render(
        this.fs.read(from),
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
        this.fs.read(from),
        context || this.config.getAll(),
        templateOptions,
      ) as any;
      return JSON.parse(input);
    };

    this.fs.appendTpl = (from, to, context, templateOptions, appendOptions) => {
      const input = ejs.render(
        this.fs.read(from),
        context || this.config.getAll(),
        templateOptions,
      );
      (this.fs as any).append(to, input, appendOptions);
    };

    // we're overriding a private member
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const before = this.env.detectPackageManager;
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    this.env.detectPackageManager = async function () {
      const name = await before.call(this);
      // use yarn if installed.
      // if someone installed yarn they probably mean to use it on any new projects.
      if (!name) {
        try {
          await execa('which', ['yarn'], { shell: true });
          return 'yarn';
          // eslint-disable-next-line no-empty
        } catch (e) {}
      }
      return name;
    };
  }
}

interface PKG {
  peerDependencies?: Record<string, string>;
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
}

export function InstallPeersMixin<
  Class extends new (...args: any[]) => Generator,
>(Cls: Class) {
  return class extends Cls {
    addPeers(
      pkgName: string,
      exclude: string[] = [],
      deptype: 'dependencies' | 'devDependencies' = 'dependencies',
    ) {
      let pkgDir = path.join(path.dirname(require.resolve(pkgName)));
      let pkgJSON: PKG | null = null;
      for (let i = 0; i < 10 && !pkgJSON; i++) {
        pkgJSON = this.fs.readJSON(path.join(pkgDir, 'package.json')) as any;
        pkgDir = path.join(pkgDir, '..');
      }
      const peers = Object.fromEntries(
        Object.entries(pkgJSON?.peerDependencies ?? {}).filter(
          ([pkg, version]) => !exclude.includes(pkg),
        ),
      );
      const funcKey = `add${capitalize(deptype)}` as const;
      this[funcKey](peers);
    }
  };
}

const capitalize = <T extends string>(s: T): Capitalize<T> => {
  return (s.charAt(0).toUpperCase() + s.slice(1)) as any;
};
