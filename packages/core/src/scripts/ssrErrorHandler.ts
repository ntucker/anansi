/**
 * Utilities for handling SSR errors gracefully
 */

/**
 * Extract HTTP status code from an error object.
 * Looks for a `status` property that is a number or parseable string.
 * Returns 500 if no valid status found.
 */
export function getErrorStatus(error: unknown): number {
  if (error && typeof error === 'object' && 'status' in error) {
    const status = (error as { status: unknown }).status;
    if (typeof status === 'number' && status >= 100 && status < 600) {
      return status;
    }
    if (typeof status === 'string') {
      const parsed = parseInt(status, 10);
      if (!isNaN(parsed) && parsed >= 100 && parsed < 600) {
        return parsed;
      }
    }
  }
  return 500;
}

/**
 * Escape HTML special characters to prevent XSS
 */
export function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export interface RenderErrorPageOptions {
  /** Show stack trace in output */
  showStack?: boolean;
  /** Additional hint message to display */
  hint?: string;
  /** Badge text to display (e.g., "DEV MODE") */
  badge?: string;
}

/**
 * Render an HTML error page for SSR failures
 */
export function renderErrorPage(
  error: unknown,
  url: string,
  statusCode: number,
  options: RenderErrorPageOptions = {},
): string {
  const errorMessage = error instanceof Error ? error.message : String(error);
  const stack = error instanceof Error ? error.stack : undefined;
  const { showStack = false, hint, badge } = options;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${statusCode} - Server Error</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #1a1a2e; color: #eee; min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 2rem; }
    .container { max-width: 800px; width: 100%; }
    h1 { color: #ff6b6b; font-size: 2.5rem; margin-bottom: 1rem; }
    .badge { display: inline-block; background: #4ecdc4; color: #1a1a2e; padding: 0.25rem 0.5rem; border-radius: 4px; font-size: 0.75rem; font-weight: 600; margin-bottom: 1rem; }
    .url { color: #888; font-size: 0.9rem; margin-bottom: 1.5rem; word-break: break-all; }
    .message { background: #16213e; border-left: 4px solid #ff6b6b; padding: 1rem 1.5rem; border-radius: 0 8px 8px 0; margin-bottom: 1.5rem; }
    .message code { color: #ff6b6b; font-size: 1.1rem; }
    .stack { background: #0f0f23; border-radius: 8px; padding: 1.5rem; overflow-x: auto; font-family: 'Monaco', 'Menlo', monospace; font-size: 0.85rem; line-height: 1.6; color: #aaa; white-space: pre-wrap; word-break: break-word; }
    .retry { margin-top: 2rem; }
    .retry a { color: #4ecdc4; text-decoration: none; padding: 0.75rem 1.5rem; border: 2px solid #4ecdc4; border-radius: 6px; display: inline-block; transition: all 0.2s; }
    .retry a:hover { background: #4ecdc4; color: #1a1a2e; }
    .hint { margin-top: 1.5rem; color: #888; font-size: 0.9rem; }
  </style>
</head>
<body>
  <div class="container">
    ${badge ? `<span class="badge">${escapeHtml(badge)}</span>` : ''}
    <h1>${statusCode} - Server Error</h1>
    <p class="url">Error rendering: ${escapeHtml(url)}</p>
    <div class="message">
      <code>${escapeHtml(errorMessage)}</code>
    </div>
    ${showStack && stack ? `<pre class="stack">${escapeHtml(stack)}</pre>` : ''}
    <div class="retry">
      <a href="${escapeHtml(url)}">Retry</a>
    </div>
    ${hint ? `<p class="hint">${escapeHtml(hint)}</p>` : ''}
  </div>
</body>
</html>`;
}
