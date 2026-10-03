import { afterEach, describe, expect, it } from 'vitest';
import { readDurationMs } from './duration';

describe('readDurationMs', () => {
  afterEach(() => document.documentElement.style.removeProperty('--t'));

  it('falls back when the token is missing', () => {
    expect(readDurationMs('--t', 150)).toBe(150);
  });

  it('parses ms and s values', () => {
    document.documentElement.style.setProperty('--t', '300ms');
    expect(readDurationMs('--t', 150)).toBe(300);
    document.documentElement.style.setProperty('--t', '0.2s');
    expect(readDurationMs('--t', 150)).toBe(200);
  });
});
