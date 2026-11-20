import type {
  CSSProperties,
  FocusEvent,
  HTMLAttributes,
  KeyboardEvent,
  RefObject,
} from 'react';
import {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import { createPortal } from 'react-dom';
import AccountOutlineIcon from '@mattermost/compass-icons/components/account-outline';
import CalendarOutlineIcon from '@mattermost/compass-icons/components/calendar-outline';
import CheckCircleOutlineIcon from '@mattermost/compass-icons/components/check-circle-outline';
import CloseIcon from '@mattermost/compass-icons/components/close';
import ContentCopyIcon from '@mattermost/compass-icons/components/content-copy';
import DotsHorizontalIcon from '@mattermost/compass-icons/components/dots-horizontal';
import DragVerticalIcon from '@mattermost/compass-icons/components/drag-vertical';
import PencilOutlineIcon from '@mattermost/compass-icons/components/pencil-outline';
import RestoreIcon from '@mattermost/compass-icons/components/restore';
import SlashForwardBoxOutlineIcon from '@mattermost/compass-icons/components/slash-forward-box-outline';
import TrashCanOutlineIcon from '@mattermost/compass-icons/components/trash-can-outline';
import { Checkbox } from '@mattermost/compass-ui/components/checkbox';
import { Chip } from '@mattermost/compass-ui/components/chip';
import { Icon } from '@mattermost/compass-ui/components/icon';
import { IconButton } from '@mattermost/compass-ui/components/icon-button';
import { MenuItem } from '@mattermost/compass-ui/components/menu-item';
import {
  PopoverMenu,
  PopoverMenuGroup,
} from '@mattermost/compass-ui/components/popover-menu';
import { useOutsideClose } from '@mattermost/compass-ui/hooks/use-outside-close';
import WithTooltip from '../WithTooltip/WithTooltip';
import styles from './ChecklistItem.module.scss';

function focusEditableEnd(node: HTMLElement | null) {
  if (!node) return;
  node.focus();
  const selection = window.getSelection();
  if (!selection) return;
  const range = document.createRange();
  range.selectNodeContents(node);
  range.collapse(false);
  selection.removeAllRanges();
  selection.addRange(range);
}

function editableText(node: HTMLElement) {
  return node.innerText.replace(/\u00a0/g, ' ').replace(/\n$/, '');
}

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
   * Inline create/edit mode: title and description become contentEditable
   * text (no input chrome). Enter / blur saves; Escape cancels.
   */
  editing?: boolean;
  /**
   * When editing, focus the title field on mount / when editing becomes true.
   * Set false for remounted drafts so blur/Tab resets don’t steal focus back.
   * Default: true.
   */
  autoFocus?: boolean;
  onStateChange?: (state: ChecklistItemState) => void;
  onTitleChange?: (title: string) => void;
  onDescriptionChange?: (description: string) => void;
  onSave?: () => void;
  onCancel?: () => void;
  onEdit?: () => void;
  onAssign?: () => void;
  onDueDate?: () => void;
  onDuplicate?: () => void;
  onDelete?: () => void;
  dragHandleLabel?: string;
  titleInputPlaceholder?: string;
  descriptionInputPlaceholder?: string;
  editLabel?: string;
  assignLabel?: string;
  dueDateLabel?: string;
  moreActionsLabel?: string;
  duplicateLabel?: string;
  skipLabel?: string;
  restoreLabel?: string;
  deleteLabel?: string;
  actionsToolbarLabel?: string;
  className?: string;
}

interface ItemMoreMenuProps {
  open: boolean;
  portalRef: RefObject<HTMLDivElement | null>;
  onClose: () => void;
  skipped: boolean;
  duplicateLabel: string;
  skipLabel: string;
  restoreLabel: string;
  deleteLabel: string;
  onDuplicate?: () => void;
  onSkipToggle?: () => void;
  onDelete?: () => void;
}

/**
 * Portaled overflow menu for a task row — same host pattern as Message /
 * Bookmarks menus: never in the row's flow.
 */
function ItemMoreMenu({
  open,
  portalRef,
  onClose,
  skipped,
  duplicateLabel,
  skipLabel,
  restoreLabel,
  deleteLabel,
  onDuplicate,
  onSkipToggle,
  onDelete,
}: ItemMoreMenuProps) {
  const slotRef = useRef<HTMLSpanElement>(null);
  const layerRef = useRef<HTMLDivElement>(null);
  const [style, setStyle] = useState<CSSProperties>({ visibility: 'hidden' });

  useLayoutEffect(() => {
    if (!open) return undefined;
    const place = () => {
      const slot = slotRef.current;
      const layer = layerRef.current;
      if (!slot || !layer) return;
      const rect = slot.getBoundingClientRect();
      const { offsetWidth: width, offsetHeight: height } = layer;
      const margin = 8;
      const gap = 4;
      const fitsBelow = rect.top + gap + height <= window.innerHeight - margin;
      const triggerTop =
        slot.parentElement?.getBoundingClientRect().top ?? rect.top;
      const top = fitsBelow
        ? rect.top + gap
        : Math.max(margin, triggerTop - gap - height);
      const left = Math.min(
        Math.max(margin, rect.left - width),
        Math.max(margin, window.innerWidth - width - margin),
      );
      setStyle({ top, left });
    };
    place();
    const ro = new ResizeObserver(place);
    if (layerRef.current) ro.observe(layerRef.current);
    window.addEventListener('resize', place);
    window.addEventListener('scroll', place, true);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', place);
      window.removeEventListener('scroll', place, true);
    };
  }, [open]);

  const focusTrigger = () =>
    slotRef.current?.parentElement
      ?.querySelector<HTMLElement>('[aria-haspopup="menu"]')
      ?.focus();

  useEffect(() => {
    if (!open) return undefined;
    const frame = requestAnimationFrame(() => {
      layerRef.current?.querySelector<HTMLElement>('button')?.focus();
    });
    return () => {
      cancelAnimationFrame(frame);
      if (layerRef.current?.contains(document.activeElement)) focusTrigger();
    };
  }, [open]);

  const closeToTrigger = () => {
    onClose();
    focusTrigger();
  };

  const onLayerKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Escape' || e.key === 'Tab') {
      e.preventDefault();
      e.stopPropagation();
      closeToTrigger();
    }
  };

  const run = (action?: () => void) => {
    action?.();
    closeToTrigger();
  };

  return (
    <>
      <span
        ref={slotRef}
        aria-hidden="true"
        className={styles['checklist-item__menu-slot']}
      />
      {open &&
        createPortal(
          // eslint-disable-next-line jsx-a11y/no-static-element-interactions -- keyboard handler for the role="menu" surface
          <div
            ref={(node) => {
              layerRef.current = node;
              portalRef.current = node;
            }}
            className={styles['checklist-item__menu-layer']}
            style={style}
            onKeyDown={onLayerKeyDown}
          >
            <PopoverMenu open={open} role="menu">
              <PopoverMenuGroup>
                {onDuplicate && (
                  <MenuItem
                    label={duplicateLabel}
                    leadingVisual={
                      <Icon glyph={<ContentCopyIcon />} size="16" />
                    }
                    onClick={() => run(onDuplicate)}
                  />
                )}
                {onSkipToggle && (
                  <MenuItem
                    label={skipped ? restoreLabel : skipLabel}
                    leadingVisual={
                      <Icon
                        glyph={skipped ? <RestoreIcon /> : <CloseIcon />}
                        size="16"
                      />
                    }
                    onClick={() => run(onSkipToggle)}
                  />
                )}
                {onDelete && (
                  <MenuItem
                    label={deleteLabel}
                    destructive
                    leadingVisual={
                      <Icon glyph={<TrashCanOutlineIcon />} size="16" />
                    }
                    onClick={() => run(onDelete)}
                  />
                )}
              </PopoverMenuGroup>
            </PopoverMenu>
          </div>,
          document.body,
        )}
    </>
  );
}

/**
 * One Playbooks checklist task row: drag handle, checkbox, title, optional
 * description, meta chips, and a Message Actions–style hover toolbar
 * (assign, due date, edit, more). Requirements, conditions and bulk select
 * stay out of this first cut.
 */
export default function ChecklistItem({
  item,
  readOnly = false,
  showDragHandle = true,
  editing = false,
  autoFocus = true,
  onStateChange,
  onTitleChange,
  onDescriptionChange,
  onSave,
  onCancel,
  onEdit,
  onAssign,
  onDueDate,
  onDuplicate,
  onDelete,
  dragHandleLabel = 'Drag to reorder',
  titleInputPlaceholder = 'Task name',
  descriptionInputPlaceholder = 'Add a description…',
  editLabel = 'Edit',
  assignLabel = 'Assign',
  dueDateLabel = 'Due date',
  moreActionsLabel = 'More',
  duplicateLabel = 'Duplicate task',
  skipLabel = 'Skip task',
  restoreLabel = 'Restore task',
  deleteLabel = 'Delete task',
  actionsToolbarLabel = 'Task actions',
  className = '',
  ...rest
}: ChecklistItemProps) {
  const titleId = useId();
  const editRootRef = useRef<HTMLDivElement>(null);
  const titleEditRef = useRef<HTMLDivElement>(null);
  const descriptionEditRef = useRef<HTMLDivElement>(null);
  const actionsRef = useRef<HTMLDivElement>(null);
  const menuPortalRef = useRef<HTMLDivElement | null>(null);
  const state = item.state ?? 'open';
  const checked = state === 'closed';
  const skipped = state === 'skipped';
  const [descriptionOpen, setDescriptionOpen] = useState(
    Boolean(item.description),
  );
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!editing) return;
    const titleNode = titleEditRef.current;
    const descriptionNode = descriptionEditRef.current;
    if (titleNode) titleNode.textContent = item.title;
    if (descriptionNode) descriptionNode.textContent = item.description ?? '';
    // Seed editable text when entering edit mode (or remounting a draft).
    // Skip focus when the host remounts after a blur reset so Tab can leave.
    if (autoFocus) focusEditableEnd(titleNode);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- intentionally seed on edit start only
  }, [editing, autoFocus]);

  const closeMenu = useCallback(() => setMenuOpen(false), []);
  useOutsideClose(actionsRef, menuOpen, closeMenu, menuPortalRef);

  const handleEditFocusOut = (e: FocusEvent<HTMLDivElement>) => {
    const next = e.relatedTarget as Node | null;
    if (editRootRef.current?.contains(next)) return;
    onSave?.();
  };

  const handleTitleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter') {
      // IME Enter confirms a composition candidate — don't save yet.
      if (e.nativeEvent.isComposing) return;
      e.preventDefault();
      onSave?.();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      onCancel?.();
    }
  };

  const handleDescriptionKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      onCancel?.();
    }
  };

  const hasDescription = Boolean(item.description?.trim());
  const showCheckedBy = checked && Boolean(item.checkedBy);
  const showMeta =
    !editing &&
    Boolean(showCheckedBy || item.assignee || item.dueDate || item.command);

  const hasMoreMenu = Boolean(onDuplicate || onDelete || onStateChange);
  const showActions =
    !readOnly &&
    !editing &&
    Boolean(onEdit || onAssign || onDueDate || hasMoreMenu);

  const showDrag = showDragHandle && !readOnly;

  const rootClass = [
    styles['checklist-item'],
    checked && styles['checklist-item--closed'],
    skipped && styles['checklist-item--skipped'],
    editing && styles['checklist-item--editing'],
    menuOpen && styles['checklist-item--menu-open'],
    showDrag && styles['checklist-item--with-drag'],
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
      {showActions && (
        <div
          ref={actionsRef}
          className={styles['checklist-item__actions-slot']}
        >
          <div
            className={styles['checklist-item__actions']}
            role="toolbar"
            aria-label={actionsToolbarLabel}
          >
            {onAssign && !skipped && (
              <WithTooltip label={assignLabel}>
                <IconButton
                  size="small"
                  padding="compact"
                  icon={<Icon glyph={<AccountOutlineIcon />} />}
                  onClick={(e) => {
                    e.stopPropagation();
                    onAssign();
                  }}
                />
              </WithTooltip>
            )}
            {onDueDate && !skipped && (
              <WithTooltip label={dueDateLabel}>
                <IconButton
                  size="small"
                  padding="compact"
                  icon={<Icon glyph={<CalendarOutlineIcon />} />}
                  onClick={(e) => {
                    e.stopPropagation();
                    onDueDate();
                  }}
                />
              </WithTooltip>
            )}
            {onEdit && (
              <WithTooltip label={editLabel}>
                <IconButton
                  size="small"
                  padding="compact"
                  icon={<Icon glyph={<PencilOutlineIcon />} />}
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit();
                  }}
                />
              </WithTooltip>
            )}
            {hasMoreMenu && (
              <>
                <WithTooltip label={moreActionsLabel}>
                  <IconButton
                    size="small"
                    padding="compact"
                    aria-haspopup="menu"
                    aria-expanded={menuOpen}
                    icon={<Icon glyph={<DotsHorizontalIcon />} />}
                    onClick={(e) => {
                      e.stopPropagation();
                      setMenuOpen((open) => !open);
                    }}
                  />
                </WithTooltip>
                <ItemMoreMenu
                  open={menuOpen}
                  portalRef={menuPortalRef}
                  onClose={closeMenu}
                  skipped={skipped}
                  duplicateLabel={duplicateLabel}
                  skipLabel={skipLabel}
                  restoreLabel={restoreLabel}
                  deleteLabel={deleteLabel}
                  onDuplicate={onDuplicate}
                  onSkipToggle={
                    onStateChange
                      ? () => onStateChange(skipped ? 'open' : 'skipped')
                      : undefined
                  }
                  onDelete={onDelete}
                />
              </>
            )}
          </div>
        </div>
      )}

      <div className={styles['checklist-item__row']}>
        {showDrag && (
          <WithTooltip
            label={dragHandleLabel}
            className={styles['checklist-item__drag']}
          >
            <span aria-hidden={editing || undefined}>
              <Icon size="16" glyph={<DragVerticalIcon />} />
            </span>
          </WithTooltip>
        )}
        <Checkbox
          className={styles['checklist-item__checkbox']}
          size="medium"
          checked={checked}
          disabled={readOnly || skipped || editing}
          onChange={handleCheckChange}
          aria-labelledby={editing ? undefined : titleId}
          aria-label={editing ? item.title || titleInputPlaceholder : undefined}
        />
        <div className={styles['checklist-item__body']}>
          {editing ? (
            <div
              ref={editRootRef}
              className={styles['checklist-item__edit']}
              onBlur={handleEditFocusOut}
            >
              <div
                ref={titleEditRef}
                id={titleId}
                role="textbox"
                tabIndex={0}
                aria-label={titleInputPlaceholder}
                contentEditable
                suppressContentEditableWarning
                data-placeholder={titleInputPlaceholder}
                className={[
                  styles['checklist-item__title'],
                  styles['checklist-item__title--editing'],
                ].join(' ')}
                onInput={(e) => onTitleChange?.(editableText(e.currentTarget))}
                onKeyDown={handleTitleKeyDown}
              />
              <div
                ref={descriptionEditRef}
                role="textbox"
                tabIndex={0}
                aria-multiline="true"
                aria-label={descriptionInputPlaceholder}
                contentEditable
                suppressContentEditableWarning
                data-placeholder={descriptionInputPlaceholder}
                className={[
                  styles['checklist-item__description'],
                  styles['checklist-item__description--editing'],
                ].join(' ')}
                onInput={(e) =>
                  onDescriptionChange?.(editableText(e.currentTarget))
                }
                onKeyDown={handleDescriptionKeyDown}
              />
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
              {hasDescription && (
                <div
                  className={[
                    styles['checklist-item__description-collapse'],
                    descriptionOpen &&
                      styles['checklist-item__description-collapse--expanded'],
                  ]
                    .filter(Boolean)
                    .join(' ')}
                  inert={!descriptionOpen}
                >
                  <div
                    className={
                      styles['checklist-item__description-collapse-inner']
                    }
                  >
                    <p className={styles['checklist-item__description']}>
                      {item.description}
                    </p>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
      {showMeta && (
        <div className={styles['checklist-item__meta']}>
          {showCheckedBy && item.checkedBy && (
            <Chip
              size="medium"
              compact
              className={styles['checklist-item__chip']}
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
              size="medium"
              compact
              className={styles['checklist-item__chip']}
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
            <Chip
              size="medium"
              compact
              className={styles['checklist-item__chip']}
              leadingIcon={<CalendarOutlineIcon />}
            >
              {item.dueDate}
            </Chip>
          )}
          {item.command && (
            <Chip
              size="medium"
              compact
              className={styles['checklist-item__chip']}
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
