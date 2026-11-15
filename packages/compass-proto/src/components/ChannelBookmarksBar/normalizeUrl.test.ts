import { describe, expect, it } from 'vitest';
import { normalizeUrl } from './normalizeUrl';

describe('normalizeUrl', () => {
  it('adds https to bare domains', () => {
    expect(normalizeUrl('example.com/a')).toBe('https://example.com/a');
  });

  it('keeps explicit http(s) links', () => {
    expect(normalizeUrl('http://example.org/x')).toBe('http://example.org/x');
  });

  it('accepts single-label hosts with an explicit scheme', () => {
    expect(normalizeUrl('http://intranet/handbook')).toBe(
      'http://intranet/handbook',
    );
  });

  it('accepts localhost with and without a scheme, with a port', () => {
    expect(normalizeUrl('http://localhost:8065/')).toBe(
      'http://localhost:8065/',
    );
    expect(normalizeUrl('localhost:8065')).toBe('https://localhost:8065/');
    expect(normalizeUrl('localhost')).toBe('https://localhost/');
  });

  it('rejects a bare word with no scheme', () => {
    expect(normalizeUrl('nope')).toBeNull();
  });

  it('rejects non-http(s) schemes', () => {
    expect(normalizeUrl('mailto:a@b.co')).toBeNull();
    expect(normalizeUrl('javascript:alert(1)')).toBeNull();
    expect(normalizeUrl('ftp://example.com/f')).toBeNull();
  });

  it('rejects empty input', () => {
    expect(normalizeUrl('   ')).toBeNull();
  });
});
