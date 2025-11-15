import diskFs from 'fs';
import { createFsFromVolume, Volume } from 'memfs';
import path from 'path';
import tmp from 'tmp';
import { ufs } from 'unionfs';

import { createHybridRequire } from '../createHybridRequire';

/**
 * Regression test to ensure hybridRequire resolves from the initial
 * working directory even if process.cwd() changes after initialization.
 * This guards against future refactors that might call process.chdir.
 */
describe('hybridRequire - process.cwd() variance regression', () => {
  let tempDir: string;
  let originalCwd: string;

  beforeEach(() => {
    originalCwd = process.cwd();
    tempDir = tmp.dirSync({ unsafeCleanup: true }).name;
  });

  afterEach(() => {
    process.chdir(originalCwd);
  });

  it('should capture projectRequire path at initialization time', () => {
    const projectRoot = path.join(tempDir, 'project');
    const otherDir = path.join(tempDir, 'other');

    // Create project structure
    diskFs.mkdirSync(projectRoot, { recursive: true });
    diskFs.mkdirSync(otherDir, { recursive: true });

    const nodeModulesDir = path.join(projectRoot, 'node_modules');
    const testPackageDir = path.join(nodeModulesDir, 'test-package-cwd');
    const testFile = path.join(testPackageDir, 'index.js');

    diskFs.mkdirSync(testPackageDir, { recursive: true });
    diskFs.writeFileSync(
      testFile,
      "module.exports = { default: 'from-project-root' };",
    );
    diskFs.writeFileSync(
      path.join(testPackageDir, 'package.json'),
      JSON.stringify({ name: 'test-package-cwd', main: 'index.js' }),
    );

    diskFs.writeFileSync(
      path.join(projectRoot, 'package.json'),
      JSON.stringify({ name: 'project' }),
    );

    // Create another package.json in otherDir (should not be used)
    diskFs.writeFileSync(
      path.join(otherDir, 'package.json'),
      JSON.stringify({ name: 'other' }),
    );

    // Set up memfs WITHOUT diskFs to test fallback
    const volume = new Volume();
    const fs = createFsFromVolume(volume);
    ufs.use(fs as any);

    // Initialize hybridRequire while in projectRoot
    process.chdir(projectRoot);
    const hybridRequire = createHybridRequire(ufs, projectRoot);

    // Change to other directory
    process.chdir(otherDir);

    // Verify process.cwd() changed
    expect(process.cwd()).toBe(otherDir);

    // hybridRequire should still resolve from projectRoot (captured at init)
    const result = hybridRequire('test-package-cwd');
    expect(result.default).toBe('from-project-root');
  });

  it('should work correctly when process.cwd() is different from projectRoot', () => {
    const projectRoot = path.join(tempDir, 'workspace', 'examples', 'app');
    const nodeModulesDir = path.join(projectRoot, 'node_modules');
    const testPackageDir = path.join(nodeModulesDir, 'test-package-nested');
    const testFile = path.join(testPackageDir, 'index.js');

    // Create nested structure
    diskFs.mkdirSync(testPackageDir, { recursive: true });
    diskFs.writeFileSync(
      testFile,
      "module.exports = { default: 'from-nested-workspace' };",
    );
    diskFs.writeFileSync(
      path.join(testPackageDir, 'package.json'),
      JSON.stringify({ name: 'test-package-nested', main: 'index.js' }),
    );

    diskFs.writeFileSync(
      path.join(projectRoot, 'package.json'),
      JSON.stringify({ name: 'app' }),
    );

    // Set up memfs WITHOUT diskFs to test fallback
    const volume = new Volume();
    const fs = createFsFromVolume(volume);
    ufs.use(fs as any);

    // Initialize from a different directory (simulating monorepo root)
    const monorepoRoot = path.join(tempDir, 'workspace');
    process.chdir(monorepoRoot);

    // Create hybridRequire with explicit projectRoot (not process.cwd())
    const hybridRequire = createHybridRequire(ufs, projectRoot);

    // Verify it resolves from projectRoot, not monorepoRoot
    const result = hybridRequire('test-package-nested');
    expect(result.default).toBe('from-nested-workspace');
  });

  it('should handle multiple chdir calls without breaking', () => {
    const projectRoot = path.join(tempDir, 'project');
    const dir1 = path.join(tempDir, 'dir1');
    const dir2 = path.join(tempDir, 'dir2');

    diskFs.mkdirSync(projectRoot, { recursive: true });
    diskFs.mkdirSync(dir1, { recursive: true });
    diskFs.mkdirSync(dir2, { recursive: true });

    const nodeModulesDir = path.join(projectRoot, 'node_modules');
    const testPackageDir = path.join(nodeModulesDir, 'test-package-stable');
    const testFile = path.join(testPackageDir, 'index.js');

    diskFs.mkdirSync(testPackageDir, { recursive: true });
    diskFs.writeFileSync(
      testFile,
      "module.exports = { default: 'stable-reference' };",
    );
    diskFs.writeFileSync(
      path.join(testPackageDir, 'package.json'),
      JSON.stringify({ name: 'test-package-stable', main: 'index.js' }),
    );

    diskFs.writeFileSync(
      path.join(projectRoot, 'package.json'),
      JSON.stringify({ name: 'project' }),
    );

    // Set up memfs WITHOUT diskFs to test fallback
    const volume = new Volume();
    const fs = createFsFromVolume(volume);
    ufs.use(fs as any);

    // Initialize
    process.chdir(projectRoot);
    const hybridRequire = createHybridRequire(ufs, projectRoot);

    // Multiple chdir calls
    process.chdir(dir1);
    expect(hybridRequire('test-package-stable').default).toBe(
      'stable-reference',
    );

    process.chdir(dir2);
    expect(hybridRequire('test-package-stable').default).toBe(
      'stable-reference',
    );

    process.chdir(projectRoot);
    expect(hybridRequire('test-package-stable').default).toBe(
      'stable-reference',
    );
  });
});
