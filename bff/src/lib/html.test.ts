import { describe, it, expect } from '@jest/globals';
import { escapeHtml, stripHtmlToText } from './html';

describe('html utilities', () => {
  describe('escapeHtml', () => {
    it('escapes special characters correctly', () => {
      const input = '<script>alert("test" & \'value\')</script>';
      const expected = '&lt;script&gt;alert(&quot;test&quot; &amp; &#39;value&#39;)&lt;/script&gt;';
      expect(escapeHtml(input)).toBe(expected);
    });

    it('returns empty string for empty input', () => {
      expect(escapeHtml('')).toBe('');
    });
  });

  describe('stripHtmlToText', () => {
    it('strips simple html tags', () => {
      const input = '<p>Hello <strong>World</strong>!</p>';
      expect(stripHtmlToText(input)).toBe('Hello World!');
    });

    it('handles nested or malformed tags iteratively to prevent bypasses', () => {
      const input = '<<script>alert("xss")</script>text>';
      expect(stripHtmlToText(input)).not.toContain('<');
      expect(stripHtmlToText(input)).not.toContain('>');
    });

    it('handles plain text without modifications', () => {
      const input = 'Just plain text message.';
      expect(stripHtmlToText(input)).toBe('Just plain text message.');
    });

    it('trims whitespace', () => {
      const input = '   <p>Trimmed</p>   ';
      expect(stripHtmlToText(input)).toBe('Trimmed');
    });
  });
});
