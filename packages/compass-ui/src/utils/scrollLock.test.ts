import { afterEach, describe, expect, it } from 'vitest';
import { lockBodyScroll } from './scrollLock';

describe('lockBodyScroll', () => {
  afterEach(() => {
    document.body.style.overflow = '';
  });

  it('hides body overflow and restores the previous value on release', () => {
    document.body.style.overflow = 'scroll';
    const release = lockBodyScroll();
    expect(document.body.style.overflow).toBe('hidden');
    release();
    expect(document.body.style.overflow).toBe('scroll');
  });

  it('restores only after the last stacked lock is released', () => {
    document.body.style.overflow = 'auto';
    const first = lockBodyScroll();
    const second = lockBodyScroll();
    first();
    expect(document.body.style.overflow).toBe('hidden');
    second();
    expect(document.body.style.overflow).toBe('auto');
  });

  it('ignores a repeated release', () => {
    const first = lockBodyScroll();
    const second = lockBodyScroll();
    first();
    first();
    expect(document.body.style.overflow).toBe('hidden');
    second();
    expect(document.body.style.overflow).toBe('');
  });
});
