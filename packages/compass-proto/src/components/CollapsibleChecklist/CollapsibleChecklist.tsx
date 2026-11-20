import {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type HTMLAttributes,
  type KeyboardEvent,
  type ReactNode,
  type RefObject,
} from 'react';
import { createPortal } from 'react-dom';
import ChevronDownIcon from '@mattermost/compass-icons/components/chevron-down';
import ChevronRightIcon from '@mattermost/compass-icons/components/chevron-right';
import ContentCopyIcon from '@mattermost/compass-icons/components/content-copy';
import DotsHorizontalIcon from '@mattermost/compass-icons/components/dots-horizontal';
import PencilOutlineIcon from '@mattermost/compass-icons/components/pencil-outline';
import PlusIcon from '@mattermost/compass-icons/components/plus';
import TrashCanOutlineIcon from '@mattermost/compass-icons/components/trash-can-outline';
import { Icon } from '@mattermost/compass-ui/components/icon';
import { IconButton } from '@mattermost/compass-ui/components/icon-button';
import { MenuItem } from '@mattermost/compass-ui/components/menu-item';
import {
  PopoverMenu,
  PopoverMenuGroup,
} from '@mattermost/compass-ui/components/popover-menu';
import { ProgressBar } from '@mattermost/compass-ui/components/progress-bar';
import { useOutsideClose } from '@mattermost/compass-ui/hooks/use-outside-close';
import ChecklistItem from '../ChecklistItem/ChecklistItem';
import type {
  ChecklistItemData,
  ChecklistItemState,
} from '../ChecklistItem/ChecklistItem';
import WithTooltip from '../WithTooltip/WithTooltip';
import styles from './CollapsibleChecklist.module.scss';

export interface CollapsibleChecklistProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  'title'
> {
  /** Section title. */
  title: ReactNode;
  /** Task rows. Prefer controlled `items` + `onItemsChange` for interactive prototypes. */
  items?: ChecklistItemData[];
  /** Uncontrolled initial tasks when `items` is omitted. */
  defaultItems?: ChecklistItemData[];
  onItemsChange?: (items: ChecklistItemData[]) => void;
  /** Controlled collapsed state. */
  collapsed?: boolean;
  /** Uncontrolled initial collapsed state. Default: false. */
  defaultCollapsed?: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;
  readOnly?: boolean;
  onRename?: () => void;
  onDuplicate?: () => void;
  onDelete?: () => void;
  /**
   * Formats the "n / n done" help text. Default: `{completed} / {total} done`.
   * Pass a translated node.
   */
  formatDoneLabel?: (completed: number, total: number) => ReactNode;
  addTaskLabel?: string;
  moreActionsLabel?: string;
  renameLabel?: string;
  duplicateLabel?: string;
  deleteLabel?: string;
  expandLabel?: string;
  collapseLabel?: string;
  titleInputPlaceholder?: string;
  descriptionInputPlaceholder?: string;
  className?: string;
}

function countProgress(items: ChecklistItemData[]): {
  completed: number;
  total: number;
  percentage: number;
} {
  let completed = 0;
  let total = 0;
  for (const item of items) {
    const state = item.state ?? 'open';
    if (state === 'skipped') continue;
    total += 1;
    if (state === 'closed') completed += 1;
  }
  return {
    completed,
    total,
    percentage: total === 0 ? 0 : (completed / total) * 100,
  };
}

interface SectionMenuProps {
  open: boolean;
  portalRef: RefObject<HTMLDivElement | null>;
  onClose: () => void;
  renameLabel: string;
  duplicateLabel: string;
  deleteLabel: string;
  onRename?: () => void;
  onDuplicate?: () => void;
  onDelete?: () => void;
}

/**
 * Portaled section overflow menu, same host pattern as Channel Bookmarks Bar:
 * position against the trigger, never in the header's flow.
 */
function SectionMenu({
  open,
  portalRef,
  onClose,
  renameLabel,
  duplicateLabel,
  deleteLabel,
  onRename,
  onDuplicate,
  onDelete,
}: SectionMenuProps) {
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

  // Portaled menu: focus first item on open; restore trigger when focus is
  // still inside the layer as it unmounts (Escape, item click, outside press).
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
        className={styles['collapsible-checklist__menu-slot']}
      />
      {open &&
        createPortal(
          // eslint-disable-next-line jsx-a11y/no-static-element-interactions -- keyboard handler for the role="menu" surface
          <div
            ref={(node) => {
              layerRef.current = node;
              portalRef.current = node;
            }}
            className={styles['collapsible-checklist__menu-layer']}
            style={style}
            onKeyDown={onLayerKeyDown}
          >
            <PopoverMenu open={open} role="menu">
              <PopoverMenuGroup>
                {onRename && (
                  <MenuItem
                    label={renameLabel}
                    leadingVisual={
                      <Icon glyph={<PencilOutlineIcon />} size="16" />
                    }
                    onClick={() => run(onRename)}
                  />
                )}
                {onDuplicate && (
                  <MenuItem
                    label={duplicateLabel}
                    leadingVisual={
                      <Icon glyph={<ContentCopyIcon />} size="16" />
                    }
                    onClick={() => run(onDuplicate)}
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
 * Playbooks checklist section: collapsible header with title and "n / n done",
 * a progress bar, task rows (`ChecklistItem`), and "Add a task". Collapse uses
 * the same CSS grid `0fr`↔`1fr` pattern as `AdminPanel` — there is no shared
 * Accordion / Disclosure primitive yet.
 */
export default function CollapsibleChecklist({
  title,
  items: itemsProp,
  defaultItems = [],
  onItemsChange,
  collapsed: collapsedProp,
  defaultCollapsed = false,
  onCollapsedChange,
  readOnly = false,
  onRename,
  onDuplicate,
  onDelete,
  formatDoneLabel,
  addTaskLabel = 'Add a task',
  moreActionsLabel = 'More',
  renameLabel = 'Rename section',
  duplicateLabel = 'Duplicate section',
  deleteLabel = 'Delete section',
  expandLabel = 'Expand section',
  collapseLabel = 'Collapse section',
  titleInputPlaceholder,
  descriptionInputPlaceholder,
  className = '',
  ...rest
}: CollapsibleChecklistProps) {
  const titleId = useId();
  const bodyId = useId();
  const headerRef = useRef<HTMLDivElement>(null);
  const menuPortalRef = useRef<HTMLDivElement | null>(null);

  const [internalItems, setInternalItems] =
    useState<ChecklistItemData[]>(defaultItems);
  const itemsControlled = itemsProp !== undefined;
  const items = itemsControlled ? itemsProp : internalItems;

  const setItems = useCallback(
    (next: ChecklistItemData[]) => {
      if (!itemsControlled) setInternalItems(next);
      onItemsChange?.(next);
    },
    [itemsControlled, onItemsChange],
  );

  const [internalCollapsed, setInternalCollapsed] = useState(defaultCollapsed);
  const collapsedControlled = collapsedProp !== undefined;
  const collapsed = collapsedControlled ? collapsedProp : internalCollapsed;

  const setCollapsed = useCallback(
    (next: boolean) => {
      if (!collapsedControlled) setInternalCollapsed(next);
      onCollapsedChange?.(next);
    },
    [collapsedControlled, onCollapsedChange],
  );

  const [menuOpen, setMenuOpen] = useState(false);
  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<ChecklistItemData>({
    id: 'draft',
    title: '',
    description: '',
    state: 'open',
  });

  const closeMenu = useCallback(() => setMenuOpen(false), []);
  useOutsideClose(headerRef, menuOpen, closeMenu, menuPortalRef);

  const { completed, total, percentage } = countProgress(items);
  const doneLabel =
    formatDoneLabel?.(completed, total) ?? `${completed} / ${total} done`;
  const hasSectionMenu = Boolean(onRename || onDuplicate || onDelete);

  const updateItem = (id: string, patch: Partial<ChecklistItemData>) => {
    setItems(
      items.map((item) => (item.id === id ? { ...item, ...patch } : item)),
    );
  };

  const updateItemState = (id: string, state: ChecklistItemState) => {
    updateItem(id, { state });
  };

  const startAdding = () => {
    setEditingId(null);
    setDraft({
      id: `draft-${Date.now()}`,
      title: '',
      description: '',
      state: 'open',
    });
    setAdding(true);
    if (collapsed) setCollapsed(false);
  };

  const cancelAdding = () => {
    setAdding(false);
    setDraft({ id: 'draft', title: '', description: '', state: 'open' });
  };

  const saveDraft = () => {
    const titleText = draft.title.trim();
    if (!titleText) return;
    setItems([
      ...items,
      {
        ...draft,
        id: `task-${Date.now()}`,
        title: titleText,
        description: draft.description?.trim() || undefined,
      },
    ]);
    cancelAdding();
  };

  const startEditing = (item: ChecklistItemData) => {
    setAdding(false);
    setEditingId(item.id);
    setDraft({ ...item });
  };

  const cancelEditing = () => {
    setEditingId(null);
    setDraft({ id: 'draft', title: '', description: '', state: 'open' });
  };

  const saveEditing = () => {
    if (!editingId) return;
    const titleText = draft.title.trim();
    if (!titleText) return;
    updateItem(editingId, {
      title: titleText,
      description: draft.description?.trim() || undefined,
    });
    cancelEditing();
  };

  const duplicateItem = (item: ChecklistItemData) => {
    setItems([
      ...items,
      {
        ...item,
        id: `task-${Date.now()}`,
        title: `${item.title} (copy)`,
        state: 'open',
        checkedBy: undefined,
      },
    ]);
  };

  const deleteItem = (id: string) => {
    setItems(items.filter((item) => item.id !== id));
    if (editingId === id) cancelEditing();
  };

  const rootClass = [
    styles['collapsible-checklist'],
    collapsed && styles['collapsible-checklist--collapsed'],
    menuOpen && styles['collapsible-checklist--menu-open'],
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={rootClass} {...rest}>
      <div ref={headerRef} className={styles['collapsible-checklist__header']}>
        <button
          type="button"
          className={styles['collapsible-checklist__toggle']}
          aria-expanded={!collapsed}
          aria-controls={bodyId}
          aria-label={collapsed ? expandLabel : collapseLabel}
          onClick={() => setCollapsed(!collapsed)}
        >
          <span
            className={styles['collapsible-checklist__chevron']}
            aria-hidden
          >
            <Icon
              size="16"
              glyph={collapsed ? <ChevronRightIcon /> : <ChevronDownIcon />}
            />
          </span>
          <span id={titleId} className={styles['collapsible-checklist__title']}>
            {title}
          </span>
          <span className={styles['collapsible-checklist__done']}>
            {doneLabel}
          </span>
        </button>
        {hasSectionMenu && !readOnly && (
          <div className={styles['collapsible-checklist__actions']}>
            <WithTooltip label={moreActionsLabel}>
              <IconButton
                size="x-small"
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
            <SectionMenu
              open={menuOpen}
              portalRef={menuPortalRef}
              onClose={closeMenu}
              renameLabel={renameLabel}
              duplicateLabel={duplicateLabel}
              deleteLabel={deleteLabel}
              onRename={onRename}
              onDuplicate={onDuplicate}
              onDelete={onDelete}
            />
          </div>
        )}
        <div className={styles['collapsible-checklist__progress']}>
          <ProgressBar
            size="small"
            value={percentage}
            aria-label={
              typeof doneLabel === 'string'
                ? doneLabel
                : `${completed} of ${total}`
            }
          />
        </div>
      </div>

      <div
        id={bodyId}
        role="region"
        aria-labelledby={titleId}
        className={[
          styles['collapsible-checklist__collapse'],
          !collapsed && styles['collapsible-checklist__collapse--expanded'],
        ]
          .filter(Boolean)
          .join(' ')}
        aria-hidden={collapsed}
        inert={collapsed}
      >
        <div className={styles['collapsible-checklist__collapse-inner']}>
          <div className={styles['collapsible-checklist__body']}>
            {items.map((item) =>
              editingId === item.id ? (
                <ChecklistItem
                  key={item.id}
                  item={draft}
                  editing
                  showDragHandle={false}
                  titleInputPlaceholder={titleInputPlaceholder}
                  descriptionInputPlaceholder={descriptionInputPlaceholder}
                  onTitleChange={(titleValue) =>
                    setDraft((prev) => ({ ...prev, title: titleValue }))
                  }
                  onDescriptionChange={(description) =>
                    setDraft((prev) => ({ ...prev, description }))
                  }
                  onSave={saveEditing}
                  onCancel={cancelEditing}
                />
              ) : (
                <ChecklistItem
                  key={item.id}
                  item={item}
                  readOnly={readOnly}
                  onStateChange={(state) => updateItemState(item.id, state)}
                  onEdit={readOnly ? undefined : () => startEditing(item)}
                  onAssign={
                    readOnly
                      ? undefined
                      : () =>
                          updateItem(item.id, {
                            assignee: item.assignee
                              ? undefined
                              : { name: 'You' },
                          })
                  }
                  onDueDate={
                    readOnly
                      ? undefined
                      : () =>
                          updateItem(item.id, {
                            dueDate: item.dueDate ? undefined : 'Tomorrow',
                          })
                  }
                  onDuplicate={readOnly ? undefined : () => duplicateItem(item)}
                  onDelete={readOnly ? undefined : () => deleteItem(item.id)}
                />
              ),
            )}
            {adding && (
              <ChecklistItem
                item={draft}
                editing
                showDragHandle={false}
                titleInputPlaceholder={titleInputPlaceholder}
                descriptionInputPlaceholder={descriptionInputPlaceholder}
                onTitleChange={(titleValue) =>
                  setDraft((prev) => ({ ...prev, title: titleValue }))
                }
                onDescriptionChange={(description) =>
                  setDraft((prev) => ({ ...prev, description }))
                }
                onSave={saveDraft}
                onCancel={cancelAdding}
              />
            )}
            {!readOnly && !adding && !editingId && (
              <button
                type="button"
                className={styles['collapsible-checklist__add']}
                onClick={startAdding}
              >
                <Icon size="16" glyph={<PlusIcon />} />
                {addTaskLabel}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
