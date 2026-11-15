import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, describe, expect, it } from 'vitest';
import { ProductRail } from '../ProductRail';
import ProductShell from './ProductShell';

(
  globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

let root: Root | undefined;
let container: HTMLElement | undefined;
function render(ui: React.ReactElement) {
  container = document.createElement('div');
  document.body.appendChild(container);
  root = createRoot(container);
  act(() => root!.render(ui));
  return container;
}
afterEach(() => {
  act(() => root?.unmount());
  container?.remove();
});

const rail = (
  <ProductRail items={[{ id: 'channels', label: 'Channels', icon: <svg /> }]} />
);

describe('ProductShell', () => {
  it('renders the rail, sidebar and main content with no team sidebar', () => {
    const c = render(
      <ProductShell
        productRail={rail}
        sidebar={<div data-testid="sidebar" />}
        trailing={<aside data-testid="trailing" />}
      >
        <div data-testid="main" />
      </ProductShell>,
    );
    expect(c.querySelector('nav[aria-label="Products"]')).not.toBeNull();
    expect(c.querySelector('[data-testid="sidebar"]')).not.toBeNull();
    expect(c.querySelector('[data-testid="main"]')).not.toBeNull();
    expect(c.querySelector('[data-testid="trailing"]')).not.toBeNull();
    expect(c.querySelector('[aria-label="Add team"]')).toBeNull();
  });

  it('omits the sidebar column when none is given', () => {
    const c = render(<ProductShell productRail={rail} />);
    expect(c.querySelector('[class*="channels-sidebar"]')).toBeNull();
  });

  it('hides the Global Header product name, unless asked to show it', () => {
    const hidden = render(<ProductShell productRail={rail} product="boards" />);
    expect(hidden.querySelector('header')!.textContent).not.toContain('Boards');
    act(() => root?.unmount());
    const shown = render(
      <ProductShell
        productRail={rail}
        product="boards"
        globalHeaderProps={{ showProductBranding: true }}
      />,
    );
    expect(shown.querySelector('header')!.textContent).toContain('Boards');
  });
});
