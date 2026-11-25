import { type fsRequire } from 'fs-require';
import { createRequire } from 'module';
import path from 'path';
import { type IUnionFs } from 'unionfs';

import { createProjectFsRequire } from './fsRequireCaller.cjs';

/**
 * Creates a hybrid require function that combines fs-require (for in-memory files)
 * with Node's native require (for bare specifiers from project node_modules).
 *
 * Bare specifiers resolve from the project, the same way a require() made in
 * the app does. A dependency nested under @anansi/core does not hide the
 * app's copy. A module missing from both the bundle filesystem and the
 * project still throws MODULE_NOT_FOUND.
 *
 * @param ufs - The unionfs instance (disk first, then memfs)
 * @param projectRoot - Optional project root directory. Defaults to process.cwd()
 * @returns A require function that tries the bundle filesystem first, then the project
 */
export function createHybridRequire(
  ufs: IUnionFs,
  projectRoot: string = process.cwd(),
): fsRequire {
  const fsRequire = createProjectFsRequire(projectRoot)(ufs);
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

  return hybridRequire as fsRequire;
}
