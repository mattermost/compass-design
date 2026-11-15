import { useState } from 'react';
import type { KeyboardEvent } from 'react';
import {
  useSuggestionList,
  type SuggestionSection,
} from '@mattermost/compass-ui/components/suggestion-list';

export interface UseSearchModalOptions {
  sections: SuggestionSection[];
  /** Current text in the field. A change drops the highlight (unless `autoHighlight`). */
  query: string;
  /** Whether the modal is open. Keys are left alone while it is closed. */
  open: boolean;
  /**
   * Highlight the first row from the start, so Enter opens it (Channels, People,
   * Files, All). When false, no row is highlighted until an arrow key is pressed,
   * so Enter on typed text searches (Messages).
   */
  autoHighlight?: boolean;
  /** A row was chosen with Enter or a click. */
  onChoose?: (value: string) => void;
  /** Enter with no row highlighted. */
  onSubmit?: (query: string) => void;
  /** Escape. */
  onClose?: () => void;
  /** Shift+Delete on the highlighted row, when it has a remover. */
  removers?: Map<string, () => void>;
}

/**
 * Field-side wiring for the search modal's results. Focus stays in the input.
 * Arrows move the highlight (wrapping), Enter picks the highlighted row (or
 * submits when none is), Escape calls `onClose`, Shift+Delete removes the
 * highlighted recent search.
 */
export function useSearchModal({
  sections,
  query,
  open,
  autoHighlight = false,
  onChoose,
  onSubmit,
  onClose,
  removers,
}: UseSearchModalOptions) {
  const list = useSuggestionList({
    sections,
    open,
    selectKeys: ['Enter'],
    onSelect: (option) => onChoose?.(option.value),
    onClose,
  });

  // Without `autoHighlight`, the highlight is only "engaged" once the user
  // arrows into the list. Any change to the text (or to open) resets it, even
  // if the text later returns to an earlier value.
  const engageKey = `${open}\u0000${query}`;
  const [engagement, setEngagement] = useState({ key: engageKey, on: false });
  if (engagement.key !== engageKey) {
    setEngagement({ key: engageKey, on: false });
  }
  const engagedByUser = engagement.key === engageKey && engagement.on;
  const hasRows = sections.some((s) => s.options.length > 0);
  const engaged = hasRows && (autoHighlight || engagedByUser);

  const onKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (!open || event.defaultPrevented || event.nativeEvent.isComposing)
      return;
    if (event.key === 'Escape') return list.onKeyDown(event);
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      // With no rows there is nothing to highlight; keep Enter searching.
      if (!hasRows) return;
      // The first press turns the highlight on: ArrowDown lands on the first
      // row, ArrowUp wraps to the last (the list starts on the first row).
      if (!engaged) {
        setEngagement({ key: engageKey, on: true });
        if (event.key === 'ArrowDown') {
          event.preventDefault();
          return;
        }
      }
      return list.onKeyDown(event);
    }
    if (
      event.key === 'Delete' &&
      event.shiftKey &&
      engaged &&
      list.activeValue &&
      removers?.has(list.activeValue)
    ) {
      event.preventDefault();
      removers.get(list.activeValue)!();
      return;
    }
    if (event.key === 'Enter' && !engaged) {
      if (
        !event.altKey &&
        !event.ctrlKey &&
        !event.metaKey &&
        !event.shiftKey
      ) {
        // Handled here, so a host form or key handler doesn't act on it too.
        event.preventDefault();
        onSubmit?.(query);
      }
      return;
    }
    list.onKeyDown(event);
  };

  const showing = open && hasRows;
  return {
    onKeyDown,
    /** Spread on the search input. */
    inputProps: {
      ...list.inputProps,
      'aria-activedescendant': engaged
        ? list.inputProps['aria-activedescendant']
        : undefined,
      'aria-expanded': showing,
    },
    /** Spread on the results list. */
    listProps: {
      listboxId: list.listboxId,
      activeValue: engaged ? list.activeValue : undefined,
      onActiveValueChange: (value: string) => {
        setEngagement({ key: engageKey, on: true });
        list.setActiveValue(value);
      },
    },
  };
}
