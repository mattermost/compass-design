import { afterEach, describe, expect, it } from 'vitest';
import { act, createRef, type ReactElement } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import AnchoredPopup from './AnchoredPopup';

(
  globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

const mounted: Array<{ root: Root; container: HTMLElement }> = [];

afterEach(() => {
  for (const { root, container } of mounted.splice(0)) {
    act(() => root.unmount());
    container.remove();
  }
  document.body.innerHTML = '';
});

function render(ui: ReactElement) {
  const container = document.createElement('div');
  document.body.appendChild(container);
  const root = createRoot(container);
  act(() => root.render(ui));
  mounted.push({ root, container });
  return { container };
}

function anchor(rect: Partial<DOMRect>) {
  const el = document.createElement('div');
  document.body.appendChild(el);
  el.getBoundingClientRect = () =>
    ({
      left: 0,
      top: 0,
      width: 0,
      height: 0,
      bottom: 0,
      right: 0,
      ...rect,
    }) as DOMRect;
  return { current: el };
}

describe('AnchoredPopup', () => {
  it('portals to document.body, outside the host container', () => {
    const ref = anchor({ left: 40, top: 400, width: 300, bottom: 450 });
    const { container } = render(
      <AnchoredPopup anchorRef={ref} data-testid="pop">
        content
      </AnchoredPopup>,
    );
    const pop = document.querySelector('[data-testid="pop"]') as HTMLElement;
    expect(pop.parentElement).toBe(document.body);
    expect(container.contains(pop)).toBe(false);
  });

  it('aligns left with the anchor, matches its width and sits 4px above', () => {
    const ref = anchor({ left: 40, top: 400, width: 300, bottom: 450 });
    render(
      <AnchoredPopup anchorRef={ref} data-testid="pop">
        content
      </AnchoredPopup>,
    );
    const pop = document.querySelector('[data-testid="pop"]') as HTMLElement;
    Object.defineProperty(pop, 'offsetHeight', { value: 100 });
    act(() => {
      window.dispatchEvent(new Event('resize'));
    });
    expect(pop.style.left).toBe('40px');
    expect(pop.style.width).toBe('300px');
    expect(pop.style.top).toBe('296px'); // 400 - 4 gap - 100 height
    expect(pop.style.zIndex).toBe('var(--z-popover)');
  });

  it('flips below when there is no room above', () => {
    const ref = anchor({ left: 0, top: 20, width: 300, bottom: 70 });
    render(
      <AnchoredPopup anchorRef={ref} data-testid="pop">
        content
      </AnchoredPopup>,
    );
    const pop = document.querySelector('[data-testid="pop"]') as HTMLElement;
    Object.defineProperty(pop, 'offsetHeight', { value: 200 });
    act(() => {
      window.dispatchEvent(new Event('resize'));
    });
    expect(pop.style.top).toBe('74px'); // bottom 70 + 4 gap
  });

  it('renders nothing when closed', () => {
    const { container } = render(
      <AnchoredPopup anchorRef={createRef()} open={false}>
        x
      </AnchoredPopup>,
    );
    expect(container.textContent).toBe('');
    expect(document.body.textContent).toBe('');
  });
});

describe('AnchoredPopup with getAnchorRect', () => {
  it('places the popup against a virtual box, not the anchor element', () => {
    render(
      <AnchoredPopup
        getAnchorRect={() => ({ left: 120, top: 300, bottom: 320, width: 10 })}
        style={{ width: 280 }}
        data-testid="pop"
      >
        content
      </AnchoredPopup>,
    );
    const pop = document.querySelector('[data-testid="pop"]') as HTMLElement;
    Object.defineProperty(pop, 'offsetHeight', { value: 100 });
    Object.defineProperty(pop, 'offsetWidth', { value: 280 });
    act(() => {
      window.dispatchEvent(new Event('resize'));
    });
    expect(pop.style.left).toBe('120px');
    expect(pop.style.top).toBe('196px'); // 300 - 4 gap - 100 height
    expect(pop.style.width).toBe('280px'); // host width kept
  });

  it('keeps the popup inside the right edge of the viewport', () => {
    render(
      <AnchoredPopup
        getAnchorRect={() => ({ left: 1000, top: 300, bottom: 320, width: 10 })}
        style={{ width: 280 }}
        data-testid="pop"
      >
        content
      </AnchoredPopup>,
    );
    const pop = document.querySelector('[data-testid="pop"]') as HTMLElement;
    Object.defineProperty(pop, 'offsetWidth', { value: 280 });
    act(() => {
      window.dispatchEvent(new Event('resize'));
    });
    expect(pop.style.left).toBe(`${window.innerWidth - 280 - 8}px`);
  });
});
