import { useEffect, useRef } from 'react';
import type { RefObject } from 'react';

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

function isHidden(el: HTMLElement, root: HTMLElement): boolean {
  for (let node: HTMLElement | null = el; node; node = node.parentElement) {
    if (node.hidden || node.hasAttribute('inert')) return true;
    if (node.getAttribute('aria-hidden') === 'true') return true;
    const style = getComputedStyle(node);
    if (style.display === 'none') return true;
    if (node === el && style.visibility === 'hidden') return true;
    if (node === root) break;
  }
  return false;
}

function getFocusable(root: HTMLElement): HTMLElement[] {
  return Array.from(
    root.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR),
  ).filter(
    (el) => el.tabIndex >= 0 && !el.matches(':disabled') && !isHidden(el, root),
  );
}

/** Open modals in mount order; only the last one reacts to Tab and Escape. */
const modalStack: object[] = [];

export interface UseModalFocusOptions {
  /** Element to focus on mount. Falls back to the dialog root. */
  initialFocusRef?: RefObject<HTMLElement | null>;
  /** Close on Escape. Default true. */
  closeOnEscape?: boolean;
  onClose?: () => void;
  /**
   * When false (e.g. during an exit transition) Tab and Escape are no longer
   * handled and the modal leaves the stack, but focus is still restored on
   * unmount. Default true.
   */
  active?: boolean;
}

/**
 * Dialog focus and keyboard behavior for a modal panel: initial focus, Tab trap
 * (focusable elements computed at keypress), Escape (skipped when already
 * handled), and focus restore on unmount.
 *
 * Tab and Escape are handled by one document listener, so the trap still holds
 * when focus sits outside the dialog (e.g. after a backdrop click), and only
 * the topmost active modal responds. Events whose default was prevented (by an
 * inner widget or the host's `onKeyDown`) are ignored.
 */
export function useModalFocus(
  rootRef: RefObject<HTMLElement | null>,
  {
    initialFocusRef,
    closeOnEscape = true,
    onClose,
    active = true,
  }: UseModalFocusOptions,
): void {
  const initialFocusRefRef = useRef(initialFocusRef);
  initialFocusRefRef.current = initialFocusRef;
  const latest = useRef({ closeOnEscape, onClose });
  latest.current = { closeOnEscape, onClose };
  const keyToken = useRef<object | null>(null);
  // Stack position recorded when the token leaves the stack (exit start).
  const exit = useRef<{ wasTop: boolean; below: object | undefined } | null>(
    null,
  );

  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    function shouldRestoreFocus(): boolean {
      const top = modalStack[modalStack.length - 1];
      const token = keyToken.current;
      if (token && modalStack.includes(token)) return top === token;
      if (!exit.current) return top === undefined;
      return exit.current.wasTop && top === exit.current.below;
    }
    const root = rootRef.current;
    const target = initialFocusRefRef.current?.current;
    if (target && root?.contains(target)) target.focus();
    if (!target || document.activeElement !== target) root?.focus();
    return () => {
      if (
        shouldRestoreFocus() &&
        previous &&
        previous.isConnected &&
        typeof previous.focus === 'function'
      ) {
        previous.focus();
      }
    };
  }, [rootRef]);

  useEffect(() => {
    if (!active) return;
    const token = {};
    modalStack.push(token);
    keyToken.current = token;
    exit.current = null;

    function handle(e: KeyboardEvent) {
      if (e.defaultPrevented || modalStack[modalStack.length - 1] !== token)
        return;
      const dialog = rootRef.current;
      if (!dialog) return;
      if (e.key === 'Escape') {
        if (latest.current.closeOnEscape) latest.current.onClose?.();
        return;
      }
      if (e.key !== 'Tab') return;
      const focusable = getFocusable(dialog);
      if (focusable.length === 0) {
        e.preventDefault();
        dialog.focus();
        return;
      }
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const current = document.activeElement;
      const outside = !dialog.contains(current);
      if (e.shiftKey) {
        if (outside || current === first || current === dialog) {
          e.preventDefault();
          last.focus();
        }
      } else if (outside || current === last) {
        e.preventDefault();
        first.focus();
      }
    }
    document.addEventListener('keydown', handle);
    return () => {
      document.removeEventListener('keydown', handle);
      const index = modalStack.indexOf(token);
      exit.current = {
        wasTop: index === modalStack.length - 1,
        below: modalStack[index - 1],
      };
      modalStack.splice(index, 1);
    };
  }, [rootRef, active]);
}
