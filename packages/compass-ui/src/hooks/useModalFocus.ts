import { useEffect, useRef } from 'react';
import type { KeyboardEvent as ReactKeyboardEvent, RefObject } from 'react';

const FOCUSABLE_SELECTOR = [
  'a[href]',
  'area[href]',
  'button:not([disabled])',
  'input:not([disabled]):not([type="hidden"])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  'summary',
  '[contenteditable=""]',
  '[contenteditable="true"]',
  '[tabindex]',
].join(',');

function getFocusable(root: HTMLElement): HTMLElement[] {
  return Array.from(
    root.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR),
  ).filter((el) => {
    if (el.tabIndex < 0) return false;
    if (el.closest('[hidden], [inert]')) return false;
    if (el.getAttribute('aria-hidden') === 'true') return false;
    return true;
  });
}

export interface UseModalFocusOptions {
  /** Element to focus on mount. Falls back to the dialog root. */
  initialFocusRef?: RefObject<HTMLElement | null>;
  /** Close on Escape. Default true. */
  closeOnEscape?: boolean;
  onClose?: () => void;
}

/**
 * Dialog focus and keyboard behavior for a mount-controlled modal: initial
 * focus, Tab trap (focusable elements computed at keypress), document-level
 * Escape (skipped when already handled), and focus restore on unmount.
 *
 * @returns `onKeyDown` to attach to the dialog root.
 */
export function useModalFocus(
  rootRef: RefObject<HTMLElement | null>,
  { initialFocusRef, closeOnEscape = true, onClose }: UseModalFocusOptions,
) {
  const initialFocusRefRef = useRef(initialFocusRef);
  initialFocusRefRef.current = initialFocusRef;

  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    (initialFocusRefRef.current?.current ?? rootRef.current)?.focus();
    return () => {
      if (
        previous &&
        previous.isConnected &&
        typeof previous.focus === 'function'
      ) {
        previous.focus();
      }
    };
  }, [rootRef]);

  useEffect(() => {
    if (!closeOnEscape || !onClose) return;
    function handle(e: KeyboardEvent) {
      if (e.key !== 'Escape' || e.defaultPrevented) return;
      onClose?.();
    }
    document.addEventListener('keydown', handle);
    return () => document.removeEventListener('keydown', handle);
  }, [closeOnEscape, onClose]);

  return function onKeyDown(e: ReactKeyboardEvent<HTMLElement>) {
    if (e.key !== 'Tab') return;
    const root = rootRef.current;
    if (!root) return;
    const focusable = getFocusable(root);
    if (focusable.length === 0) {
      e.preventDefault();
      root.focus();
      return;
    }
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    const active = document.activeElement;
    if (e.shiftKey) {
      if (active === first || active === root || !root.contains(active)) {
        e.preventDefault();
        last.focus();
      }
    } else if (active === last || !root.contains(active)) {
      e.preventDefault();
      first.focus();
    }
  };
}
