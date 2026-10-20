import { useEffect, useLayoutEffect, useRef } from 'react';
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

/**
 * Open modals in mount order; only the last one reacts to Tab and Escape.
 * Shared through `globalThis` so compass-ui copies bundled by plugins agree on
 * which modal is topmost.
 *
 * **Frozen v1 protocol** (additive-only, like tokens): opaque `{}` tokens,
 * push while active, splice on leave, last entry is top. Do not change the
 * entry shape or those rules in place — mint `…/modal-stack/v2` instead.
 * A new key means new copies stop cooperating with old ones.
 */
const STACK_KEY = Symbol.for('@mattermost/compass-ui/modal-stack/v1');
const stackHost = globalThis as typeof globalThis & {
  [STACK_KEY]?: object[];
};
const modalStack: object[] = (stackHost[STACK_KEY] ??= []);

export interface UseModalFocusOptions {
  /** Element to focus on mount. Falls back to the dialog root. */
  initialFocusRef?: RefObject<HTMLElement | null>;
  /** Close on Escape. Default true. */
  closeOnEscape?: boolean;
  /**
   * Initial focus, Tab trap and focus restore. Set false when the host owns
   * focus (e.g. a floating-ui focus manager). The modal still joins the stack,
   * so modals below it stay inert. Initial focus and restore use the value at
   * mount; the Tab trap follows later updates (like `closeOnEscape`). Default
   * true.
   */
  manageFocus?: boolean;
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
    manageFocus = true,
    onClose,
    active = true,
  }: UseModalFocusOptions,
): void {
  // Initial focus + restore only run once; the Tab trap reads `manageFocus` live.
  const manageFocusOnMount = useRef(manageFocus);
  const initialFocusRefRef = useRef(initialFocusRef);
  const latest = useRef({ closeOnEscape, manageFocus, onClose });
  // Commit-only writes: avoid leaking options from a discarded concurrent render,
  // without the post-paint stale window of a passive effect.
  useLayoutEffect(() => {
    initialFocusRefRef.current = initialFocusRef;
    latest.current = { closeOnEscape, manageFocus, onClose };
  });
  const keyToken = useRef<object | null>(null);
  // Stack position recorded when the token leaves the stack (exit start).
  const exit = useRef<{ wasTop: boolean; below: object | undefined } | null>(
    null,
  );

  useEffect(() => {
    if (!manageFocusOnMount.current) return;
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
      if (e.key !== 'Tab' || !latest.current.manageFocus) return;
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
