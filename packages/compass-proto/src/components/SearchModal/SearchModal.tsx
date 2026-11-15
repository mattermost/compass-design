import { useRef, type ChangeEvent, type ReactNode } from 'react';
import KeyboardReturnIcon from '@mattermost/compass-icons/components/keyboard-return';
import LightbulbOutlineIcon from '@mattermost/compass-icons/components/lightbulb-outline';
import { Button } from '@mattermost/compass-ui/components/button';
import { Icon } from '@mattermost/compass-ui/components/icon';
import { Modal, ModalOverlay } from '@mattermost/compass-ui/components/modal';
import type { ModalOverlayProps } from '@mattermost/compass-ui/components/modal';
import { SearchInput } from '@mattermost/compass-ui/components/search-input';
import { SuggestionList } from '@mattermost/compass-ui/components/suggestion-list';
import {
  buildSearchSections,
  resolveSelection,
  type SearchModalData,
  type SearchModalHint,
  type SearchModalLabels,
  type SearchModalSelection,
} from './searchSections';
import { useSearchModal } from './useSearchModal';
import styles from './SearchModal.module.scss';

export interface SearchModalProps extends SearchModalData, SearchModalLabels {
  /** Whether the dialog is shown. The host owns this state (and the shortcut / header entry point). */
  open: boolean;
  /** Called on Escape, the scrim and the close button. */
  onClose: () => void;
  /** Called after the exit motion finishes and the dialog unmounts. */
  onExited?: () => void;
  /** Text in the field. Controlled, so the host can insert a modifier or a suggestion. */
  query: string;
  onQueryChange: (query: string) => void;
  /** Enter with no row highlighted: run the search for `query`. */
  onSubmit?: (query: string) => void;
  /** A row (or a tip modifier) was chosen. The host applies it, usually by editing `query`. */
  onSelect?: (selection: SearchModalSelection) => void;
  /**
   * Leading header content above the field, such as a `SegmentedControl` of
   * search modes (All / Messages / Files …) once those exist.
   */
  headerLeading?: ReactNode;
  /** Passed to the `ModalOverlay` scrim (`container`, `zIndex`, …). The host owns the portal node and stacking. */
  overlayProps?: Omit<
    ModalOverlayProps,
    'open' | 'onClose' | 'onExited' | 'children'
  >;
  className?: string;
}

/**
 * Search dialog opened from the global header's Search field: a large search
 * field over a keyboard-navigable list of recent searches, search modifiers
 * (`From:`, `In:`, …) and completions, with a footer tip. Messages do not search
 * while typing; Enter runs the search. Composes `ModalOverlay`, `Modal`,
 * `SearchInput` and `SuggestionList`. Focus stays in the field; arrow keys move
 * the highlight (`aria-activedescendant`). The host owns `open` and `query`.
 */
export default function SearchModal({
  open,
  onClose,
  onExited,
  overlayProps,
  ...rest
}: SearchModalProps) {
  return (
    <ModalOverlay
      {...overlayProps}
      open={open}
      onClose={onClose}
      onExited={onExited}
    >
      <SearchModalPanel open={open} onClose={onClose} {...rest} />
    </ModalOverlay>
  );
}

function SearchModalPanel({
  open,
  onClose,
  query,
  onQueryChange,
  onSubmit,
  onSelect,
  headerLeading,
  hints,
  suggestions,
  recent,
  onRemoveRecent,
  hintsLabel,
  suggestionsLabel,
  recentLabel,
  removeRecentLabel,
  listboxLabel = 'Search suggestions',
  title = 'Search',
  placeholder = 'Search',
  searchLabel = 'Search',
  clearLabel = 'Clear search',
  closeLabel = 'Close',
  tipLabel = 'Tip: Try',
  enterToSearchLabel = 'Enter to search',
  className,
}: Omit<SearchModalProps, 'overlayProps' | 'onExited'>) {
  const inputRef = useRef<HTMLInputElement>(null);
  const data = { hints, suggestions, recent, onRemoveRecent };
  const labels = {
    hintsLabel,
    suggestionsLabel,
    recentLabel,
    removeRecentLabel,
  };
  const search = useSearchModal({
    query,
    open,
    ...data,
    ...labels,
    listboxLabel,
    onSelect,
    onSubmit,
    onClose,
  });
  const sections = buildSearchSections(data, labels);
  const showTip = hints != null && hints.length > 0;
  const hasQuery = query.trim() !== '';

  const pickHint = (hint: SearchModalHint) => {
    onSelect?.({ kind: 'hint', item: hint });
    inputRef.current?.focus();
  };

  return (
    <Modal
      className={[styles['search-modal'], className].filter(Boolean).join(' ')}
      open={open}
      size="medium"
      title={title}
      closeLabel={closeLabel}
      bodyPadding="menu"
      headerDivider={false}
      onClose={onClose}
      initialFocusRef={inputRef}
      headerLeading={headerLeading}
      headerSlot={
        <div className={styles['search-modal__field']}>
          <SearchInput
            ref={inputRef}
            size="large"
            placeholder={placeholder}
            aria-label={searchLabel}
            autoComplete="off"
            autoCorrect="off"
            spellCheck={false}
            {...search.inputProps}
            value={query}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              onQueryChange(e.target.value)
            }
            clearLabel={clearLabel}
            onClear={() => onQueryChange('')}
            onKeyDown={search.onKeyDown}
          />
        </div>
      }
      footerLeading={
        hasQuery ? (
          <div className={styles['search-modal__tip']}>
            <span className={styles['search-modal__enter-key']} aria-hidden>
              <Icon glyph={<KeyboardReturnIcon />} size="12" />
            </span>
            <p className={styles['search-modal__tip-text']}>
              {enterToSearchLabel}
            </p>
          </div>
        ) : showTip ? (
          <div className={styles['search-modal__tip']}>
            <Icon
              className={styles['search-modal__tip-icon']}
              glyph={<LightbulbOutlineIcon />}
              size="16"
            />
            <p className={styles['search-modal__tip-text']}>{tipLabel}</p>
            <div className={styles['search-modal__modifiers']}>
              {hints!.map((hint) => (
                <Button
                  key={hint.id}
                  compact
                  emphasis="dim"
                  size="x-small"
                  type="button"
                  onClick={() => pickHint(hint)}
                >
                  {hint.modifier}
                </Button>
              ))}
            </div>
          </div>
        ) : undefined
      }
      footerType="pagination"
      footerDivider
    >
      {sections.length > 0 && (
        <SuggestionList
          className={styles['search-modal__list']}
          sections={sections}
          maxHeight="none"
          {...search.listProps}
          onSelect={(option) => {
            const selection = resolveSelection(option.value, data);
            if (selection) onSelect?.(selection);
          }}
        />
      )}
    </Modal>
  );
}
