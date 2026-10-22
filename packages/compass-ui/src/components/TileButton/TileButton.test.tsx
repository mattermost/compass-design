/* eslint-disable jsx-a11y/anchor-has-content -- asChild replaces empty anchor children with action anatomy */
import { createRef, forwardRef, type ReactNode } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { render } from '@/test-utils/render';
import TileButton from './TileButton';

describe('TileButton asChild', () => {
  it('renders a single <a> with icon and label anatomy and no nested <button>', () => {
    const { container } = render(
      <TileButton asChild icon={null} label="View profile">
        <a href="/users/me" />
      </TileButton>,
    );
    expect(container.querySelectorAll('button')).toHaveLength(0);
    const anchor = container.querySelector('a');
    expect(anchor?.getAttribute('href')).toBe('/users/me');
    expect(anchor?.className).toMatch(/tile-button/);
    expect(
      anchor?.querySelector('[class*="tile-button__label"]')?.textContent,
    ).toBe('View profile');
    expect(anchor?.hasAttribute('aria-pressed')).toBe(false);
  });

  it('does not forward type', () => {
    const { container } = render(
      <TileButton
        asChild
        icon={null}
        label="Go"
        {...({ type: 'submit' } as object)}
      >
        <a href="/x" />
      </TileButton>,
    );
    expect(container.querySelector('a')?.hasAttribute('type')).toBe(false);
  });

  it('sets aria-disabled when disabled', () => {
    const { container } = render(
      <TileButton asChild icon={null} label="Go" disabled>
        <a href="/x" />
      </TileButton>,
    );
    const anchor = container.querySelector('a')!;
    expect(anchor.getAttribute('aria-disabled')).toBe('true');
    expect(anchor.className).toMatch(/tile-button--disabled/);
    const event = new MouseEvent('click', { bubbles: true, cancelable: true });
    anchor.dispatchEvent(event);
    expect(event.defaultPrevented).toBe(true);
  });

  it('forwards ref to the anchor', () => {
    const ref = createRef<HTMLAnchorElement>();
    render(
      <TileButton asChild ref={ref} icon={null} label="Go">
        <a href="/x" />
      </TileButton>,
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
      <TileButton asChild icon={null} label="Profile">
        <Link to="/users/me" />
      </TileButton>,
    );
    expect(container.querySelector('a')?.getAttribute('href')).toBe(
      '/users/me',
    );
  });

  it('warns when the child has content', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    render(
      <TileButton asChild icon={null} label="Go">
        <a href="/x">oops</a>
      </TileButton>,
    );
    expect(warn).toHaveBeenCalled();
    warn.mockRestore();
  });

  it('composes className', () => {
    const { container } = render(
      <TileButton asChild icon={null} label="Go" className="host">
        <a href="/x" className="child" />
      </TileButton>,
    );
    const className = container.querySelector('a')?.className ?? '';
    expect(className).toContain('host');
    expect(className).toContain('child');
  });
});

describe('TileButton long labels', () => {
  it('keeps the full label in the DOM without overriding the accessible name', () => {
    const label = 'Add people to this channel and notify them';
    const { container } = render(<TileButton icon={null} label={label} />);
    const button = container.querySelector('button')!;
    expect(
      button.querySelector('[class*="tile-button__label"]')?.textContent,
    ).toBe(label);
    expect(button.textContent).toBe(label);
    expect(button.hasAttribute('aria-label')).toBe(false);
    expect(button.hasAttribute('title')).toBe(false);
  });
});

describe('TileButton toggled', () => {
  it('is not a toggle when toggled is omitted', () => {
    const { container } = render(<TileButton icon={null} label="Mute" />);
    expect(
      container.querySelector('button')!.hasAttribute('aria-pressed'),
    ).toBe(false);
  });

  it('maps toggled to aria-pressed', () => {
    const { container, rerender } = render(
      <TileButton icon={null} label="Mute" toggled />,
    );
    const button = container.querySelector('button')!;
    expect(button.getAttribute('aria-pressed')).toBe('true');
    expect(button.className).toMatch(/tile-button--toggled/);

    rerender(<TileButton icon={null} label="Mute" toggled={false} />);
    expect(button.getAttribute('aria-pressed')).toBe('false');
    expect(button.className).not.toMatch(/tile-button--toggled/);
  });
});
