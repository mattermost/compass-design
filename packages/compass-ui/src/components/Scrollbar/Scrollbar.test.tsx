import { describe, expect, it } from 'vitest';
import { render } from '@/test-utils/render';
import Scrollbar from './Scrollbar';

describe('Scrollbar', () => {
  it('adds the wide size modifier class', () => {
    const { container, rerender } = render(
      <Scrollbar>
        <p>content</p>
      </Scrollbar>,
    );
    const root = () => container.firstElementChild as HTMLElement;
    expect(root().className).toMatch(/scrollbar/);
    expect(root().className).not.toMatch(/size-wide/);

    rerender(
      <Scrollbar size="wide">
        <p>content</p>
      </Scrollbar>,
    );
    expect(root().className).toMatch(/size-wide/);
  });
});
