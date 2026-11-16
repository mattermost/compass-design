import { useEffect } from 'react';
import { MenuGroupHeading } from '@mattermost/compass-ui/components/menu-group-heading';
import { MenuItem } from '@mattermost/compass-ui/components/menu-item';
import { UserAvatar } from '@mattermost/compass-ui/components/user-avatar';
import type { SearchOptionData, SearchSectionData } from './searchSections';
import styles from './SearchModal.module.scss';

export interface SearchResultsListProps {
  sections: SearchSectionData[];
  /** Id of the `role="listbox"`, for the field's `aria-controls`. */
  listboxId: string;
  /** `value` of the highlighted option (what `aria-activedescendant` points at). */
  activeValue?: string;
  onActiveValueChange?: (value: string) => void;
  onSelect?: (option: SearchOptionData) => void;
  label: string;
}

/**
 * The results listbox. Like `SuggestionList` it never takes focus (the field
 * drives it through `aria-activedescendant`), but a section can lay its options
 * out as person cards instead of rows. Option ids match `useSuggestionList`.
 */
export default function SearchResultsList({
  sections,
  listboxId,
  activeValue,
  onActiveValueChange,
  onSelect,
  label,
}: SearchResultsListProps) {
  const optionId = (value: string) => `${listboxId}-option-${value}`;

  const firstValue = sections[0]?.options[0]?.value;
  useEffect(() => {
    if (!activeValue) return;
    const el = document.getElementById(`${listboxId}-option-${activeValue}`);
    if (!el) return;
    if (activeValue === firstValue) {
      // Keep the first group's heading in view: scroll its container to the top.
      for (
        let node = el.parentElement;
        node && node !== document.body;
        node = node.parentElement
      ) {
        const { overflowY } = getComputedStyle(node);
        if (
          (overflowY === 'auto' || overflowY === 'scroll') &&
          node.scrollHeight > node.clientHeight
        ) {
          node.scrollTop = 0;
          return;
        }
      }
      return;
    }
    el.scrollIntoView?.({ block: 'nearest' });
  }, [activeValue, listboxId, firstValue]);

  const renderRow = (option: SearchOptionData) => {
    const active = option.value === activeValue;
    return (
      <MenuItem
        key={option.value}
        secondaryLabelPosition="inline"
        {...option.menuItemProps}
        id={optionId(option.value)}
        role="option"
        tabIndex={-1}
        aria-selected={active}
        label={option.label}
        secondaryLabel={option.secondaryLabel}
        leadingElement={option.leadingVisual != null}
        leadingVisual={option.leadingVisual}
        trailingElement={option.trailingLabel != null}
        trailingVisual={option.trailingLabel}
        // Keep the caret in the field when a row is pressed.
        onMouseDown={(e) => e.preventDefault()}
        onMouseMove={() => {
          if (!active) onActiveValueChange?.(option.value);
        }}
        onClick={() => onSelect?.(option)}
      />
    );
  };

  const renderCard = (option: SearchOptionData) => {
    const active = option.value === activeValue;
    const card = option.card!;
    return (
      <button
        key={option.value}
        id={optionId(option.value)}
        type="button"
        role="option"
        tabIndex={-1}
        aria-selected={active}
        className={[
          styles['search-modal__card'],
          active && styles['search-modal__card--selected'],
        ]
          .filter(Boolean)
          .join(' ')}
        onMouseDown={(e) => e.preventDefault()}
        onMouseMove={() => {
          if (!active) onActiveValueChange?.(option.value);
        }}
        onClick={() => onSelect?.(option)}
      >
        <UserAvatar
          src={card.avatarSrc}
          alt=""
          name={card.name}
          size="56"
          status={card.status}
        />
        <span className={styles['search-modal__card-name']}>{card.name}</span>
      </button>
    );
  };

  return (
    <div
      id={listboxId}
      role="listbox"
      aria-label={label}
      className={styles['search-modal__list']}
    >
      {sections.map((section) => {
        const headingId = `${listboxId}-heading-${section.key}`;
        return (
          <div
            key={section.key}
            role="group"
            aria-labelledby={section.heading != null ? headingId : undefined}
          >
            {section.heading != null && (
              <MenuGroupHeading id={headingId} label={section.heading} />
            )}
            {section.layout === 'cards' ? (
              <div className={styles['search-modal__cards']}>
                {section.options.map(renderCard)}
              </div>
            ) : (
              section.options.map(renderRow)
            )}
          </div>
        );
      })}
    </div>
  );
}
