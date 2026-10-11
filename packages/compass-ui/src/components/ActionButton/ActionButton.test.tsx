/* eslint-disable jsx-a11y/anchor-has-content -- asChild replaces empty anchor children with action anatomy */
import { createRef, forwardRef, type ReactNode } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { render } from '@/test-utils/render';
import ActionButton from './ActionButton';

describe('ActionButton asChild', () => {
  it('renders a single <a> with icon and label anatomy and no nested <button>', () => {
    const { container } = render(
      <ActionButton asChild icon={null} label="View profile">
        <a href="/users/me" />
      </ActionButton>,
    );
    expect(container.querySelectorAll('button')).toHaveLength(0);
    const anchor = container.querySelector('a');
    expect(anchor?.getAttribute('href')).toBe('/users/me');
    expect(anchor?.className).toMatch(/action-button/);
    expect(
      anchor?.querySelector('[class*="action-button__label"]')?.textContent,
    ).toBe('View profile');
    expect(anchor?.hasAttribute('aria-pressed')).toBe(false);
  });

  it('does not forward type', () => {
    const { container } = render(
      <ActionButton
        asChild
        icon={null}
        label="Go"
        {...({ type: 'submit' } as object)}
      >
        <a href="/x" />
      </ActionButton>,
    );
    expect(container.querySelector('a')?.hasAttribute('type')).toBe(false);
  });

  it('sets aria-disabled when disabled', () => {
    const { container } = render(
      <ActionButton asChild icon={null} label="Go" disabled>
        <a href="/x" />
      </ActionButton>,
    );
    const anchor = container.querySelector('a')!;
    expect(anchor.getAttribute('aria-disabled')).toBe('true');
    expect(anchor.className).toMatch(/action-button--disabled/);
    const event = new MouseEvent('click', { bubbles: true, cancelable: true });
    anchor.dispatchEvent(event);
    expect(event.defaultPrevented).toBe(true);
  });

  it('forwards ref to the anchor', () => {
    const ref = createRef<HTMLAnchorElement>();
    render(
      <ActionButton asChild ref={ref} icon={null} label="Go">
        <a href="/x" />
      </ActionButton>,
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
        <a ref={ref} href={to} className={className}>
          {children}
        </a>
      );
    });
    const { container } = render(
      <ActionButton asChild icon={null} label="Profile">
        <Link to="/users/me" />
      </ActionButton>,
    );
    expect(container.querySelector('a')?.getAttribute('href')).toBe(
      '/users/me',
    );
  });

  it('warns when the child has content', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    render(
      <ActionButton asChild icon={null} label="Go">
        <a href="/x">oops</a>
      </ActionButton>,
    );
    expect(warn).toHaveBeenCalled();
    warn.mockRestore();
  });

  it('composes className', () => {
    const { container } = render(
      <ActionButton asChild icon={null} label="Go" className="host">
        <a href="/x" className="child" />
      </ActionButton>,
    );
    const className = container.querySelector('a')?.className ?? '';
    expect(className).toContain('host');
    expect(className).toContain('child');
  });
});
