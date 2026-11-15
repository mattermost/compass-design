import { useCallback, useId, useMemo, useState } from 'react';
import type { KeyboardEvent, ReactNode } from 'react';
import type { MenuItemPassthroughProps } from '@/components/MenuItem/MenuItem';

/** `MenuItem` props `SuggestionList` sets itself on a row. */
export type SuggestionOwnedMenuItemProps =
  | 'id'
  | 'role'
  | 'aria-selected'
  | 'autoFocus'
  | 'tabIndex'
  | 'label'
  | 'secondaryLabel'
  | 'leadingVisual'
  | 'leadingElement'
  | 'trailingVisual'
  | 'trailingElement'
  | 'disabled'
  | 'active'
  | 'children'
  | 'onClick'
  | 'onMouseDown'
  | 'onMouseMove';

export interface SuggestionOption {
  /**
   * Stable identifier. Data, not text: used as the React key, in the row id
   * (`aria-activedescendant`) and as the active value. Unique across sections.
   */
  value: string;
  /** Primary text. Accepts translated nodes (e.g. `<FormattedMessage/>`). */
  label: ReactNode;
  /** Muted text after the label (a full name beside a username). */
  secondaryLabel?: ReactNode;
  /**
   * Leading slot: a 24px `UserAvatar` (pass `status` for presence), a
   * `TeamAvatar`, or `<Icon glyph={<SomeIcon />} />` (the row sets the size).
   */
  leadingVisual?: ReactNode;
  /** Muted text at the right edge, e.g. "Not in channel". Accepts translated nodes. */
  trailingLabel?: ReactNode;
  /** The row is shown but can't be reached by keyboard or chosen. */
  disabled?: boolean;
  /** Extra `MenuItem` props for this row. */
  menuItemProps?: MenuItemPassthroughProps<SuggestionOwnedMenuItemProps>;
}

export interface SuggestionSection {
  /** Stable key for the section. */
  key: string;
  /** Optional all-caps heading, e.g. "Not in channel". Accepts translated nodes. */
  heading?: ReactNode;
  options: SuggestionOption[];
}

export type SuggestionSelectKey = 'Enter' | 'Tab';

/** Normalizes the `options` shorthand and `sections` to one list of sections. */
export function toSuggestionSections(
  sections: SuggestionSection[] | undefined,
  options: SuggestionOption[] | undefined,
): SuggestionSection[] {
  if (sections) return sections;
  return options ? [{ key: 'options', options }] : [];
}

export interface UseSuggestionListOptions {
  /** Same data as `SuggestionList`. */
  sections?: SuggestionSection[];
  options?: SuggestionOption[];
  /** Whether the list is showing. Keys are left alone while it is closed. Default: true. */
  open?: boolean;
  /** Called with the active option on Enter / Tab. The host applies it (inserts the text). */
  onSelect?: (option: SuggestionOption) => void;
  /** Called on Escape. The host closes the list. */
  onClose?: () => void;
  /** Keys that accept the active option. Default: `['Enter', 'Tab']`. */
  selectKeys?: SuggestionSelectKey[];
  /** Wrap from the last option to the first and back. Default: true. */
  loop?: boolean;
  /** Prefix for the listbox and row ids. Defaults to a generated id. */
  id?: string;
}

const DEFAULT_SELECT_KEYS: SuggestionSelectKey[] = ['Enter', 'Tab'];

/**
 * Keyboard and ARIA wiring between a composer field and a {@link SuggestionList}.
 * Focus stays in the field: spread `inputProps` on it, call `onKeyDown` from its
 * key handler and spread `listProps` on the list. The first enabled option is
 * active whenever the option list changes.
 */
export function useSuggestionList({
  sections,
  options,
  open = true,
  onSelect,
  onClose,
  selectKeys = DEFAULT_SELECT_KEYS,
  loop = true,
  id,
}: UseSuggestionListOptions) {
  const generatedId = useId();
  const listboxId = id ?? `suggestions-${generatedId.replace(/:/g, '')}`;

  const enabled = useMemo(
    () =>
      toSuggestionSections(sections, options)
        .flatMap((s) => s.options)
        .filter((o) => !o.disabled),
    [sections, options],
  );
  // A new set of values resets the active row to the first one.
  const signature = enabled.map((o) => o.value).join('\u0000');
  const [state, setState] = useState<{ signature: string; value?: string }>({
    signature,
  });
  const stored = state.signature === signature ? state.value : undefined;
  const activeValue = enabled.some((o) => o.value === stored)
    ? stored
    : enabled[0]?.value;

  const setActiveValue = useCallback(
    (value: string) => setState({ signature, value }),
    [signature],
  );

  const getOptionId = useCallback(
    (value: string) => `${listboxId}-option-${value}`,
    [listboxId],
  );

  const onKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (!open || event.defaultPrevented) return;
    // Enter that confirms an IME composition isn't ours.
    if (event.nativeEvent.isComposing) return;
    if (event.key === 'Escape') {
      event.preventDefault();
      onClose?.();
      return;
    }
    if (enabled.length === 0) return;
    if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey)
      return;

    const index = enabled.findIndex((o) => o.value === activeValue);
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      const step = event.key === 'ArrowDown' ? 1 : -1;
      let next = index + step;
      if (loop) next = (next + enabled.length) % enabled.length;
      else next = Math.min(Math.max(next, 0), enabled.length - 1);
      setActiveValue(enabled[next].value);
    } else if (
      (event.key === 'Enter' || event.key === 'Tab') &&
      selectKeys.includes(event.key) &&
      index >= 0
    ) {
      event.preventDefault();
      onSelect?.(enabled[index]);
    }
  };

  const showing = open && enabled.length > 0;
  return {
    listboxId,
    activeValue,
    setActiveValue,
    onKeyDown,
    /** Spread on the composer field. */
    inputProps: {
      role: 'combobox' as const,
      'aria-autocomplete': 'list' as const,
      'aria-haspopup': 'listbox' as const,
      'aria-expanded': showing,
      'aria-controls': showing ? listboxId : undefined,
      'aria-activedescendant':
        showing && activeValue ? getOptionId(activeValue) : undefined,
    },
    /** Spread on `SuggestionList`. */
    listProps: {
      listboxId,
      activeValue,
      onActiveValueChange: setActiveValue,
      onSelect,
    },
  };
}
