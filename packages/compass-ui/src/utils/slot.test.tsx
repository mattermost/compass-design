/* eslint-disable jsx-a11y/anchor-has-content -- slot tests use empty anchors; hosts supply content */
import { createRef, forwardRef, type ReactNode } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { render } from '@/test-utils/render';
import {
  composeRefs,
  getElementRef,
  mergeSlotProps,
  renderAsChild,
} from './slot';

describe('composeRefs', () => {
  it('assigns to object and callback refs', () => {
    const objectRef = createRef<HTMLDivElement>();
    const callback = vi.fn();
    const composed = composeRefs(objectRef, callback);
    const node = document.createElement('div');
    composed(node);
    expect(objectRef.current).toBe(node);
    expect(callback).toHaveBeenCalledWith(node);
  });
});

describe('getElementRef', () => {
  it('reads ref from element.props.ref (React 19)', () => {
    const ref = createRef<HTMLAnchorElement>();
    const el = <a href="/x" ref={ref} />;
    expect(getElementRef(el)).toBe(ref);
  });
});

describe('mergeSlotProps', () => {
  it('lets child props win and merges className / style', () => {
    const merged = mergeSlotProps(
      {
        className: 'host',
        style: { color: 'red', margin: 1 },
        'data-host': '1',
        id: 'host-id',
      },
      {
        className: 'child',
        style: { color: 'blue' },
        id: 'child-id',
      },
    );
    expect(merged.className).toBe('host child');
    expect(merged.style).toEqual({ color: 'blue', margin: 1 });
    expect(merged.id).toBe('child-id');
    expect(merged['data-host']).toBe('1');
  });

  it('composes handlers child-first and skips host when prevented', () => {
    const host = vi.fn();
    const child = vi.fn((e: { preventDefault: () => void }) => {
      e.preventDefault();
    });
    const merged = mergeSlotProps({ onClick: host }, { onClick: child });
    const event = {
      defaultPrevented: false,
      preventDefault() {
        this.defaultPrevented = true;
      },
    };
    (merged.onClick as (e: typeof event) => void)(event);
    expect(child).toHaveBeenCalledOnce();
    expect(host).not.toHaveBeenCalled();
  });

  it('runs the host handler when the child does not preventDefault', () => {
    const host = vi.fn();
    const child = vi.fn();
    const merged = mergeSlotProps({ onClick: host }, { onClick: child });
    const event = { defaultPrevented: false, preventDefault() {} };
    (merged.onClick as (e: typeof event) => void)(event);
    expect(child).toHaveBeenCalledOnce();
    expect(host).toHaveBeenCalledOnce();
  });
});

describe('renderAsChild', () => {
  it('clones the child with merged className, content, and composed ref', () => {
    const ref = createRef<HTMLAnchorElement>();
    const node = renderAsChild({
      child: <a href="/path" className="child" />,
      props: { className: 'host', 'data-testid': 'link' },
      ref,
      content: <span>Label</span>,
    });
    const { container } = render(<>{node}</>);
    const anchor = container.querySelector('a');
    expect(anchor).not.toBeNull();
    expect(anchor?.getAttribute('href')).toBe('/path');
    expect(anchor?.className).toContain('host');
    expect(anchor?.className).toContain('child');
    expect(anchor?.getAttribute('data-testid')).toBe('link');
    expect(anchor?.textContent).toBe('Label');
    expect(ref.current).toBe(anchor);
  });

  it('does not forward type', () => {
    const node = renderAsChild({
      child: <a href="/x" />,
      props: { type: 'submit', className: 'host' },
      content: 'Go',
    });
    const { container } = render(<>{node}</>);
    expect(container.querySelector('a')?.hasAttribute('type')).toBe(false);
  });

  it('applies disabled-link semantics', () => {
    const node = renderAsChild({
      child: <a href="/x" />,
      props: { className: 'host' },
      content: 'Go',
      disabled: true,
      disabledClassName: 'host--disabled',
    });
    const { container } = render(<>{node}</>);
    const anchor = container.querySelector('a')!;
    expect(anchor.getAttribute('aria-disabled')).toBe('true');
    expect(anchor.className).toContain('host--disabled');
    expect(anchor.getAttribute('href')).toBe('/x');

    const clickEvent = new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
    });
    const prevented = !anchor.dispatchEvent(clickEvent);
    // preventDefault → dispatchEvent returns false when canceled
    expect(prevented || clickEvent.defaultPrevented).toBe(true);
  });

  it('forwards props to a custom Link component', () => {
    const Link = forwardRef<
      HTMLAnchorElement,
      { to: string; className?: string; children?: ReactNode }
    >(function Link({ to, className, children }, ref) {
      return (
        <a ref={ref} href={to} className={className} data-link>
          {children}
        </a>
      );
    });

    const ref = createRef<HTMLAnchorElement>();
    const node = renderAsChild({
      child: <Link to="/team/emoji" />,
      props: { className: 'btn' },
      ref,
      content: <span>Add</span>,
    });
    const { container } = render(<>{node}</>);
    const anchor = container.querySelector('a');
    expect(anchor?.getAttribute('href')).toBe('/team/emoji');
    expect(anchor?.hasAttribute('data-link')).toBe(true);
    expect(ref.current).toBe(anchor);
    expect(anchor?.textContent).toBe('Add');
  });

  it('warns when child is not a single element', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const node = renderAsChild({
      child: 'text',
      props: {},
      content: null,
    });
    expect(node).toBeNull();
    expect(warn).toHaveBeenCalled();
    warn.mockRestore();
  });

  it('warns when warnOnChildContent and the child has children', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    renderAsChild({
      child: (
        <a href="/x">
          <span>oops</span>
        </a>
      ),
      props: {},
      content: <span>anatomy</span>,
      warnOnChildContent: true,
    });
    expect(warn).toHaveBeenCalled();
    warn.mockRestore();
  });
});
