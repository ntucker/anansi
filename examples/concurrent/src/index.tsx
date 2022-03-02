import floodSpouts from 'ssr/floodSpouts';
import app from 'app';

import { createRouter } from './routing';

floodSpouts(createRouter, app);
