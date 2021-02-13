import path from 'path';
import Generator from 'yeoman-generator';
import ejs from 'ejs';

interface FsEditor extends Generator.MemFsEditor {
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
}

export class BetterGenerator extends Generator {
  fs!: FsEditor;

  constructor(args: string | string[], options: Record<string, unknown>) {
    super(args, options);

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

    this.fs.appendTpl = (from, to, context, templateOptions, appendOptions) => {
      const input = ejs.render(
        this.fs.read(from),
        context || this.config.getAll(),
        templateOptions,
      );
      (this.fs as any).append(to, input, appendOptions);
    };
  }
}

interface PKG {
  peerDependencies?: Record<string, string>;
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
}

export function InstallPeersMixin<
  Class extends new (...args: any[]) => Generator
>(Cls: Class) {
  return class extends Cls {
    installPeers(
      pkgName: string,
      exclude: string[] = [],
      installOptions: Record<string, any> = {},
    ) {
      let pkgDir = path.join(path.dirname(require.resolve(pkgName)));
      let pkgJSON: PKG | null = null;
      for (let i = 0; i < 10 && !pkgJSON; i++) {
        pkgJSON = this.fs.readJSON(path.join(pkgDir, 'package.json'));
        pkgDir = path.join(pkgDir, '..');
      }
      const peers = Object.entries(pkgJSON?.peerDependencies ?? {})
        .filter(([pkg, version]) => !exclude.includes(pkg))
        .map(entry => entry.join('@'));
      this.yarnInstall(peers, Object.assign({ exact: true }, installOptions));
    }
  };
}
