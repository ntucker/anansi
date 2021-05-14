import fs from 'fs';
import path from 'path';

import { wrapSource } from '../wrapper';

describe('Wrapper module', () => {
  describe('wrapSource', () => {
    it('should wrap custom worker code inside a Worker class', () => {
      const src = fs.readFileSync(
        path.resolve(__dirname, 'code', 'myworker.js'),
        { encoding: 'utf8', flag: 'r' },
      );
      const desideredWrappedSrc = fs.readFileSync(
        path.resolve(__dirname, 'code', 'wrapped_result.js'),
        { encoding: 'utf8', flag: 'r' },
      );
      const wrappedSrc = wrapSource(src);
      expect(wrappedSrc).toEqual(desideredWrappedSrc);
    });
  });
});
