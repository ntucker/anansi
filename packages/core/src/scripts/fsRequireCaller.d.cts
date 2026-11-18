import type { createFsRequire } from 'fs-require';

export function createProjectFsRequire(
  projectRoot: string,
): typeof createFsRequire;
