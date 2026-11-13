import { forwardRef, useEffect } from 'react';
import type { HTMLAttributes } from 'react';
import MenuItem from '@/components/MenuItem/MenuItem';
import MenuGroupHeading from '@/components/MenuGroupHeading/MenuGroupHeading';
import Scrollbar from '@/components/Scrollbar/Scrollbar';
import { mergeMenuItemProps } from '@/utils/menuItemProps';
import { mergeClassNames } from '@/utils/props';
import {
  toSuggestionSections,
  type SuggestionOption,
  type SuggestionSection,
} from './useSuggestionList';
import styles from './SuggestionList.module.scss';

export interface SuggestionListProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  'children' | 'onSelect'
> {
  /** Grouped rows, each with an optional heading. Use this or `options`. */
  sections?: SuggestionSection[];
  /** Rows without headings. Ignored when `sections` is set. */
  options?: SuggestionOption[];
  /** `value` of the highlighted row (what `aria-activedescendant` points at). */
  activeValue?: string;
  /** Called when the pointer moves onto a row, so the host can move the highlight. */
  onActiveValueChange?: (value: string) => void;
  /** Called when a row is clicked. Keyboard accept is handled by `useSuggestionList`. */
  onSelect?: (option: SuggestionOption) => void;
  /** Id of the `role="listbox"` element, for the field's `aria-controls`. */
  listboxId?: string;
  /** Accessible name of the listbox. Pass a translated string. Default: "Suggestions". */
  listboxLabel?: string;
  /** Scroll region height before the list scrolls. Default: 320 (px). */
  maxHeight?: string | number;
}

/**
 * The suggestion surface of a composer: rows with an avatar, label, secondary
 * text and a trailing label, optionally in headed groups. It is a listbox that
 * never takes focus; the text field keeps focus and drives it through
 * `aria-activedescendant` (see `useSuggestionList`). The host owns open state,
 * the text query, and where the list sits (typically above the composer).
 */
const SuggestionList = forwardRef<HTMLDivElement, SuggestionListProps>(
  function SuggestionList(
    {
      sections,
      options,
      activeValue,
      onActiveValueChange,
      onSelect,
      listboxId,
      listboxLabel = 'Suggestions',
      maxHeight = 320,
      className,
      ...rest
    },
    ref,
  ) {
    const resolved = toSuggestionSections(sections, options);
    const idPrefix = listboxId ?? 'suggestion-list';
    const optionId = (value: string) => `${idPrefix}-option-${value}`;

    useEffect(() => {
      if (!activeValue) return;
      document
        .getElementById(optionId(activeValue))
        ?.scrollIntoView?.({ block: 'nearest' });
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeValue, idPrefix]);

    const renderOption = (option: SuggestionOption) => {
      const active = option.value === activeValue;
      return (
        <MenuItem
          key={option.value}
          {...mergeMenuItemProps(
            { secondaryLabelPosition: 'inline' as const },
            option.menuItemProps,
          )}
          id={optionId(option.value)}
          role="option"
          tabIndex={-1}
          aria-selected={active}
          label={option.label}
          secondaryLabel={option.secondaryLabel}
          leadingElement={option.leadingVisual != null}
          leadingVisual={option.leadingVisual}
          trailingElement={option.trailingLabel != null}
          trailingVisual={
            option.trailingLabel != null ? (
              <span className={styles['suggestion-list__trailing-label']}>
                {option.trailingLabel}
              </span>
            ) : undefined
          }
          active={active}
          disabled={option.disabled}
          // Keep the caret in the field when a row is pressed.
          onMouseDown={(e) => e.preventDefault()}
          onMouseMove={() => {
            if (!option.disabled && !active)
              onActiveValueChange?.(option.value);
          }}
          onClick={() => onSelect?.(option)}
        />
      );
    };

    return (
      <div
        {...rest}
        ref={ref}
        className={mergeClassNames(styles['suggestion-list'], className)}
      >
        <Scrollbar
          style={{
            maxHeight:
              typeof maxHeight === 'number' ? `${maxHeight}px` : maxHeight,
          }}
        >
          <div
            id={listboxId}
            role="listbox"
            aria-label={listboxLabel}
            className={styles['suggestion-list__listbox']}
          >
            {resolved.map((section) =>
              section.heading != null ? (
                <div
                  key={section.key}
                  role="group"
                  aria-labelledby={`${idPrefix}-heading-${section.key}`}
                >
                  <MenuGroupHeading
                    id={`${idPrefix}-heading-${section.key}`}
                    label={section.heading}
                  />
                  {section.options.map(renderOption)}
                </div>
              ) : (
                section.options.map(renderOption)
              ),
            )}
          </div>
        </Scrollbar>
      </div>
    );
  },
);

SuggestionList.displayName = 'SuggestionList';

export default SuggestionList;
