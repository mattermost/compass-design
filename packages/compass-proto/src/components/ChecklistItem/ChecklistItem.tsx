import type { HTMLAttributes } from 'react';
import { useId, useState } from 'react';
import CalendarOutlineIcon from '@mattermost/compass-icons/components/calendar-outline';
import CheckCircleOutlineIcon from '@mattermost/compass-icons/components/check-circle-outline';
import DragVerticalIcon from '@mattermost/compass-icons/components/drag-vertical';
import SlashForwardBoxOutlineIcon from '@mattermost/compass-icons/components/slash-forward-box-outline';
import { Button } from '@mattermost/compass-ui/components/button';
import { Checkbox } from '@mattermost/compass-ui/components/checkbox';
import { Chip } from '@mattermost/compass-ui/components/chip';
import { Icon } from '@mattermost/compass-ui/components/icon';
import { TextArea } from '@mattermost/compass-ui/components/text-area';
import { TextInput } from '@mattermost/compass-ui/components/text-input';
import WithTooltip from '../WithTooltip/WithTooltip';
import styles from './ChecklistItem.module.scss';

export type ChecklistItemState = 'open' | 'closed' | 'skipped';

export interface ChecklistItemPerson {
  /** Display name. */
  name: string;
  /** Avatar image URL. */
  src?: string;
}

export interface ChecklistItemData {
  id: string;
  title: string;
  description?: string;
  /** Task completion state. Default: `open`. */
  state?: ChecklistItemState;
  assignee?: ChecklistItemPerson;
  /** Shown after the task is closed (who checked it). */
  checkedBy?: ChecklistItemPerson;
  /** Due-date label for the prototype (e.g. "Tomorrow"). */
  dueDate?: string;
  /** Slash command string (e.g. `/zoom start`). */
  command?: string;
}

export interface ChecklistItemProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  'title'
> {
  item: ChecklistItemData;
  /** When true, the checkbox and edit affordances are disabled. */
  readOnly?: boolean;
  /** Shows a decorative drag handle (dnd stays with the host). Default: true. */
  showDragHandle?: boolean;
  /**
   * Inline create/edit mode: title and description fields replace the static
   * text, with Cancel / Save.
   */
  editing?: boolean;
  onStateChange?: (state: ChecklistItemState) => void;
  onTitleChange?: (title: string) => void;
  onDescriptionChange?: (description: string) => void;
  onSave?: () => void;
  onCancel?: () => void;
  dragHandleLabel?: string;
  titleInputPlaceholder?: string;
  descriptionInputPlaceholder?: string;
  saveLabel?: string;
  cancelLabel?: string;
  className?: string;
}

/**
 * One Playbooks checklist task row: drag handle, checkbox, title, optional
 * description, and meta chips (checked-by, assignee, due date, slash command).
 * Requirements, conditions and bulk select stay out of this first cut.
 */
export default function ChecklistItem({
  item,
  readOnly = false,
  showDragHandle = true,
  editing = false,
  onStateChange,
  onTitleChange,
  onDescriptionChange,
  onSave,
  onCancel,
  dragHandleLabel = 'Drag to reorder',
  titleInputPlaceholder = 'Task name',
  descriptionInputPlaceholder = 'Add a description…',
  saveLabel = 'Save',
  cancelLabel = 'Cancel',
  className = '',
  ...rest
}: ChecklistItemProps) {
  const titleId = useId();
  const state = item.state ?? 'open';
  const checked = state === 'closed';
  const skipped = state === 'skipped';
  const [descriptionOpen, setDescriptionOpen] = useState(
    Boolean(item.description),
  );

  const hasDescription = Boolean(item.description?.trim());
  const showMeta =
    !editing &&
    Boolean(item.checkedBy || item.assignee || item.dueDate || item.command);

  const rootClass = [
    styles['checklist-item'],
    checked && styles['checklist-item--closed'],
    skipped && styles['checklist-item--skipped'],
    editing && styles['checklist-item--editing'],
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const handleCheckChange = () => {
    if (readOnly || skipped || editing) return;
    onStateChange?.(checked ? 'open' : 'closed');
  };

  return (
    <div className={rootClass} {...rest}>
      <div className={styles['checklist-item__row']}>
        {showDragHandle && !readOnly && (
          <WithTooltip label={dragHandleLabel}>
            <span
              className={styles['checklist-item__drag']}
              aria-hidden={editing || undefined}
            >
              <Icon size="16" glyph={<DragVerticalIcon />} />
            </span>
          </WithTooltip>
        )}
        <Checkbox
          size="medium"
          checked={checked}
          disabled={readOnly || skipped || editing}
          onChange={handleCheckChange}
          aria-labelledby={editing ? undefined : titleId}
          aria-label={editing ? item.title || titleInputPlaceholder : undefined}
        />
        <div className={styles['checklist-item__body']}>
          {editing ? (
            <div className={styles['checklist-item__edit']}>
              <TextInput
                size="small"
                value={item.title}
                placeholder={titleInputPlaceholder}
                onChange={(e) => onTitleChange?.(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    onSave?.();
                  } else if (e.key === 'Escape') {
                    e.preventDefault();
                    onCancel?.();
                  }
                }}
                autoFocus
              />
              <TextArea
                size="small"
                value={item.description ?? ''}
                placeholder={descriptionInputPlaceholder}
                onChange={(e) => onDescriptionChange?.(e.target.value)}
                rows={2}
              />
              <div className={styles['checklist-item__edit-actions']}>
                <Button emphasis="tertiary" size="small" onClick={onCancel}>
                  {cancelLabel}
                </Button>
                <Button
                  emphasis="primary"
                  size="small"
                  onClick={onSave}
                  disabled={!item.title.trim()}
                >
                  {saveLabel}
                </Button>
              </div>
            </div>
          ) : (
            <>
              <button
                type="button"
                id={titleId}
                className={styles['checklist-item__title']}
                disabled={!hasDescription}
                onClick={() => hasDescription && setDescriptionOpen((o) => !o)}
                aria-expanded={hasDescription ? descriptionOpen : undefined}
              >
                {item.title}
              </button>
              {hasDescription && descriptionOpen && (
                <p className={styles['checklist-item__description']}>
                  {item.description}
                </p>
              )}
            </>
          )}
        </div>
      </div>
      {showMeta && (
        <div className={styles['checklist-item__meta']}>
          {item.checkedBy && (
            <Chip
              size="small"
              compact
              leadingAvatar={
                item.checkedBy.src
                  ? { src: item.checkedBy.src, alt: item.checkedBy.name }
                  : undefined
              }
              leadingIcon={
                item.checkedBy.src ? undefined : <CheckCircleOutlineIcon />
              }
            >
              {item.checkedBy.name}
            </Chip>
          )}
          {item.assignee && (
            <Chip
              size="small"
              compact
              leadingAvatar={
                item.assignee.src
                  ? { src: item.assignee.src, alt: item.assignee.name }
                  : undefined
              }
            >
              {item.assignee.name}
            </Chip>
          )}
          {item.dueDate && (
            <Chip size="small" compact leadingIcon={<CalendarOutlineIcon />}>
              {item.dueDate}
            </Chip>
          )}
          {item.command && (
            <Chip
              size="small"
              compact
              leadingIcon={<SlashForwardBoxOutlineIcon />}
            >
              {item.command}
            </Chip>
          )}
        </div>
      )}
    </div>
  );
}
