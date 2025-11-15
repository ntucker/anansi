import { createFsRequire } from 'fs-require';
import { createRequire } from 'module';
import path from 'path';
import { type IUnionFs } from 'unionfs';

/**
 * Creates a hybrid require function that combines fs-require (for in-memory files)
 * with Node's native require (for bare specifiers from project node_modules).
 *
 * This solves the issue where fs-require cannot resolve bare specifiers like
 * `@anansi/core/server` from workspace node_modules when they're not in the
 * memfs bundle.
 *
 * @param ufs - The unionfs instance (disk first, then memfs)
 * @param projectRoot - Optional project root directory. Defaults to process.cwd()
 * @returns A require function that tries memfs first, then falls back to project node_modules
 */
export function createHybridRequire(
  ufs: IUnionFs,
  projectRoot: string = process.cwd(),
): ReturnType<typeof createFsRequire> {
  const fsRequire = createFsRequire(ufs);
  const projectRequire = createRequire(path.join(projectRoot, 'package.json'));

  function hybridRequire(id: string) {
    try {
      return fsRequire(id);
    } catch (error: any) {
      const isBare = !id.startsWith('.') && !path.isAbsolute(id);
      if (isBare && error?.code === 'MODULE_NOT_FOUND') {
        return projectRequire(id);
      }
      throw error;
    }
  }

  // Preserve cache and resolve properties from fsRequire
  hybridRequire.cache = fsRequire.cache;
  hybridRequire.resolve = fsRequire.resolve;

  return hybridRequire as ReturnType<typeof createFsRequire>;
}
