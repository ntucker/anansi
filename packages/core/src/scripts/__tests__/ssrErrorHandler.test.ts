import {
  escapeHtml,
  getErrorStatus,
  renderErrorPage,
} from '../ssrErrorHandler';

describe('ssrErrorHandler', () => {
  describe('getErrorStatus', () => {
    it('should return 500 for null', () => {
      expect(getErrorStatus(null)).toBe(500);
    });

    it('should return 500 for undefined', () => {
      expect(getErrorStatus(undefined)).toBe(500);
    });

    it('should return 500 for plain Error without status', () => {
      expect(getErrorStatus(new Error('test'))).toBe(500);
    });

    it('should return 500 for string error', () => {
      expect(getErrorStatus('something went wrong')).toBe(500);
    });

    it('should return 500 for number error', () => {
      expect(getErrorStatus(42)).toBe(500);
    });

    it('should extract numeric status from error object', () => {
      expect(getErrorStatus({ status: 404, message: 'Not Found' })).toBe(404);
      expect(getErrorStatus({ status: 429, message: 'Rate Limited' })).toBe(
        429,
      );
      expect(
        getErrorStatus({ status: 503, message: 'Service Unavailable' }),
      ).toBe(503);
    });

    it('should extract string status from error object', () => {
      expect(getErrorStatus({ status: '404', message: 'Not Found' })).toBe(404);
      expect(getErrorStatus({ status: '500', message: 'Error' })).toBe(500);
    });

    it('should return 500 for invalid numeric status codes', () => {
      expect(getErrorStatus({ status: 99 })).toBe(500); // too low
      expect(getErrorStatus({ status: 600 })).toBe(500); // too high
      expect(getErrorStatus({ status: -1 })).toBe(500); // negative
      expect(getErrorStatus({ status: 0 })).toBe(500); // zero
    });

    it('should return 500 for invalid string status codes', () => {
      expect(getErrorStatus({ status: '99' })).toBe(500); // too low
      expect(getErrorStatus({ status: '600' })).toBe(500); // too high
      expect(getErrorStatus({ status: 'abc' })).toBe(500); // not a number
      expect(getErrorStatus({ status: '' })).toBe(500); // empty string
    });

    it('should return 500 for non-number/string status values', () => {
      expect(getErrorStatus({ status: null })).toBe(500);
      expect(getErrorStatus({ status: undefined })).toBe(500);
      expect(getErrorStatus({ status: {} })).toBe(500);
      expect(getErrorStatus({ status: [] })).toBe(500);
      expect(getErrorStatus({ status: true })).toBe(500);
    });

    it('should work with Error objects that have status property', () => {
      const error = new Error('Rate Limited') as Error & { status: number };
      error.status = 429;
      expect(getErrorStatus(error)).toBe(429);
    });

    it('should handle boundary values', () => {
      expect(getErrorStatus({ status: 100 })).toBe(100); // min valid
      expect(getErrorStatus({ status: 599 })).toBe(599); // max valid
    });
  });

  describe('escapeHtml', () => {
    it('should escape ampersands', () => {
      expect(escapeHtml('foo & bar')).toBe('foo &amp; bar');
    });

    it('should escape less than', () => {
      expect(escapeHtml('<script>')).toBe('&lt;script&gt;');
    });

    it('should escape greater than', () => {
      expect(escapeHtml('a > b')).toBe('a &gt; b');
    });

    it('should escape double quotes', () => {
      expect(escapeHtml('say "hello"')).toBe('say &quot;hello&quot;');
    });

    it('should escape single quotes', () => {
      expect(escapeHtml("it's")).toBe('it&#039;s');
    });

    it('should escape multiple special characters', () => {
      expect(escapeHtml('<script>alert("xss")</script>')).toBe(
        '&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;',
      );
    });

    it('should return empty string for empty input', () => {
      expect(escapeHtml('')).toBe('');
    });

    it('should not modify strings without special characters', () => {
      expect(escapeHtml('hello world')).toBe('hello world');
    });
  });

  describe('renderErrorPage', () => {
    it('should render basic error page with status code', () => {
      const html = renderErrorPage(new Error('Test error'), '/test', 500);

      expect(html).toContain('<!DOCTYPE html>');
      expect(html).toContain('<title>500 - Server Error</title>');
      expect(html).toContain('<h1>500 - Server Error</h1>');
      expect(html).toContain('Test error');
      expect(html).toContain('/test');
    });

    it('should render different status codes', () => {
      const html404 = renderErrorPage({ message: 'Not Found' }, '/page', 404);
      const html429 = renderErrorPage({ message: 'Rate Limited' }, '/api', 429);

      expect(html404).toContain('<title>404 - Server Error</title>');
      expect(html404).toContain('<h1>404 - Server Error</h1>');
      expect(html429).toContain('<title>429 - Server Error</title>');
      expect(html429).toContain('<h1>429 - Server Error</h1>');
    });

    it('should escape URL in output', () => {
      const html = renderErrorPage(
        new Error('error'),
        '/test?foo=<script>',
        500,
      );

      expect(html).toContain('&lt;script&gt;');
      expect(html).not.toContain('<script>');
    });

    it('should escape error message in output', () => {
      const html = renderErrorPage(
        new Error('<script>alert("xss")</script>'),
        '/test',
        500,
      );

      expect(html).toContain('&lt;script&gt;');
      expect(html).not.toContain('<script>alert');
    });

    it('should show stack trace when showStack is true', () => {
      const error = new Error('Test error');
      const html = renderErrorPage(error, '/test', 500, { showStack: true });

      expect(html).toContain('<pre class="stack">');
      expect(html).toContain('Error: Test error');
    });

    it('should hide stack trace when showStack is false', () => {
      const error = new Error('Test error');
      const html = renderErrorPage(error, '/test', 500, { showStack: false });

      expect(html).not.toContain('<pre class="stack">');
    });

    it('should hide stack trace by default', () => {
      const error = new Error('Test error');
      const html = renderErrorPage(error, '/test', 500);

      expect(html).not.toContain('<pre class="stack">');
    });

    it('should show badge when provided', () => {
      const html = renderErrorPage(new Error('error'), '/test', 500, {
        badge: 'DEV MODE',
      });

      expect(html).toContain('<span class="badge">DEV MODE</span>');
    });

    it('should not show badge when not provided', () => {
      const html = renderErrorPage(new Error('error'), '/test', 500);

      expect(html).not.toContain('class="badge"');
    });

    it('should show hint when provided', () => {
      const html = renderErrorPage(new Error('error'), '/test', 500, {
        hint: 'Try again later',
      });

      expect(html).toContain('<p class="hint">Try again later</p>');
    });

    it('should not show hint when not provided', () => {
      const html = renderErrorPage(new Error('error'), '/test', 500);

      expect(html).not.toContain('class="hint"');
    });

    it('should escape badge text', () => {
      const html = renderErrorPage(new Error('error'), '/test', 500, {
        badge: '<script>alert("xss")</script>',
      });

      expect(html).toContain('&lt;script&gt;');
      expect(html).not.toContain('<script>alert');
    });

    it('should escape hint text', () => {
      const html = renderErrorPage(new Error('error'), '/test', 500, {
        hint: '<script>alert("xss")</script>',
      });

      expect(html).toContain('&lt;script&gt;');
      expect(html).not.toContain('<script>alert');
    });

    it('should handle string errors', () => {
      const html = renderErrorPage('Something went wrong', '/test', 500);

      expect(html).toContain('Something went wrong');
    });

    it('should handle object errors without message', () => {
      const html = renderErrorPage({ code: 'ERR_001' }, '/test', 500);

      expect(html).toContain('[object Object]');
    });

    it('should include retry link with correct URL', () => {
      const html = renderErrorPage(new Error('error'), '/my-page', 500);

      expect(html).toContain('<a href="/my-page">Retry</a>');
    });

    it('should escape retry link URL', () => {
      const html = renderErrorPage(new Error('error'), '/page?a=1&b=2', 500);

      expect(html).toContain('href="/page?a=1&amp;b=2"');
    });
  });
});
