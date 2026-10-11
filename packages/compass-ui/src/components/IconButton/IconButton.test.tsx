/* eslint-disable jsx-a11y/anchor-has-content -- asChild replaces empty anchor children with icon anatomy */
import { cloneElement, createRef, forwardRef, type ReactNode } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { render } from '@/test-utils/render';
import IconButton from './IconButton';

describe('IconButton asChild', () => {
  it('renders a single <a> with icon anatomy and no nested <button>', () => {
    const { container } = render(
      <IconButton asChild aria-label="Open settings" icon={null}>
        <a href="/settings" />
      </IconButton>,
    );
    expect(container.querySelectorAll('button')).toHaveLength(0);
    const anchor = container.querySelector('a');
    expect(anchor?.getAttribute('href')).toBe('/settings');
    expect(anchor?.getAttribute('aria-label')).toBe('Open settings');
    expect(anchor?.className).toMatch(/icon-button/);
    expect(
      anchor?.querySelector('[class*="icon-button__icon-slot"]'),
    ).not.toBeNull();
    expect(anchor?.hasAttribute('aria-pressed')).toBe(false);
  });

  it('does not forward type', () => {
    const { container } = render(
      <IconButton
        asChild
        aria-label="Go"
        icon={null}
        {...({ type: 'submit' } as object)}
      >
        <a href="/x" />
      </IconButton>,
    );
    expect(container.querySelector('a')?.hasAttribute('type')).toBe(false);
  });

  it('sets aria-disabled when disabled or loading', () => {
    const { container, rerender } = render(
      <IconButton asChild aria-label="Go" icon={null} disabled>
        <a href="/x" />
      </IconButton>,
    );
    let anchor = container.querySelector('a')!;
    expect(anchor.getAttribute('aria-disabled')).toBe('true');
    expect(anchor.className).toMatch(/icon-button--disabled/);

    rerender(
      <IconButton asChild aria-label="Go" icon={null} loading>
        <a href="/x" />
      </IconButton>,
    );
    anchor = container.querySelector('a')!;
    expect(anchor.getAttribute('aria-busy')).toBe('true');
    expect(anchor.getAttribute('aria-disabled')).toBe('true');
  });

  it('forwards ref to the anchor', () => {
    const ref = createRef<HTMLAnchorElement>();
    render(
      <IconButton asChild ref={ref} aria-label="Go" icon={null}>
        <a href="/x" />
      </IconButton>,
    );
    expect(ref.current).toBeInstanceOf(HTMLAnchorElement);
    ref.current?.focus();
    expect(document.activeElement).toBe(ref.current);
  });

  it('works with a forwardRef Link stand-in', () => {
    const Link = forwardRef<
      HTMLAnchorElement,
      {
        to: string;
        children?: ReactNode;
        className?: string;
        'aria-label'?: string;
      }
    >(function Link({ to, children, className, ...rest }, ref) {
      return (
        <a ref={ref} href={to} className={className} {...rest}>
          {children}
        </a>
      );
    });
    const { container } = render(
      <IconButton asChild aria-label="Emoji" icon={null}>
        <Link to="/emoji" />
      </IconButton>,
    );
    expect(container.querySelector('a')?.getAttribute('href')).toBe('/emoji');
  });

  it('warns when the child has content', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    render(
      <IconButton asChild aria-label="Go" icon={null}>
        <a href="/x">should be empty</a>
      </IconButton>,
    );
    expect(warn).toHaveBeenCalled();
    warn.mockRestore();
  });

  it('accepts aria-label injected by a host wrapper (WithTooltip pattern)', () => {
    // WithTooltip cloneElement(child, { 'aria-label': label }) before mount.
    const element = (
      // @ts-expect-error — host wrapper injects aria-label before render
      <IconButton asChild icon={null}>
        <a href="/settings" />
      </IconButton>
    );
    const { container } = render(
      cloneElement(element, { 'aria-label': 'Open settings' }),
    );
    expect(container.querySelector('a')?.getAttribute('aria-label')).toBe(
      'Open settings',
    );
  });

  it('lets the child aria-label win', () => {
    const { container } = render(
      <IconButton asChild aria-label="From button" icon={null}>
        <a href="/x" aria-label="From link" />
      </IconButton>,
    );
    expect(container.querySelector('a')?.getAttribute('aria-label')).toBe(
      'From link',
    );
  });
});
