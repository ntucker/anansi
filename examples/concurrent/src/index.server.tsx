import app from 'app';
import laySpouts from 'ssr/laySpouts';

import { createRouter } from './routing';

export default laySpouts(createRouter, app);
