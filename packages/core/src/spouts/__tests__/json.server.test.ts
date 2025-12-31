import { serializeForScriptTag } from '../json.server';

describe('serializeForScriptTag', () => {
  it('should serialize basic objects', () => {
    const result = serializeForScriptTag({ foo: 'bar', num: 42 });
    expect(JSON.parse(result)).toEqual({ foo: 'bar', num: 42 });
  });

  it('should escape < to prevent </script> injection', () => {
    const result = serializeForScriptTag({
      html: '</script><script>alert(1)</script>',
    });

    // Should not contain literal < characters
    expect(result).not.toContain('<');
    // Should contain the escaped version
    expect(result).toContain('\\u003c');
    // Should still parse back correctly
    expect(JSON.parse(result)).toEqual({
      html: '</script><script>alert(1)</script>',
    });
  });

  it('should escape U+2028 line separator', () => {
    const input = { text: 'line1\u2028line2' };
    const result = serializeForScriptTag(input);

    // Should not contain literal U+2028
    expect(result).not.toContain('\u2028');
    // Should contain the escaped version
    expect(result).toContain('\\u2028');
    // Should still parse back correctly
    expect(JSON.parse(result)).toEqual(input);
  });

  it('should escape U+2029 paragraph separator', () => {
    const input = { text: 'para1\u2029para2' };
    const result = serializeForScriptTag(input);

    // Should not contain literal U+2029
    expect(result).not.toContain('\u2029');
    // Should contain the escaped version
    expect(result).toContain('\\u2029');
    // Should still parse back correctly
    expect(JSON.parse(result)).toEqual(input);
  });

  it('should NOT HTML-escape > character (must remain as-is for JSON validity)', () => {
    const input = { arrow: '->', comparison: 'a > b' };
    const result = serializeForScriptTag(input);

    // Should contain literal > (NOT &gt;)
    expect(result).toContain('>');
    expect(result).not.toContain('&gt;');
    // Should still parse back correctly
    expect(JSON.parse(result)).toEqual(input);
  });

  it('should NOT HTML-escape & character', () => {
    const input = { text: 'foo & bar' };
    const result = serializeForScriptTag(input);

    expect(result).toContain('&');
    expect(result).not.toContain('&amp;');
    expect(JSON.parse(result)).toEqual(input);
  });

  it('should handle complex nested objects', () => {
    const input = {
      issues: [
        { id: 1, body: 'Fix </script> bug', reactions: { '+1': 5 } },
        { id: 2, body: 'Path: a -> b -> c', reactions: { '-1': 0 } },
      ],
      meta: { total: 2 },
    };
    const result = serializeForScriptTag(input);

    expect(result).not.toContain('<');
    expect(JSON.parse(result)).toEqual(input);
  });

  it('should handle strings with quotes correctly', () => {
    const input = { text: 'He said "hello" and \'goodbye\'' };
    const result = serializeForScriptTag(input);

    // Should be valid JSON (quotes properly escaped by JSON.stringify)
    expect(JSON.parse(result)).toEqual(input);
  });

  it('should handle null values', () => {
    expect(serializeForScriptTag(null)).toBe('null');
  });

  it('should handle arrays', () => {
    const input = ['<script>', 'normal', '\u2028'];
    const result = serializeForScriptTag(input);

    expect(result).not.toContain('<');
    expect(result).not.toContain('\u2028');
    expect(JSON.parse(result)).toEqual(input);
  });

  it('should handle empty objects and arrays', () => {
    expect(serializeForScriptTag({})).toBe('{}');
    expect(serializeForScriptTag([])).toBe('[]');
  });
});
