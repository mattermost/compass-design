import { act } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { POPOVER_TRANSITION_MS } from '@/hooks/usePopoverTransition';
import { click, render } from '@/test-utils/render';
import Modal from './Modal';
import ModalOverlay from './ModalOverlay';
import styles from './ModalOverlay.module.scss';

const scrim = () => document.querySelector('[data-testid="scrim"]');
const dialog = () => document.querySelector('[role="dialog"]') as HTMLElement;

function mouseDown(el: Element) {
  act(() => {
    el.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
  });
}

function escape() {
  act(() => {
    document.body.dispatchEvent(
      new KeyboardEvent('keydown', {
        key: 'Escape',
        bubbles: true,
        cancelable: true,
      }),
    );
  });
}

function advance(ms: number) {
  act(() => {
    vi.advanceTimersByTime(ms);
  });
}

describe('ModalOverlay', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    document.body.style.overflow = '';
  });
  afterEach(() => {
    vi.useRealTimers();
    document.body.style.overflow = '';
    document.documentElement.style.removeProperty('--duration-quick');
  });

  describe('portal', () => {
    it('renders into document.body, outside the render container', () => {
      const { container } = render(
        <ModalOverlay open data-testid="scrim">
          content
        </ModalOverlay>,
      );
      expect(container.contains(scrim())).toBe(false);
      expect(scrim()?.parentElement).toBe(document.body);
    });

    it('renders into a passed container', () => {
      const stage = document.createElement('div');
      document.body.appendChild(stage);
      render(
        <ModalOverlay open container={stage} data-testid="scrim">
          content
        </ModalOverlay>,
      );
      expect(scrim()?.parentElement).toBe(stage);
    });

    it('renders nothing when initially closed, and does not call onExited', () => {
      const onExited = vi.fn();
      render(
        <ModalOverlay open={false} onExited={onExited} data-testid="scrim">
          content
        </ModalOverlay>,
      );
      advance(POPOVER_TRANSITION_MS + 1);
      expect(scrim()).toBeNull();
      expect(onExited).not.toHaveBeenCalled();
    });
  });

  describe('exit', () => {
    it('keeps the scrim mounted with the exiting class, then unmounts and calls onExited once', () => {
      const onExited = vi.fn();
      const { rerender } = render(
        <ModalOverlay open onExited={onExited} data-testid="scrim">
          content
        </ModalOverlay>,
      );
      expect(scrim()?.className).not.toContain(
        styles['modal-overlay--exiting'],
      );
      rerender(
        <ModalOverlay open={false} onExited={onExited} data-testid="scrim">
          content
        </ModalOverlay>,
      );
      expect(scrim()).not.toBeNull();
      expect(scrim()?.className).toContain(styles['modal-overlay']);
      expect(scrim()?.className).toContain(styles['modal-overlay--exiting']);
      expect(onExited).not.toHaveBeenCalled();
      advance(POPOVER_TRANSITION_MS + 1);
      expect(scrim()).toBeNull();
      expect(onExited).toHaveBeenCalledTimes(1);
    });

    it('waits for the --duration-quick token, not a hard-coded value', () => {
      document.documentElement.style.setProperty('--duration-quick', '400ms');
      const { rerender } = render(
        <ModalOverlay open data-testid="scrim">
          content
        </ModalOverlay>,
      );
      rerender(
        <ModalOverlay open={false} data-testid="scrim">
          content
        </ModalOverlay>,
      );
      advance(POPOVER_TRANSITION_MS + 1);
      expect(scrim()).not.toBeNull();
      advance(400);
      expect(scrim()).toBeNull();
    });

    it('exits together with a composed Modal', () => {
      const onExited = vi.fn();
      const tree = (open: boolean) => (
        <ModalOverlay open={open} onExited={onExited} data-testid="scrim">
          <Modal open={open} title="T">
            body
          </Modal>
        </ModalOverlay>
      );
      const { rerender } = render(tree(true));
      expect(dialog()).not.toBeNull();
      rerender(tree(false));
      expect(scrim()).not.toBeNull();
      expect(dialog()).not.toBeNull();
      advance(POPOVER_TRANSITION_MS + 1);
      expect(scrim()).toBeNull();
      expect(dialog()).toBeNull();
      expect(onExited).toHaveBeenCalledTimes(1);
    });
  });

  describe('backdrop', () => {
    function setup() {
      const onClose = vi.fn();
      render(
        <ModalOverlay open onClose={onClose} data-testid="scrim">
          <button type="button" data-testid="inner">
            inner
          </button>
        </ModalOverlay>,
      );
      return {
        onClose,
        inner: document.querySelector('[data-testid="inner"]') as HTMLElement,
      };
    }

    it('calls onClose when the scrim is clicked', () => {
      const { onClose } = setup();
      const el = scrim() as HTMLElement;
      mouseDown(el);
      click(el);
      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('does not call onClose for a click inside the dialog', () => {
      const { onClose, inner } = setup();
      mouseDown(inner);
      click(inner);
      expect(onClose).not.toHaveBeenCalled();
    });

    it('does not call onClose when the press starts inside and ends on the scrim', () => {
      const { onClose, inner } = setup();
      mouseDown(inner);
      click(scrim() as HTMLElement);
      expect(onClose).not.toHaveBeenCalled();
      click(scrim() as HTMLElement);
      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('does not call onClose while exiting', () => {
      const onClose = vi.fn();
      const { rerender } = render(
        <ModalOverlay open onClose={onClose} data-testid="scrim" />,
      );
      rerender(
        <ModalOverlay open={false} onClose={onClose} data-testid="scrim" />,
      );
      click(scrim() as HTMLElement);
      expect(onClose).not.toHaveBeenCalled();
    });

    it('still calls consumer onClick and onMouseDown', () => {
      const onClick = vi.fn();
      const onMouseDown = vi.fn();
      render(
        <ModalOverlay
          open
          onClick={onClick}
          onMouseDown={onMouseDown}
          data-testid="scrim"
        />,
      );
      mouseDown(scrim() as HTMLElement);
      click(scrim() as HTMLElement);
      expect(onMouseDown).toHaveBeenCalledTimes(1);
      expect(onClick).toHaveBeenCalledTimes(1);
    });
  });

  describe('scroll lock', () => {
    it('locks body scroll while mounted and restores it on unmount', () => {
      document.body.style.overflow = 'scroll';
      const { rerender } = render(
        <ModalOverlay open data-testid="scrim">
          content
        </ModalOverlay>,
      );
      expect(document.body.style.overflow).toBe('hidden');
      rerender(
        <ModalOverlay open={false} data-testid="scrim">
          content
        </ModalOverlay>,
      );
      expect(document.body.style.overflow).toBe('hidden');
      advance(POPOVER_TRANSITION_MS + 1);
      expect(document.body.style.overflow).toBe('scroll');
    });

    it('does not lock while closed', () => {
      render(<ModalOverlay open={false} data-testid="scrim" />);
      expect(document.body.style.overflow).toBe('');
    });

    it('does not lock when lockScroll is false', () => {
      render(<ModalOverlay open lockScroll={false} data-testid="scrim" />);
      expect(document.body.style.overflow).toBe('');
    });

    it('restores only after the last stacked overlay closes', () => {
      const tree = (a: boolean, b: boolean) => (
        <>
          <ModalOverlay open={a} />
          <ModalOverlay open={b} />
        </>
      );
      const { rerender } = render(tree(true, true));
      rerender(tree(false, true));
      advance(POPOVER_TRANSITION_MS + 1);
      expect(document.body.style.overflow).toBe('hidden');
      rerender(tree(false, false));
      advance(POPOVER_TRANSITION_MS + 1);
      expect(document.body.style.overflow).toBe('');
    });
  });

  describe('keyboard', () => {
    it('leaves Escape to Modal: one Escape closes through the Modal only', () => {
      const overlayClose = vi.fn();
      const modalClose = vi.fn();
      render(
        <ModalOverlay open onClose={overlayClose}>
          <Modal open title="T" onClose={modalClose}>
            body
          </Modal>
        </ModalOverlay>,
      );
      escape();
      expect(modalClose).toHaveBeenCalledTimes(1);
      expect(overlayClose).not.toHaveBeenCalled();
    });
  });

  describe('host inputs', () => {
    it('passes id, data attributes and className through to the root', () => {
      render(
        <ModalOverlay
          open
          id="overlay-id"
          className="host-class"
          data-testid="scrim"
        />,
      );
      const el = scrim() as HTMLElement;
      expect(el.id).toBe('overlay-id');
      expect(el.className).toContain('host-class');
      expect(el.className).toContain(styles['modal-overlay']);
    });

    it('applies zIndex', () => {
      render(<ModalOverlay open zIndex={40} data-testid="scrim" />);
      expect((scrim() as HTMLElement).style.zIndex).toBe('40');
    });

    it('lets style override both zIndex and position', () => {
      render(
        <ModalOverlay
          open
          zIndex={40}
          style={{ position: 'absolute', zIndex: 2 }}
          data-testid="scrim"
        />,
      );
      const el = scrim() as HTMLElement;
      expect(el.style.position).toBe('absolute');
      expect(el.style.zIndex).toBe('2');
    });
  });
});
