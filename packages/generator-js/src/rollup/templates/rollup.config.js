import commonjs from 'rollup-plugin-commonjs';
import resolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';
import json from 'rollup-plugin-json';
import { terser } from 'rollup-plugin-terser';
import filesize from 'rollup-plugin-filesize';
import replace from 'rollup-plugin-replace';

import pkg from './package.json';

const dependencies = Object.keys(pkg.dependencies).concat(
  Object.keys(pkg.peerDependencies || {}),
);

const extensions = ['.js', '.ts', '.tsx', '.mjs', '.json', '.node'];
process.env.NODE_ENV = 'production';

function isExternal(id) {
  const ret = dependencies.includes(id);
  if (!ret) {
    for (const dep of dependencies) {
      if (id.startsWith(dep)) return true;
    }
  }
  return ret;
}

export default [
  // browser-friendly UMD build
  {
    input: '<%= rootPath %>/index.ts',
    external: isExternal,
    output: [{ file: pkg.unpkg, format: 'umd', name: '<%= appName %>' }],
    plugins: [
      babel({
        exclude: ['node_modules/**', '**/__tests__/**'],
        extensions,
        runtimeHelpers: true,
      }),
      replace({ 'process.env.NODE_ENV': JSON.stringify('production') }),
      resolve({ extensions }),
      commonjs({ extensions }),
      json(),
      terser({}),
      filesize(),
    ],
  },
  // node-friendly commonjs build
  {
    input: '<%= rootPath %>/index.ts',
    external: isExternal,
    output: [{ file: pkg.main, format: 'cjs' }],
    plugins: [
      babel({
        exclude: ['node_modules/**', '**/__tests__/**', '**/*.d.ts'],
        extensions,
        runtimeHelpers: true,
      }),
      resolve({ extensions }),
      commonjs({ extensions }),
    ],
  },
];
