import { definePreviewAddon } from 'storybook/internal/csf';
import type { PreviewAddon } from 'storybook/internal/csf';

import previewAnnotations from './preview.js';

export default function setupAddon(): PreviewAddon {
  return definePreviewAddon(previewAnnotations);
}

export * from './types.js';
