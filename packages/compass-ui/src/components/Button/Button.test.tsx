import { createRef, forwardRef, type ReactNode } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { render } from '@/test-utils/render';
import Icon from '@/components/Icon/Icon';
import Button from './Button';

function FakeGlyph() {
  return <svg data-testid="glyph" />;
}

describe('Button', () => {
  it('applies compact and dim modifiers', () => {
    const { container } = render(
      <Button compact emphasis="dim">
        Filter
      </Button>,
    );
    const button = container.querySelector('button')!;
    expect(button.className).toMatch(/button--compact/);
    expect(button.className).toMatch(/emphasis-dim/);
  });

  it('renders non-icon JSX in leading and trailing slots', () => {
    const { container } = render(
      <Button
        leadingIcon={<span data-testid="leading-badge">3</span>}
        trailingIcon={<span data-testid="trailing-badge">Status</span>}
      >
        Group by
      </Button>,
    );
    expect(
      container.querySelector('[data-testid="leading-badge"]'),
    ).not.toBeNull();
    expect(
      container.querySelector('[data-testid="trailing-badge"]'),
    ).not.toBeNull();
    expect(
      container.querySelectorAll('[class*="button__icon-slot"]'),
    ).toHaveLength(2);
  });

  it('omits slots when leading/trailing content is absent', () => {
    const { container } = render(
      <Button leadingIcon={false} trailingIcon={null}>
        Label
      </Button>,
    );
    expect(
      container.querySelectorAll('[class*="button__icon-slot"]'),
    ).toHaveLength(0);
  });
});

describe('Button asChild', () => {
  it('renders a single <a> with Button anatomy and no nested <button>', () => {
    const { container } = render(
      <Button asChild emphasis="primary" className="extra">
        <a href="/team/emoji/add">Add Custom Emoji</a>
      </Button>,
    );
    expect(container.querySelectorAll('button')).toHaveLength(0);
    const anchor = container.querySelector('a');
    expect(anchor).not.toBeNull();
    expect(anchor?.getAttribute('href')).toBe('/team/emoji/add');
    expect(anchor?.className).toMatch(/button/);
    expect(anchor?.className).toMatch(/emphasis-primary/);
    expect(anchor?.className).toContain('extra');
    expect(anchor?.querySelector('[class*="button__label"]')?.textContent).toBe(
      'Add Custom Emoji',
    );
    expect(container.querySelectorAll('a')).toHaveLength(1);
  });

  it('renders leading and trailing icons for emphasis="link"', () => {
    const { container } = render(
      <Button
        emphasis="link"
        leadingIcon={<Icon glyph={<FakeGlyph />} />}
        trailingIcon={<Icon glyph={<FakeGlyph />} />}
      >
        Learn more
      </Button>,
    );
    const slots = container.querySelectorAll('[class*="button__icon-slot"]');
    expect(slots).toHaveLength(2);
    expect(container.querySelectorAll('[data-testid="glyph"]')).toHaveLength(2);
  });

  it('renders link-emphasis icons with asChild', () => {
    const { container } = render(
      <Button
        asChild
        emphasis="link"
        leadingIcon={<Icon glyph={<FakeGlyph />} />}
      >
        <a href="/docs">Docs</a>
      </Button>,
    );
    expect(
      container
        .querySelector('a')
        ?.querySelectorAll('[class*="button__icon-slot"]'),
    ).toHaveLength(1);
  });

  it('does not forward type', () => {
    const { container } = render(
      <Button asChild {...({ type: 'submit' } as object)}>
        <a href="/x">Go</a>
      </Button>,
    );
    expect(container.querySelector('a')?.hasAttribute('type')).toBe(false);
  });

  it('sets aria-disabled and blocks click when disabled', () => {
    const { container } = render(
      <Button asChild disabled>
        <a href="/x">Go</a>
      </Button>,
    );
    const anchor = container.querySelector('a')!;
    expect(anchor.getAttribute('aria-disabled')).toBe('true');
    expect(anchor.className).toMatch(/button--disabled/);
    const event = new MouseEvent('click', { bubbles: true, cancelable: true });
    anchor.dispatchEvent(event);
    expect(event.defaultPrevented).toBe(true);
  });

  it('shows spinner and aria-busy when loading', () => {
    const { container } = render(
      <Button asChild loading leadingIcon={<Icon glyph={<FakeGlyph />} />}>
        <a href="/x">Saving</a>
      </Button>,
    );
    const anchor = container.querySelector('a')!;
    expect(anchor.getAttribute('aria-busy')).toBe('true');
    expect(anchor.getAttribute('aria-disabled')).toBe('true');
    expect(container.querySelector('[class*="spinner"]')).not.toBeNull();
  });

  it('forwards ref to the anchor', () => {
    const ref = createRef<HTMLAnchorElement>();
    render(
      <Button asChild ref={ref}>
        <a href="/x">Go</a>
      </Button>,
    );
    expect(ref.current).toBeInstanceOf(HTMLAnchorElement);
    ref.current?.focus();
    expect(document.activeElement).toBe(ref.current);
  });

  it('works with a forwardRef Link stand-in', () => {
    const Link = forwardRef<
      HTMLAnchorElement,
      { to: string; children?: ReactNode; className?: string }
    >(function Link({ to, children, className }, ref) {
      return (
        <a ref={ref} href={to} className={className} data-router-link>
          {children}
        </a>
      );
    });
    const ref = createRef<HTMLAnchorElement>();
    const { container } = render(
      <Button asChild ref={ref} emphasis="secondary">
        <Link to="/team/emoji/add">Add</Link>
      </Button>,
    );
    const anchor = container.querySelector('a');
    expect(anchor?.getAttribute('href')).toBe('/team/emoji/add');
    expect(anchor?.hasAttribute('data-router-link')).toBe(true);
    expect(ref.current).toBe(anchor);
  });

  it('composes onClick handlers', () => {
    const host = vi.fn();
    const child = vi.fn();
    const { container } = render(
      <Button asChild onClick={host}>
        <a href="/x" onClick={child}>
          Go
        </a>
      </Button>,
    );
    container
      .querySelector('a')!
      .dispatchEvent(
        new MouseEvent('click', { bubbles: true, cancelable: true }),
      );
    expect(child).toHaveBeenCalledOnce();
    expect(host).toHaveBeenCalledOnce();
  });
});
