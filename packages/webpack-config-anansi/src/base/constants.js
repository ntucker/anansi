import path from 'path';
import pkg from '../../package.json';


export const ROOT_PATH = path.resolve();
export const LIBRARY_MODULES_PATH = path.join(
  'node_modules',
  pkg.name,
  'node_modules',
);
