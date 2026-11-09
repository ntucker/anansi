import diskFs from 'fs';
import { createFsRequire } from 'fs-require';
import { createFsFromVolume, Volume } from 'memfs';
import path from 'path';
import tmp from 'tmp';
import { ufs } from 'unionfs';

import { createHybridRequire } from '../createHybridRequire';

describe('hybridRequire wrapper', () => {
  let tempDir: string;
  let originalCwd: string;

  beforeEach(() => {
    originalCwd = process.cwd();
    tempDir = tmp.dirSync({ unsafeCleanup: true }).name;
  });

  afterEach(() => {
    process.chdir(originalCwd);
  });

  describe('unit tests - fallback resolver', () => {
    it('should resolve bare specifiers from project node_modules when not in memfs', () => {
      // Set up a temp directory with node_modules containing a test package
      const projectRoot = tempDir;
      const nodeModulesDir = path.join(projectRoot, 'node_modules');
      const testPackageDir = path.join(nodeModulesDir, 'test-package');
      const testFile = path.join(testPackageDir, 'index.js');

      // Create directory structure with a unique package name to avoid conflicts
      diskFs.mkdirSync(testPackageDir, { recursive: true });
      diskFs.writeFileSync(
        testFile,
        "module.exports = { default: 'test-export-value', test: 'value' };",
      );

      // Create package.json for the test package
      diskFs.writeFileSync(
        path.join(testPackageDir, 'package.json'),
        JSON.stringify({ name: 'test-package', main: 'index.js' }),
      );

      // Create package.json in project root
      diskFs.writeFileSync(
        path.join(projectRoot, 'package.json'),
        JSON.stringify({ name: 'test-project' }),
      );

      // Set up memfs WITHOUT diskFs to simulate memfs-only scenario
      // This way fsRequire will fail (module not in memfs)
      // and hybridRequire will fall back to projectRequire
      const volume = new Volume();
      const fs = createFsFromVolume(volume);
      // Only use memfs, not disk - this simulates the webpack output scenario
      ufs.use(fs as any);

      const fsRequire = createFsRequire(ufs);
      const hybridRequire = createHybridRequire(ufs, projectRoot);

      // Mock process.cwd to return our temp directory
      const originalCwd = process.cwd;
      process.cwd = jest.fn(() => projectRoot);

      try {
        // fsRequire should fail because test-package is not in memfs
        expect(() => {
          fsRequire('test-package');
        }).toThrow();

        // hybridRequire should succeed by falling back to project node_modules
        const result = hybridRequire('test-package');
        expect(result).toBeDefined();
        expect(result.default).toBe('test-export-value');
        expect(result.test).toBe('value');
      } finally {
        process.cwd = originalCwd;
      }
    });

    it('should work with unionfs when module exists in both disk and memfs', () => {
      const projectRoot = tempDir;
      const nodeModulesDir = path.join(projectRoot, 'node_modules');
      const testPackageDir = path.join(nodeModulesDir, 'test-package-union');
      const testFile = path.join(testPackageDir, 'index.js');

      // Create directory structure on disk
      diskFs.mkdirSync(testPackageDir, { recursive: true });
      diskFs.writeFileSync(
        testFile,
        "module.exports = { default: 'disk-version' };",
      );
      diskFs.writeFileSync(
        path.join(testPackageDir, 'package.json'),
        JSON.stringify({ name: 'test-package-union', main: 'index.js' }),
      );

      diskFs.writeFileSync(
        path.join(projectRoot, 'package.json'),
        JSON.stringify({ name: 'test-project' }),
      );

      // Set up memfs with the same module (different version)
      const volume = new Volume();
      const fs = createFsFromVolume(volume);
      const memfsPath = path.join('/node_modules/test-package-union/index.js');
      fs.mkdirSync(path.dirname(memfsPath), { recursive: true });
      fs.writeFileSync(
        memfsPath,
        "module.exports = { default: 'memfs-version' };",
      );

      // unionfs checks disk first, then memfs (same as dev server)
      ufs.use(diskFs).use(fs as any);

      const hybridRequire = createHybridRequire(ufs, projectRoot);

      // hybridRequire should get disk version (unionfs checks disk first)
      // This verifies that hybridRequire correctly uses fsRequire with unionfs
      const result = hybridRequire('test-package-union');
      expect(result.default).toBe('disk-version');
    });

    it('should handle relative paths without fallback', () => {
      const projectRoot = tempDir;
      diskFs.writeFileSync(
        path.join(projectRoot, 'package.json'),
        JSON.stringify({ name: 'test-project' }),
      );

      const volume = new Volume();
      const fs = createFsFromVolume(volume);
      const relativeFile = '/relative.js';
      fs.writeFileSync(
        relativeFile,
        "module.exports = { default: 'relative-export' };",
      );

      ufs.use(diskFs).use(fs as any);

      const hybridRequire = createHybridRequire(ufs, projectRoot);

      // Relative paths should work through memfs
      const result = hybridRequire(relativeFile);
      expect(result.default).toBe('relative-export');

      // If relative path fails, it should throw (not fallback)
      expect(() => hybridRequire('./nonexistent.js')).toThrow();
    });

    it('should throw non-MODULE_NOT_FOUND errors', () => {
      const projectRoot = tempDir;
      diskFs.writeFileSync(
        path.join(projectRoot, 'package.json'),
        JSON.stringify({ name: 'test-project' }),
      );

      const volume = new Volume();
      const fs = createFsFromVolume(volume);
      ufs.use(diskFs).use(fs as any);

      const hybridRequire = createHybridRequire(ufs, projectRoot);

      // Create a file that will cause a different error
      const badFile = '/bad.js';
      fs.writeFileSync(badFile, 'invalid syntax !!!');

      // Should throw the original error, not attempt fallback
      expect(() => hybridRequire(badFile)).toThrow();
    });

    it('should preserve cache and resolve properties', () => {
      const projectRoot = tempDir;
      diskFs.writeFileSync(
        path.join(projectRoot, 'package.json'),
        JSON.stringify({ name: 'test-project' }),
      );

      const volume = new Volume();
      const fs = createFsFromVolume(volume);
      ufs.use(diskFs).use(fs as any);

      // Create hybridRequire (which creates fsRequire internally)
      const hybridRequire = createHybridRequire(ufs, projectRoot);

      // Verify cache and resolve are preserved from the internal fsRequire
      expect(hybridRequire.cache).toBeDefined();
      expect(typeof hybridRequire.cache).toBe('object');
      expect(hybridRequire.resolve).toBeDefined();
      expect(typeof hybridRequire.resolve).toBe('function');
      // Verify resolve works
      expect(() => hybridRequire.resolve('some-module')).not.toThrow();
    });
  });

  describe('regression test - process.cwd variance', () => {
    it('should resolve from initial working directory even after process.chdir', () => {
      const projectRoot = tempDir;
      const nodeModulesDir = path.join(projectRoot, 'node_modules');
      const testPackageDir = path.join(nodeModulesDir, 'test-package-3');
      const testFile = path.join(testPackageDir, 'index.js');

      // Create directory structure
      diskFs.mkdirSync(testPackageDir, { recursive: true });
      diskFs.writeFileSync(
        testFile,
        "module.exports = { default: 'test-export-value' };",
      );
      diskFs.writeFileSync(
        path.join(testPackageDir, 'package.json'),
        JSON.stringify({ name: 'test-package-3', main: 'index.js' }),
      );

      diskFs.writeFileSync(
        path.join(projectRoot, 'package.json'),
        JSON.stringify({ name: 'test-project' }),
      );

      // Create another directory that we'll chdir to
      const otherDir = tmp.dirSync({ unsafeCleanup: true }).name;
      diskFs.writeFileSync(
        path.join(otherDir, 'package.json'),
        JSON.stringify({ name: 'other-project' }),
      );

      // Set up memfs WITHOUT diskFs to test fallback
      const volume = new Volume();
      const fs = createFsFromVolume(volume);
      ufs.use(fs as any);

      // Capture projectRequire at initial cwd
      const hybridRequire = createHybridRequire(ufs, projectRoot);

      // Change directory
      process.chdir(otherDir);

      // hybridRequire should still resolve from the original projectRoot
      // because projectRequire was created with that path
      const result = hybridRequire('test-package-3');
      expect(result.default).toBe('test-export-value');
    });
  });

  describe('app dependencies win over copies nested under @anansi/core', () => {
    function writePackage(dir: string, version: string) {
      diskFs.mkdirSync(dir, { recursive: true });
      diskFs.writeFileSync(
        path.join(dir, 'package.json'),
        JSON.stringify({ name: 'express', version, main: 'index.js' }),
      );
      diskFs.writeFileSync(
        path.join(dir, 'index.js'),
        `module.exports = { version: ${JSON.stringify(version)} };`,
      );
    }

    function installExpressFixtures(projectRoot: string) {
      diskFs.writeFileSync(
        path.join(projectRoot, 'package.json'),
        JSON.stringify({ name: 'consumer-app' }),
      );
      writePackage(
        path.join(projectRoot, 'node_modules', 'express'),
        '4.21.2-app',
      );
      writePackage(
        path.join(
          projectRoot,
          'node_modules',
          '@anansi',
          'core',
          'node_modules',
          'express',
        ),
        '5.3.0-nested',
      );
    }

    const bundleSource = [
      "const sibling = require('./sibling.js');",
      'module.exports = {',
      "  express: require('express/package.json').version,",
      "  expressExport: require('express').version,",
      '  sibling,',
      '};',
      '',
    ].join('\n');

    it('loads the app Express from an in-memory server bundle', () => {
      const projectRoot = tempDir;
      installExpressFixtures(projectRoot);

      const volume = new Volume();
      const memoryFs = createFsFromVolume(volume);
      memoryFs.mkdirSync('/server', { recursive: true });
      memoryFs.writeFileSync(
        '/server/sibling.js',
        "module.exports = 'memory-sibling';",
      );
      memoryFs.writeFileSync('/server/server.js', bundleSource);

      const hybridRequire = createHybridRequire(memoryFs as any, projectRoot);
      const loaded = hybridRequire('/server/server.js');

      expect(loaded.express).toBe('4.21.2-app');
      expect(loaded.expressExport).toBe('4.21.2-app');
      expect(loaded.sibling).toBe('memory-sibling');
    });

    it('loads the app Express from a bundle on disk', () => {
      const projectRoot = tempDir;
      installExpressFixtures(projectRoot);
      const bundleDir = path.join(projectRoot, 'dist-server');
      diskFs.mkdirSync(bundleDir, { recursive: true });
      diskFs.writeFileSync(
        path.join(bundleDir, 'sibling.js'),
        "module.exports = 'disk-sibling';",
      );
      const serverFile = path.join(bundleDir, 'server.js');
      diskFs.writeFileSync(serverFile, bundleSource);

      const hybridRequire = createHybridRequire(diskFs as any, projectRoot);
      const loaded = hybridRequire(serverFile);

      expect(loaded.express).toBe('4.21.2-app');
      expect(loaded.expressExport).toBe('4.21.2-app');
      expect(loaded.sibling).toBe('disk-sibling');
    });

    it('resolves circular imports and throws MODULE_NOT_FOUND when a module is missing', () => {
      const projectRoot = tempDir;
      diskFs.writeFileSync(
        path.join(projectRoot, 'package.json'),
        JSON.stringify({ name: 'consumer-app' }),
      );
      const volume = new Volume();
      const memoryFs = createFsFromVolume(volume);
      memoryFs.writeFileSync(
        '/a.js',
        "exports.name = 'a'; exports.other = require('./b.js');",
      );
      memoryFs.writeFileSync(
        '/b.js',
        "exports.name = 'b'; exports.other = require('./a.js');",
      );

      const hybridRequire = createHybridRequire(memoryFs as any, projectRoot);
      const circular = hybridRequire('/a.js');
      expect(circular.name).toBe('a');
      expect(circular.other.name).toBe('b');
      expect(circular.other.other.name).toBe('a');

      let relativeError: any;
      try {
        hybridRequire('/missing.js');
      } catch (error) {
        relativeError = error;
      }
      expect(relativeError).toBeDefined();
      expect(relativeError.code).toBe('MODULE_NOT_FOUND');

      let bareError: any;
      try {
        hybridRequire('package-that-does-not-exist-anywhere');
      } catch (error) {
        bareError = error;
      }
      expect(bareError).toBeDefined();
      expect(bareError.code).toBe('MODULE_NOT_FOUND');
    });
  });
});
