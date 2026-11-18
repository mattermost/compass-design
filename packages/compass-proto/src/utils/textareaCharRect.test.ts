import { describe, expect, it } from 'vitest';
import { getTextareaCharRect } from './textareaCharRect';

describe('getTextareaCharRect', () => {
  it('is relative to the textarea box and leaves no mirror behind', () => {
    const ta = document.createElement('textarea');
    ta.value = 'Thanks @e';
    document.body.appendChild(ta);
    ta.getBoundingClientRect = () =>
      ({
        left: 50,
        top: 200,
        right: 350,
        bottom: 250,
        width: 300,
        height: 50,
      }) as DOMRect;
    const before = document.body.children.length;
    const rect = getTextareaCharRect(ta, 7);
    expect(document.body.children.length).toBe(before);
    expect(rect.left).toBeGreaterThanOrEqual(50);
    expect(rect.top).toBeGreaterThanOrEqual(200);
    expect(rect.right - rect.left).toBe(rect.width);
    ta.remove();
  });

  it('measures an index past the end of the text', () => {
    const ta = document.createElement('textarea');
    document.body.appendChild(ta);
    expect(() => getTextareaCharRect(ta, 0)).not.toThrow();
    ta.remove();
  });
});
