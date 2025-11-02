/**
 * Integration test for Next.js builder with react-refresh
 *
 * This test validates that react-refresh is correctly applied/not applied
 * for Next.js client and server builds by using babel-loader with Next.js's
 * exact caller configuration.
 *
 * We do this because nextjs turbopack are so deeply integrated there's no feasible way to actually test it for real.
 */

const babel = require('@babel/core');
const fs = require('fs');
const os = require('os');
const path = require('path');

const buildPreset = require('./index');

describe('Next.js Integration - react-refresh', () => {
  let tempDir;

  beforeEach(() => {
    // Create a temporary directory for test files
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'nextjs-babel-test-'));
    process.env.NODE_ENV = 'development';
  });

  afterEach(() => {
    // Cleanup temporary directory
    if (tempDir && fs.existsSync(tempDir)) {
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
    delete process.env.NODE_ENV;
  });

  /**
   * Transforms code using @babel/core with Next.js's exact caller configuration
   *
   * This matches exactly how Next.js's babel-loader invokes babel. The key is using
   * the exact same caller configuration that Next.js's 'next-babel-turbo-loader' passes:
   * - name: 'next-babel-turbo-loader'
   * - isServer: true/false (critical for react-refresh)
   * - supportsStaticESM, supportsDynamicImport, supportsTopLevelAwait
   *
   * While we're not invoking babel-loader directly (it requires full webpack context),
   * we're using the identical caller configuration that babel-loader would pass,
   * which is what actually determines react-refresh behavior.
   */
  const transformWithNextJsLoader = (
    code,
    { isServer = false, filename = 'component.jsx' } = {},
  ) => {
    const filePath = path.join(tempDir, filename);
    // Write code to file for proper path resolution
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(filePath, code, 'utf8');

    // Build preset with Next.js's exact caller configuration
    // This is identical to what babel-loader passes when Next.js processes files
    const presetApi = {
      assertVersion: jest.fn(),
      env: jest.fn(() => process.env.NODE_ENV || 'development'),
      caller: jest.fn(callback => {
        // Next.js's babel-loader passes this exact caller configuration
        return callback({
          name: 'next-babel-turbo-loader',
          isServer: isServer,
          supportsStaticESM: true,
          supportsDynamicImport: true,
          supportsTopLevelAwait: true,
        });
      }),
      targets: jest.fn(() => ({})),
    };

    const preset = buildPreset(presetApi, {
      hasJsxRuntime: true,
    });

    // Transform with the exact same options and caller that Next.js's babel-loader uses
    return babel.transformSync(code, {
      filename: filePath,
      sourceFileName: filePath,
      cwd: tempDir,
      presets: [preset],
      // Pass caller info through babel options (babel-loader does this automatically)
      // This caller configuration is what Next.js actually uses
      caller: {
        name: 'next-babel-turbo-loader',
        isServer: isServer,
        supportsStaticESM: true,
        supportsDynamicImport: true,
        supportsTopLevelAwait: true,
      },
    });
  };

  describe('Server builds', () => {
    it('should NOT include react-refresh for Next.js server builds', () => {
      const code = `
function MyComponent() {
  return <div>Hello Server</div>;
}

export default MyComponent;
      `;

      const result = transformWithNextJsLoader(code, {
        isServer: true,
        filename: 'app/page.jsx',
      });

      expect(result.code).toBeDefined();
      // React refresh should NOT be applied to server builds
      expect(result.code).not.toContain('$RefreshReg$');
      expect(result.code).not.toContain('$RefreshSig$');
      expect(result.code).not.toContain('_c = $RefreshReg$');
    });

    it('should handle server components with hooks correctly', () => {
      const code = `
'use client';

function ServerComponent({ children }) {
  const [count, setCount] = useState(0);
  return <div>{count}</div>;
}

export default ServerComponent;
      `;

      const result = transformWithNextJsLoader(code, {
        isServer: true,
        filename: 'components/ServerComponent.jsx',
      });

      expect(result.code).toBeDefined();
      expect(result.code).not.toContain('$RefreshReg$');
      expect(result.code).not.toContain('$RefreshSig$');
    });
  });

  describe('Client builds', () => {
    it('should include react-refresh for Next.js client builds', () => {
      const code = `
function MyComponent() {
  return <div>Hello Client</div>;
}

export default MyComponent;
      `;

      const result = transformWithNextJsLoader(code, {
        isServer: false,
        filename: 'components/MyComponent.jsx',
      });

      expect(result.code).toBeDefined();
      // React refresh SHOULD be applied to client builds in development
      expect(result.code).toContain('$RefreshReg$');
    });

    it('should include react-refresh for client components with hooks', () => {
      const code = `
'use client';

import { useState } from 'react';

function ClientComponent() {
  const [count, setCount] = useState(0);
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  );
}

export default ClientComponent;
      `;

      const result = transformWithNextJsLoader(code, {
        isServer: false,
        filename: 'components/ClientComponent.jsx',
      });

      expect(result.code).toBeDefined();
      expect(result.code).toContain('$RefreshReg$');
      // Verify the component code is still present
      expect(result.code).toContain('setCount');
      expect(result.code).toContain('useState');
    });

    it('should handle multiple components in client build', () => {
      const code = `
function ComponentA() {
  return <div>A</div>;
}

function ComponentB({ prop }) {
  return <div>{prop}</div>;
}

export { ComponentA, ComponentB };
      `;

      const result = transformWithNextJsLoader(code, {
        isServer: false,
        filename: 'components/Multiple.jsx',
      });

      expect(result.code).toBeDefined();
      expect(result.code).toContain('$RefreshReg$');
      // Both components should be registered
      expect(result.code).toMatch(/\$RefreshReg\$\(/);
    });
  });

  describe('Edge cases', () => {
    it('should handle undefined isServer (should default to no refresh)', () => {
      const api = {
        assertVersion: jest.fn(),
        env: jest.fn(() => 'development'),
        caller: jest.fn(callback => {
          // isServer is undefined (not explicitly false)
          return callback({
            name: 'next-babel-turbo-loader',
            isServer: undefined,
          });
        }),
        targets: jest.fn(() => ({})),
      };

      const preset = buildPreset(api, {
        hasJsxRuntime: true,
      });

      const code = `function Component() { return <div>Test</div>; }`;
      const result = babel.transformSync(code, {
        filename: path.join(tempDir, 'component.jsx'),
        presets: [preset],
      });

      // When isServer is undefined, should not apply refresh (to be safe)
      expect(result.code).not.toContain('$RefreshReg$');
    });

    it('should not include react-refresh in production mode', () => {
      process.env.NODE_ENV = 'production';

      const api = {
        assertVersion: jest.fn(),
        env: jest.fn(() => 'production'),
        caller: jest.fn(callback => {
          return callback({
            name: 'next-babel-turbo-loader',
            isServer: false,
          });
        }),
        targets: jest.fn(() => ({})),
      };

      const preset = buildPreset(api, {
        hasJsxRuntime: true,
      });

      const code = `function Component() { return <div>Test</div>; }`;
      const result = babel.transformSync(code, {
        filename: path.join(tempDir, 'component.jsx'),
        presets: [preset],
      });

      // React refresh should not be in production builds
      expect(result.code).not.toContain('$RefreshReg$');
    });
  });
});
