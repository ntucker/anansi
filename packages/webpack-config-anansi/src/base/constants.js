import path from 'path';


export const ROOT_PATH = path.resolve();
export const LIBRARY_MODULES_PATH = path.join(
  'node_modules',
  ...path
    .join(__dirname, '../../node_modules')
    .split(path.sep)
    .slice(-2),
);
