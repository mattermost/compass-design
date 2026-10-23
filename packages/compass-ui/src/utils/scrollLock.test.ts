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

  describe('scrollbar compensation', () => {
    const root = document.documentElement;
    const innerWidth = window.innerWidth;

    const setViewport = (clientWidth: number, inner = 1024) => {
      Object.defineProperty(root, 'clientWidth', {
        configurable: true,
        value: clientWidth,
      });
      Object.defineProperty(window, 'innerWidth', {
        configurable: true,
        value: inner,
      });
    };

    afterEach(() => {
      Reflect.deleteProperty(root, 'clientWidth');
      Object.defineProperty(window, 'innerWidth', {
        configurable: true,
        value: innerWidth,
      });
      document.body.style.paddingRight = '';
    });

    it('pads the body by the scrollbar width and restores the padding', () => {
      setViewport(1009);
      document.body.style.paddingRight = '4px';
      const release = lockBodyScroll();
      expect(document.body.style.paddingRight).toBe('19px');
      release();
      expect(document.body.style.paddingRight).toBe('4px');
    });

    it('adds no padding without a visible scrollbar', () => {
      setViewport(1024);
      const release = lockBodyScroll();
      expect(document.body.style.paddingRight).toBe('');
      release();
    });
  });

  describe('per document', () => {
    it('locks and restores each document independently', () => {
      const other = document.implementation.createHTMLDocument('other');
      other.body.style.overflow = 'auto';
      const releaseMain = lockBodyScroll();
      const releaseOther = lockBodyScroll(other);
      expect(document.body.style.overflow).toBe('hidden');
      expect(other.body.style.overflow).toBe('hidden');

      releaseMain();
      expect(document.body.style.overflow).toBe('');
      expect(other.body.style.overflow).toBe('hidden');

      releaseOther();
      expect(other.body.style.overflow).toBe('auto');
    });
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
