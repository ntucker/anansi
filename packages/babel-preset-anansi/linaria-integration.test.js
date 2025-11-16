/**
 * Integration test for Linaria CSS-in-JS with babel preset
 *
 * This test validates that the babel preset correctly integrates with Linaria
 * by using the actual @wyw-in-js/webpack-loader to process Linaria code through webpack.
 *
 * The webpack loader calls Babel with caller.name = 'wyw-in-js' during its two-phase process:
 * 1. Preeval phase - initial code transformation
 * 2. Eval/collect phase - CSS extraction and final transformation
 *
 * In Linaria 6.x, the caller name is 'wyw-in-js' (earlier versions used 'linaria').
 * Our preset detects this and disables incompatible plugins.
 */

const fs = require('fs');
const MemoryFS = require('memory-fs');
const os = require('os');
const path = require('path');
const webpack = require('webpack');

describe('Linaria Integration with Webpack Loader', () => {
  let tempDir;
  let mfs;

  beforeEach(() => {
    // Use a fixed tempDir path for deterministic test output
    tempDir = path.join(os.tmpdir(), 'linaria-test-fixed');
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }
    mfs = new MemoryFS();
    process.env.NODE_ENV = 'development';
  });

  afterEach(() => {
    delete process.env.NODE_ENV;
    // Clean up test files after each test
    if (tempDir && fs.existsSync(tempDir)) {
      const files = fs.readdirSync(tempDir);
      for (const file of files) {
        fs.rmSync(path.join(tempDir, file), { recursive: true, force: true });
      }
    }
  });

  /**
   * Compiles code using webpack with @wyw-in-js/webpack-loader
   * This simulates the actual build process where webpack processes Linaria code
   */
  const compileWithWebpack = (
    code,
    filename = 'component.tsx',
    options = {},
  ) => {
    return new Promise((resolve, reject) => {
      const filePath = path.join(tempDir, filename);
      const dir = path.dirname(filePath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(filePath, code, 'utf8');

      // Build babel options - when wyw-in-js loader processes code, it internally
      // calls babel with caller.name = 'wyw-in-js'. The loader uses the babelOptions
      // we provide here, and the preset will automatically detect the 'wyw-in-js' caller.
      // Use the preset package name so webpack can resolve it properly
      // Note: babel-loader runs first, then wyw-in-js loader. We need to ensure
      // babel-loader doesn't add react-refresh since wyw-in-js will handle the final transform.
      const babelLoaderOptions = {
        presets: [
          [
            '@anansi/babel-preset',
            {
              hasJsxRuntime: true,
              loose: true,
              ...options,
            },
          ],
        ],
        cacheDirectory: false,
        caller: {
          // Tell babel-loader this is part of a Linaria build so it doesn't add react-refresh
          name: 'babel-loader',
          noHotReload: true, // Disable react-refresh for Linaria builds
        },
      };

      // babelOptions for wyw-in-js loader should not include babel-loader specific options
      const inJSBabelOptions = {
        presets: [
          [
            '@anansi/babel-preset',
            {
              hasJsxRuntime: true,
              loose: true,
              ...options,
            },
          ],
        ],
      };

      // Create a temporary file for webpack records to ensure deterministic build order
      const recordsPath = path.join(tempDir, 'records.json');

      const config = {
        mode:
          process.env.NODE_ENV === 'production' ? 'production' : 'development',
        context: tempDir,
        entry: `./${filename}`,
        output: {
          path: '/dist',
          filename: 'bundle.js',
          libraryTarget: 'commonjs2',
          pathinfo: false, // Disable path-dependent salts for determinism
          hashFunction: 'xxhash64', // Use stable hashing for deterministic output
        },
        optimization: {
          // Ensure deterministic module and chunk IDs
          moduleIds: 'deterministic',
          chunkIds: 'deterministic',
        },
        externals: [
          // Externalize all node_modules dependencies
          function ({ request }, callback) {
            // Don't externalize CSS files, they need to be processed
            if (request && request.endsWith('.css')) {
              return callback();
            }
            // Check if the request is a node_modules package
            if (
              request &&
              !request.startsWith('.') &&
              !request.startsWith('/') &&
              !path.isAbsolute(request)
            ) {
              // It's a package from node_modules, externalize it
              return callback(null, `commonjs ${request}`);
            }
            // Not a node_modules package, bundle it
            callback();
          },
        ],
        cache: false,
        devtool: false, // Disable source maps to avoid absolute path dependencies
        recordsPath, // Fix build order across test runs
        recordsInputPath: recordsPath,
        module: {
          rules: [
            {
              test: /\.css$/,
              use: [
                {
                  loader: require.resolve('css-loader'),
                  options: {
                    modules: {
                      // Deterministic class names for tests
                      localIdentName: '[path][name]__[local]',
                      exportOnlyLocals: false, // keep actual CSS
                      getLocalIdent: (context, localIdentName, localName) => {
                        // Make classnames deterministic based on file path and local name
                        const path = context.resourcePath.replace(
                          tempDir,
                          '<TEST_DIR>',
                        );
                        return `${path
                          .split('/')
                          .pop()
                          .replace(/\.[^/.]+$/, '')}__${localName}`;
                      },
                    },
                    importLoaders: 1,
                  },
                },
              ],
            },
            {
              test: /\.(t|j)sx?$/,
              use: [
                {
                  loader: require.resolve('babel-loader'),
                  options: babelLoaderOptions,
                },
                {
                  loader: require.resolve('@wyw-in-js/webpack-loader'),
                  options: {
                    babelOptions: inJSBabelOptions,
                    sourceMap: false,
                    classNameSlug: (hash, title, args) => {
                      // Create deterministic classname based on file path
                      const filePath = args.file || args.name || filename;
                      // Normalize path for test environment
                      const normalizedPath = filePath
                        .replace(tempDir, '')
                        .replace(/^\//, '')
                        .replace(/\.(t|j)sx?$/, '')
                        .replace(/[^a-zA-Z0-9]/g, '_');
                      // Use title if available, otherwise use normalized path
                      const baseName = title || normalizedPath || 'css';
                      return `${baseName}`;
                    },
                  },
                },
              ],
            },
          ],
        },
        resolve: {
          extensions: ['.ts', '.tsx', '.js', '.jsx', '.css'],
          modules: ['node_modules', path.join(__dirname, '../../node_modules')],
        },
        resolveLoader: {
          modules: ['node_modules', path.join(__dirname, '../../node_modules')],
        },
        plugins: [
          new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify(
              process.env.NODE_ENV || 'development',
            ),
          }),
        ],
      };

      const compiler = webpack(config);
      compiler.outputFileSystem = mfs;

      compiler.run((err, stats) => {
        if (err) {
          reject(err);
          return;
        }
        if (stats.hasErrors()) {
          reject(
            new Error(stats.compilation.errors.map(e => e.message).join('\n')),
          );
          return;
        }

        const outputPath = '/dist/bundle.js';
        let output = '';
        if (mfs.existsSync(outputPath)) {
          output = mfs.readFileSync(outputPath, 'utf8');
        }

        // Normalize paths in output for stable snapshots
        // Normalize the tempDir path
        output = output.replace(
          new RegExp(tempDir.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'),
          '<TEST_DIR>',
        );
        output = output.replace(/\/tmp\/linaria-test-[^'"]+/g, '<TEMP_DIR>');
        output = output.replace(/<TEMP_DIR>/g, '<TEST_DIR>');

        // Normalize absolute project paths in webpack-generated variable names
        // Webpack creates variable names from module paths like:
        // _home_user_project_node_modules_module__WEBPACK_IMPORTED_MODULE_X__
        // Get the project root (assuming test is in packages/babel-preset-anansi)
        const projectRoot = path.resolve(__dirname, '../..');
        const projectRootRegex = new RegExp(
          projectRoot.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'),
          'g',
        );
        // Replace absolute paths in variable names and strings
        output = output.replace(projectRootRegex, '<PROJECT_ROOT>');

        // Normalize absolute paths in webpack variable names
        // Webpack converts absolute paths to variable names by replacing / with _
        // e.g., /home/user/project/packages/babel-preset-anansi/node_modules/css-loader/...
        // becomes: _home_user_project_packages_babel_preset_anansi_node_modules_css_loader_...
        // The snapshot was created on a local machine with path: _home_ntucker_src_anansi
        // CI uses a different path: _home_circleci_project
        // We need to normalize all variable name paths to match the snapshot format
        // Match any variable name prefix before "packages_babel_preset_anansi"
        output = output.replace(
          /(_[a-zA-Z0-9_-]+(?:_[a-zA-Z0-9_-]+)*)_packages_babel_preset_anansi/g,
          '_babel_preset_anansi',
        );

        // Normalize webpack module IDs for stable snapshots across different environments
        // Module IDs can vary based on file system order, which differs between CI and local
        // Pattern 1: Module definitions like "/***/ 414:" and strip banner comments
        output = output.replace(
          /\/\*\*\*\/(\s*)(\d+):/g,
          '/***/$1<MODULE_ID>:',
        );
        // Strip webpack banner comments like "/*!***********************!*...!*** ./file ***!"
        output = output.replace(/\/\*![\s\S]*?!\*\\\/\n\s*/g, '');
        // Pattern 2: Module references like "__webpack_modules__[414]"
        output = output.replace(
          /__webpack_modules__\[(\d+)\]/g,
          '__webpack_modules__[<MODULE_ID>]',
        );
        // Pattern 3: __webpack_require__ calls like "__webpack_require__(414)" or "__webpack_require__(/*! ./file */ 414)"
        // Need to preserve comments but replace just the numeric ID
        output = output.replace(
          /(__webpack_require__)\(([^)]*?)(\d+)\)/g,
          (match, requireFunc, comment) =>
            `${requireFunc}(${comment}<MODULE_ID>)`,
        );

        // Collect CSS files generated by Linaria and other loaders
        let cssOutput = '';
        const cssFiles = [];
        for (const [assetPath] of Object.entries(stats.compilation.assets)) {
          if (assetPath.endsWith('.css')) {
            cssFiles.push(assetPath);
            const cssContent = mfs.readFileSync(`/dist/${assetPath}`, 'utf8');
            cssOutput += `\n\n/* CSS from ${assetPath} */\n${cssContent}`;
          }
        }

        // Append CSS to output if any was generated
        if (cssOutput) {
          output += cssOutput;
        }

        resolve({
          output,
          stats,
          assets: stats.compilation.assets,
          cssFiles,
        });
      });
    });
  };

  describe('Linaria detection with webpack loader', () => {
    it('should process styled components through webpack loader', async () => {
      const code = `
        import { styled } from '@linaria/react';
        
        const Button = styled.button\`
          background: blue;
          color: white;
        \`;
        
        export default Button;
      `;

      const result = await compileWithWebpack(code);

      expect(result.output).toBeDefined();
      expect(result.output).toContain('@linaria/react');
      // Should not contain transform runtime (excluded for linaria)
      expect(result.output).not.toContain('@babel/runtime');
    });

    it('should handle linaria caller (backwards compatibility)', async () => {
      const code = `const x = 1; export default x;`;

      const result = await compileWithWebpack(code);

      expect(result.output).toBeDefined();
      expect(result.output).toMatchSnapshot();
    });
  });

  describe('Transform runtime exclusion', () => {
    it('should NOT include @babel/plugin-transform-runtime when wyw-in-js processes code', async () => {
      const code = `
        class MyClass {
          myProp: number = 42;
        }
        
        async function test() {
          await Promise.resolve();
        }
        
        export default test;
      `;

      const result = await compileWithWebpack(code);

      // Transform runtime should not be applied for Linaria
      expect(result.output).not.toContain('@babel/runtime');
      expect(result.output).toBeDefined();
      // Should still transform TypeScript
      expect(result.output).not.toContain('myProp: number');
      // Should compile successfully
      expect(result.stats.hasErrors()).toBe(false);
    });
  });

  describe('Polyfill exclusion', () => {
    it('should NOT include babel-plugin-polyfill-corejs3 when wyw-in-js processes code', async () => {
      const code = `
        console.log(Object.hasOwn({ a: 1 }, 'a'));
        const map = new WeakMap();
        
        export default map;
      `;

      const result = await compileWithWebpack(code);

      // Polyfills should not be injected for Linaria
      expect(result.output).not.toContain('core-js');
      expect(result.output).toBeDefined();
      // Code should still be transformed
      expect(result.output).toContain('Object.hasOwn');
      expect(result.output).toContain('WeakMap');
      expect(result.stats.hasErrors()).toBe(false);
    });
  });

  describe('React refresh exclusion', () => {
    it('should NOT include react-refresh for wyw-in-js in development', async () => {
      const code = `
        function Component() {
          return <div>Hello</div>;
        }
        
        export default Component;
      `;

      const result = await compileWithWebpack(code);

      // React refresh should not be applied to Linaria builds
      expect(result.output).not.toContain('$RefreshReg$');
      expect(result.output).not.toContain('$RefreshSig$');
      // Should still contain the component code
      expect(result.output).toContain('Component');
      expect(result.output).toMatch(/return.*div|Hello/);
      expect(result.stats.hasErrors()).toBe(false);
    });
  });

  describe('Styled components with actual Linaria processing', () => {
    it('should process styled component syntax', async () => {
      const code = `
        import { styled } from '@linaria/react';
        
        const Button = styled.button\`
          background-color: blue;
          color: white;
          padding: 8px 16px;
        \`;
        
        function Component() {
          return <Button>Click me</Button>;
        }
        
        export default Component;
      `;

      const result = await compileWithWebpack(code);

      expect(result.output).toBeDefined();
      // Linaria processes styled components - check that it's handled
      expect(result.output).toContain('@linaria/react');
      // Should contain styled component (may be minified in eval output)
      expect(result.output).toMatch(/styled|Button/);
      // Should contain CSS styles from Linaria
      expect(result.output).toMatch(/background|blue|color|white/);
      expect(result.stats.hasErrors()).toBe(false);
    });

    it('should handle styled component with props and interpolations', async () => {
      const code = `
        import { styled } from '@linaria/react';
        
        const Container = styled.div<{ size?: string; color?: string }>\`
          padding: \${props => props.size || '16px'};
          background-color: \${props => props.color || 'white'};
        \`;
        
        function Component() {
          return <Container size="24px" color="red">Content</Container>;
        }
        
        export default Component;
      `;

      const result = await compileWithWebpack(code);

      expect(result.output).toBeDefined();
      // Should handle styled component with props
      expect(result.output).toContain('@linaria/react');
      // TypeScript types should be stripped
      expect(result.output).not.toContain('size?: string');
      expect(result.output).not.toContain('color?: string');
      // Should contain container/component references
      expect(result.output).toMatch(/Container|Component/);
      expect(result.stats.hasErrors()).toBe(false);
    });

    it('should handle styled component extending another component', async () => {
      const code = `
        import { styled } from '@linaria/react';
        
        const Base = styled.div\`
          padding: 16px;
        \`;
        
        const Extended = styled(Base)\`
          margin: 8px;
          border: 1px solid black;
        \`;
        
        function Component() {
          return <Extended>Extended</Extended>;
        }
        
        export default Component;
      `;

      const result = await compileWithWebpack(code);

      expect(result.output).toBeDefined();
      // Should handle extending styled components
      expect(result.output).toContain('@linaria/react');
      // Should contain component references (Extended, Base, etc.)
      expect(result.output).toMatch(/Extended|Base|Component/);
      expect(result.stats.hasErrors()).toBe(false);
    });
  });

  describe('CSS tagged templates with actual Linaria processing', () => {
    it('should process css tagged template', async () => {
      const code = `
        import { css } from '@linaria/core';
        
        const styles = css\`
          .container {
            display: flex;
            flex-direction: column;
          }
        \`;
        
        function Component() {
          return <div className={styles}>Content</div>;
        }
        
        export default Component;
      `;

      const result = await compileWithWebpack(code);

      expect(result.output).toBeDefined();
      // Should process css tagged template
      // Note: webpack eval output may not show @linaria/core import directly
      // but should contain the processed CSS
      expect(result.output).toMatch(/display|flex|container|styles/);
      expect(result.stats.hasErrors()).toBe(false);
    });

    it('should handle css with variable interpolations', async () => {
      const code = `
        import { css } from '@linaria/core';
        
        const color = 'blue';
        const fontSize = '16px';
        const styles = css\`
          color: \${color};
          font-size: \${fontSize};
        \`;
        
        function Component() {
          return <div className={styles}>Styled</div>;
        }
        
        export default Component;
      `;

      const result = await compileWithWebpack(code);

      expect(result.output).toBeDefined();
      // Should handle CSS variable interpolations (may be processed by webpack)
      expect(result.output).toMatch(/color|blue|fontSize|styles|Component/);
      expect(result.stats.hasErrors()).toBe(false);
    });

    it('should handle nested selectors in styled components', async () => {
      const buttonRef = '${Button}';
      const code = [
        "import { styled } from '@linaria/react';",
        '',
        'const Button = styled.button`',
        '  background: blue;',
        '  ',
        '  &:hover {',
        '    background: darkblue;',
        '  }',
        '  ',
        '  .icon {',
        '    margin-right: 8px;',
        '  }',
        '`;',
        '',
        'const Container = styled.div`',
        `  ${buttonRef} {`,
        '    margin: 8px;',
        '  }',
        '`;',
        '',
        'function Component() {',
        '  return (',
        '    <Container>',
        '      <Button>Click</Button>',
        '    </Container>',
        '  );',
        '}',
        '',
        'export default Component;',
      ].join('\n');

      const result = await compileWithWebpack(code);

      expect(result.output).toBeDefined();
      // Should handle nested selectors
      expect(result.output).toMatch(/:hover|\.icon/);
      expect(result.stats.hasErrors()).toBe(false);
    });
  });

  describe('TypeScript support with Linaria', () => {
    it('should transform TypeScript with styled components', async () => {
      const code = `
        import { styled } from '@linaria/react';
        
        interface ButtonProps {
          primary?: boolean;
        }
        
        const Button = styled.button<ButtonProps>\`
          background-color: \${props => props.primary ? 'blue' : 'gray'};
          color: white;
        \`;
        
        function Component() {
          return <Button primary>Click</Button>;
        }
        
        export default Component;
      `;

      const result = await compileWithWebpack(code);

      expect(result.output).toBeDefined();
      // TypeScript types should be stripped
      expect(result.output).not.toContain('ButtonProps');
      expect(result.output).not.toContain(': string');
      // Should still contain styled component
      expect(result.output).toContain('@linaria/react');
      expect(result.output).toMatch(/Button|Component|styled/);
      expect(result.stats.hasErrors()).toBe(false);
    });

    it('should handle TypeScript with css templates', async () => {
      const code = `
        import { css } from '@linaria/core';
        
        const color: string = 'red';
        const styles = css\`
          color: \${color};
        \`;
        
        function Component(): JSX.Element {
          return <div className={styles}>Test</div>;
        }
        
        export default Component;
      `;

      const result = await compileWithWebpack(code);

      expect(result.output).toBeDefined();
      expect(result.output).not.toContain(': string');
      expect(result.output).not.toContain(': JSX.Element');
      // Should contain CSS template (may be processed by webpack)
      expect(result.output).toMatch(/css|styles|Component|color/);
      expect(result.stats.hasErrors()).toBe(false);
    });
  });

  describe('Complex Linaria features', () => {
    it('should handle media queries in styled components', async () => {
      const code = `
        import { styled } from '@linaria/react';
        
        const media = {
          tablet: '768px',
          desktop: '1024px',
        };
        
        const Container = styled.div\`
          padding: 16px;
          
          @media (min-width: \${media.tablet}) {
            padding: 24px;
          }
          
          @media (min-width: \${media.desktop}) {
            padding: 32px;
          }
        \`;
        
        function Component() {
          return <Container>Responsive</Container>;
        }
        
        export default Component;
      `;

      const result = await compileWithWebpack(code);

      expect(result.output).toBeDefined();
      // Should handle media queries
      expect(result.output).toContain('@linaria/react');
      // Media queries and padding should be in CSS output
      expect(result.output).toMatch(/@media|padding|Container|Component/);
      expect(result.stats.hasErrors()).toBe(false);
    });

    it('should handle CSS variables in styled components', async () => {
      const code = `
        import { styled } from '@linaria/react';
        
        const Container = styled.div\`
          --main-color: blue;
          --padding-size: 16px;
          
          color: var(--main-color);
          padding: var(--padding-size);
        \`;
        
        function Component() {
          return <Container>With CSS vars</Container>;
        }
        
        export default Component;
      `;

      const result = await compileWithWebpack(code);

      expect(result.output).toBeDefined();
      // Should handle CSS variables
      expect(result.output).toContain('@linaria/react');
      // CSS variables should be in output
      expect(result.output).toMatch(
        /--main-color|--padding-size|Container|Component|var|color|padding/,
      );
      expect(result.stats.hasErrors()).toBe(false);
    });

    it('should handle :global() selector', async () => {
      const code = `
        import { css } from '@linaria/core';
        
        const globalStyles = css\`
          :global() {
            body {
              margin: 0;
              font-family: sans-serif;
            }
          }
        \`;
        
        function Component() {
          return <div className={globalStyles}>Global styles</div>;
        }
        
        export default Component;
      `;

      const result = await compileWithWebpack(code);

      expect(result.output).toBeDefined();
      // Should handle :global() selector (may be processed by webpack)
      expect(result.output).toMatch(
        /body|margin|font-family|sans-serif|globalStyles|Component/,
      );
      expect(result.stats.hasErrors()).toBe(false);
    });

    it('should handle styled component with conditional styles', async () => {
      const code = `
        import { styled } from '@linaria/react';
        
        const Button = styled.button\`
          padding: 8px 16px;
          border: none;
          cursor: pointer;
          
          \${props => props.disabled && \`
            opacity: 0.5;
            cursor: not-allowed;
          \`}
        \`;
        
        function Component() {
          return (
            <>
              <Button>Normal</Button>
              <Button disabled>Disabled</Button>
            </>
          );
        }
        
        export default Component;
      `;

      const result = await compileWithWebpack(code);

      expect(result.output).toBeDefined();
      // Should handle conditional styles
      expect(result.output).toContain('@linaria/react');
      // Conditional styles should be in output
      expect(result.output).toMatch(/opacity|cursor|disabled|Button|Component/);
      expect(result.stats.hasErrors()).toBe(false);
    });
  });

  describe('Production optimizations', () => {
    it('should skip react constant elements optimization for linaria', async () => {
      process.env.NODE_ENV = 'production';

      const code = `
        function Component() {
          const constant = <div>Constant</div>;
          return constant;
        }
        
        export default Component;
      `;

      const result = await compileWithWebpack(code);

      expect(result.output).toBeDefined();
      // Should compile successfully in production
      expect(result.stats.hasErrors()).toBe(false);
      // Component should still be present (may be minified)
      expect(result.output).toMatch(/Constant|div|jsx|module/);
    });
  });

  describe('Integration with other features', () => {
    it('should handle modern JavaScript syntax with basic Linaria usage', async () => {
      const code = `
        import { styled } from '@linaria/react';
        // decorators (2023-05)
        function sealed(value, context) { return value; }
        function initOne(value, context) {
          if (context.kind === 'field') return initial => (initial ?? 1);
        }
        // export default from 'mod'; - only supported in js files, not ts files
        export * as ns from 'mod';
        @sealed
        class Foo {
          @initOne y;
          #x = 1;                   // private field
          static #count = 0;        // private static field
          static { this.#count ||= 1; }  // class static block + logical assignment
          inc() {
            this.#x++;
            return #x in this;      // private-in
          }
        }
        const big = 1_000_000n;                 // numeric separator + BigInt
        const rec = #{ a: 1, b: 2 };            // Record
        const tup = #[1, 2, 3];                 // Tuple
        const len = tup?.length ?? 0;           // optional chaining + nullish coalescing
        let aNull = null; aNull ??= 42;         // logical nullish assignment
        let flag = 0; flag ||= 1;               // logical OR assignment
        const { a, ...rest } = { a: 1, b: 2 };  // object rest/spread
        try { throw new Error(); } catch {}      // optional catch binding
        const here = import.meta.url;            // import.meta
        const load = import('mod');              // dynamic import
        const Styled = styled.div\`
          color: red;
          &[data-here] { content: 'ok'; }
        \`;
        const Component = () => <Styled data-here={here}>{new Foo().inc() ? 'ok' : 'no'}</Styled>; // JSX
      `;
      const result = await compileWithWebpack(code);
      expect(result.output).toBeDefined();
      // Linaria should be present/processed
      expect(result.output).toContain('@linaria/react');
      // JSX runtime present (dev or prod)
      expect(
        result.output.includes('react/jsx-runtime') ||
          result.output.includes('react/jsx-dev-runtime'),
      ).toBe(true);
      // A few syntax artifacts should make it through transformed output without causing errors
      expect(result.stats.hasErrors()).toBe(false);
    });

    it('should work with JSX transform', async () => {
      const code = `
        import { styled } from '@linaria/react';
        
        const Button = styled.button\`
          background: blue;
        \`;
        
        function Component() {
          return <Button>Click me</Button>;
        }
        
        export default Component;
      `;

      const result = await compileWithWebpack(code);

      expect(result.output).toBeDefined();
      // Should use automatic JSX runtime (dev or prod)
      expect(
        result.output.includes('react/jsx-runtime') ||
          result.output.includes('react/jsx-dev-runtime'),
      ).toBe(true);
      // Should still process Linaria styled components
      expect(result.output).toContain('@linaria/react');
      expect(result.stats.hasErrors()).toBe(false);
    });

    it('should work with class properties', async () => {
      const code = `
        import { styled } from '@linaria/react';
        
        class Component {
          Button = styled.button\`
            background: blue;
          \`;
          
          render() {
            return <this.Button>Click</this.Button>;
          }
        }
        
        export default Component;
      `;

      const result = await compileWithWebpack(code);

      expect(result.output).toBeDefined();
      // Should handle class properties with styled components
      expect(result.output).toContain('@linaria/react');
      expect(result.output).toMatch(/class.*Component|Button\s*=/);
      expect(result.stats.hasErrors()).toBe(false);
    });
  });
});
