import { useMemo, useRef, useState, type ChangeEvent } from 'react';
import { Chip } from '@mattermost/compass-ui/components/chip';
import { Dropdown } from '@mattermost/compass-ui/components/dropdown';
import { EmptyState } from '@mattermost/compass-ui/components/empty-state';
import { MenuItem } from '@mattermost/compass-ui/components/menu-item';
import { Modal, ModalOverlay } from '@mattermost/compass-ui/components/modal';
import type { ModalOverlayProps } from '@mattermost/compass-ui/components/modal';
import { SearchInput } from '@mattermost/compass-ui/components/search-input';
import { SegmentedControl } from '@mattermost/compass-ui/components/segmented-control';
import SearchIllustration from '@mattermost/compass-ui/illustrations/search';
import SearchPortalMenu from './SearchPortalMenu';
import SearchResultsList from './SearchResultsList';
import SearchTip, { type SearchTipConfig } from './SearchTip';
import { buildModeContent } from './searchSections';
import {
  DEFAULT_MODE_LABELS,
  DEFAULT_PLACEHOLDERS,
  SEARCH_MODES,
  type SearchMode,
  type SearchModalData,
  type SearchModalLabels,
  type SearchModalSelection,
  type SearchModalSubmission,
  type SearchRecent,
  type SearchTeam,
} from './searchTypes';
import { useSearchModal } from './useSearchModal';
import styles from './SearchModal.module.scss';

export interface SearchModalProps {
  /** Whether the dialog is shown. The host owns this state (and the shortcuts / header entry point). */
  open: boolean;
  /** Called on Escape and on a click outside the dialog. */
  onClose: () => void;
  /** Called after the exit motion finishes and the dialog unmounts. */
  onExited?: () => void;
  /** What each mode lists. The host owns the data and any filtering by team. */
  data?: SearchModalData;
  /** Mode shown when the dialog opens. State resets on every open. Default: `all`. */
  initialMode?: SearchMode;
  /** Modes to offer, in order. Default: all six. */
  modes?: readonly SearchMode[];
  /** Called when the user switches mode. */
  onModeChange?: (mode: SearchMode) => void;
  /** Teams to search across. Pass them to show the team selector ("All teams" + each team). */
  teams?: SearchTeam[];
  /** Selected team id; `null` is all teams. Omit to let the dialog keep it while open. */
  teamId?: string | null;
  onTeamChange?: (teamId: string | null) => void;
  /** A row was chosen with Enter or a click. The host navigates. */
  onSelect?: (selection: SearchModalSelection) => void;
  /**
   * Enter with no row highlighted. In Messages this runs the search (with any
   * modifier chips); in Agents it sends the query to the chosen agent. The host
   * closes the dialog and shows the results.
   */
  onSubmit?: (submission: SearchModalSubmission) => void;
  /** A recent search's remove control (or Shift+Delete) was used. */
  onRemoveRecent?: (
    mode: 'all' | 'messages' | 'files',
    item: SearchRecent,
  ) => void;
  /** "Browse channels" in the Channels footer. */
  onBrowseChannels?: () => void;
  /** "browse for teammates" in the People footer. */
  onBrowseTeammates?: () => void;
  /** "start a group message" in the People footer. */
  onStartGroupMessage?: () => void;
  /**
   * Element the dialog hangs from: the global header's Search field. The dialog
   * opens centered on it, 8px below its top edge, over a transparent scrim that
   * still closes on a click. For `GlobalHeader`, pass
   * `event.currentTarget.parentElement` from `onSearchClick` (the field box).
   * Without it the dialog sits at the top center of the viewport.
   */
  anchor?: HTMLElement | null;
  /** Passed to the `ModalOverlay` scrim (`container`, `zIndex`, …). The host owns the portal node and stacking. */
  overlayProps?: Omit<
    ModalOverlayProps,
    'open' | 'onClose' | 'onExited' | 'children'
  >;
  /** Translatable copy. Every string has an English default. */
  labels?: SearchModalLabels;
  className?: string;
}

const DIALOG_WIDTH = 704; // Modal size "medium"
const ANCHOR_OFFSET = 8;
const VIEWPORT_MARGIN = 8;

/**
 * Universal search: the dialog behind the global header's Search field. A mode
 * control (All, Channels, Messages, Files, People, Agents) sits where a title
 * would, over a large search field and a keyboard-navigable list that changes
 * with the mode and with what the user has typed. There is no visible title or
 * close button; the dialog hangs from the Search field over a transparent scrim.
 * Composes `ModalOverlay`, `Modal`, `SegmentedControl`, `SearchInput` and
 * `SuggestionList`. Focus stays in the field; arrow keys move the highlight
 * (`aria-activedescendant`). The host owns `open`, the data, and what choosing a
 * row or submitting does.
 */
export default function SearchModal({
  open,
  onClose,
  onExited,
  anchor,
  overlayProps,
  ...rest
}: SearchModalProps) {
  const container = overlayProps?.container;
  // Measured when `open` changes, not on every keystroke. It also applies while
  // closing, so the exit fade plays over the field instead of snapping back.
  const placement = useMemo(() => {
    if (typeof window === 'undefined') return undefined;
    // A staged scrim (docs frame) is positioned inside its container, so
    // measure from the container instead of the viewport.
    const frame = container?.getBoundingClientRect();
    const originX = frame?.left ?? 0;
    const originY = frame?.top ?? 0;
    const width = frame?.width ?? window.innerWidth;
    const rect = anchor?.getBoundingClientRect();
    const centerX = rect ? rect.left - originX + rect.width / 2 : width / 2;
    const left = Math.min(
      Math.max(centerX - DIALOG_WIDTH / 2, VIEWPORT_MARGIN),
      Math.max(width - DIALOG_WIDTH - VIEWPORT_MARGIN, VIEWPORT_MARGIN),
    );
    const top = rect ? rect.top - originY : 0;
    return {
      alignItems: 'flex-start',
      justifyContent: 'flex-start',
      padding: `${top + ANCHOR_OFFSET}px 0 0 ${left}px`,
      backgroundColor: 'transparent',
    } as const;
    // `open` is a trigger, not an input: re-measure each time the dialog opens.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, anchor, container]);

  return (
    <ModalOverlay
      {...overlayProps}
      style={{ ...placement, ...overlayProps?.style }}
      open={open}
      onClose={onClose}
      onExited={onExited}
    >
      <SearchModalPanel open={open} onClose={onClose} {...rest} />
    </ModalOverlay>
  );
}

type PanelProps = Omit<
  SearchModalProps,
  'overlayProps' | 'onExited' | 'anchor'
>;

function SearchModalPanel({
  open,
  onClose,
  data = {},
  initialMode = 'all',
  modes = SEARCH_MODES,
  onModeChange,
  teams,
  teamId,
  onTeamChange,
  onSelect,
  onSubmit,
  onRemoveRecent,
  onBrowseChannels,
  onBrowseTeammates,
  onStartGroupMessage,
  labels = {},
  className,
}: PanelProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const teamRef = useRef<HTMLSpanElement>(null);
  // Start on an offered mode, even if `initialMode` isn't one of them.
  const [mode, setMode] = useState<SearchMode>(
    modes.includes(initialMode) ? initialMode : (modes[0] ?? initialMode),
  );
  // Which way the content slides in after a mode switch (none on first open).
  const [enterFrom, setEnterFrom] = useState<'forward' | 'back' | null>(null);
  const [query, setQuery] = useState('');
  const [chips, setChips] = useState<string[]>([]);
  const [pickedAgent, setPickedAgent] = useState<string>();
  // The first agent until one is picked, even if `data.agents` arrives later.
  const agentId =
    data.agents?.find((a) => a.id === pickedAgent)?.id ?? data.agents?.[0]?.id;
  const [teamMenuOpen, setTeamMenuOpen] = useState(false);
  const [localTeam, setLocalTeam] = useState<string | null>(null);
  const activeTeam = teamId !== undefined ? teamId : localTeam;

  const content = useMemo(
    () => buildModeContent({ mode, query, data, labels, onRemoveRecent }),
    [mode, query, data, labels, onRemoveRecent],
  );

  const hasInput = query.trim() !== '' || chips.length > 0;
  const submittable =
    mode === 'messages' ? hasInput : mode === 'agents' && query.trim() !== '';

  const handleSubmit = () => {
    if (!submittable) return;
    onSubmit?.({
      mode,
      query: query.trim(),
      chips,
      agentId: mode === 'agents' ? agentId : undefined,
    });
  };

  const choose = (value: string) => {
    const action = content.actions.get(value);
    if (!action) return;
    if (action.type === 'from') {
      setChips((c) => [...c, `From: ${action.person.name}`]);
      setQuery('');
      inputRef.current?.focus();
      return;
    }
    onSelect?.(action.selection);
  };

  const search = useSearchModal({
    sections: content.sections,
    query,
    open,
    // Messages and Agents search on Enter; the other modes open the first row.
    autoHighlight: mode !== 'messages' && mode !== 'agents',
    onChoose: choose,
    onSubmit: handleSubmit,
    onClose,
    removers: content.removers,
  });

  const changeMode = (next: SearchMode) => {
    if (next === mode) return;
    setEnterFrom(
      modes.indexOf(next) > modes.indexOf(mode) ? 'forward' : 'back',
    );
    setMode(next);
    setQuery('');
    setChips([]);
    onModeChange?.(next);
    inputRef.current?.focus();
  };

  const modifierTip = (modifiers: readonly string[]): SearchTipConfig => ({
    kind: 'modifiers',
    modifiers,
    onModifierClick: (modifier) => {
      setQuery(
        (q) => `${q.trim() ? `${q.trim()} ` : ''}${modifier.toLowerCase()}`,
      );
      inputRef.current?.focus();
    },
  });

  let tip: SearchTipConfig;
  switch (mode) {
    case 'all':
      tip = {
        kind: 'note',
        text: labels.tips?.allNote ?? 'Results update as you type',
      };
      break;
    case 'channels':
      tip = { kind: 'browse-channels', onBrowse: onBrowseChannels };
      break;
    case 'messages':
      tip = hasInput
        ? { kind: 'enter-search' }
        : modifierTip(data.messageModifiers ?? []);
      break;
    case 'files':
      tip = modifierTip(data.fileModifiers ?? []);
      break;
    case 'people':
      tip = {
        kind: 'people',
        onBrowse: onBrowseTeammates,
        onGroupMessage: onStartGroupMessage,
      };
      break;
    default:
      tip = {
        kind: 'agents',
        agents: data.agents ?? [],
        selectedId: agentId,
        onSelect: setPickedAgent,
      };
  }

  const placeholder = labels.placeholders?.[mode] ?? DEFAULT_PLACEHOLDERS[mode];
  const activeTeamName =
    teams?.find((t) => t.id === activeTeam)?.name ??
    labels.allTeamsLabel ??
    'All teams';
  const chooseTeam = (id: string | null) => {
    setLocalTeam(id);
    onTeamChange?.(id);
    setTeamMenuOpen(false);
  };

  return (
    <Modal
      className={[styles['search-modal'], className].filter(Boolean).join(' ')}
      open={open}
      size="medium"
      title={labels.title ?? 'Search'}
      hideTitle
      bodyPadding="menu"
      headerDivider={false}
      onClose={onClose}
      initialFocusRef={inputRef}
      headerLeading={
        <SegmentedControl
          aria-label={labels.modesLabel ?? 'Search modes'}
          options={modes.map((key) => ({
            key,
            label: labels.modeLabels?.[key] ?? DEFAULT_MODE_LABELS[key],
          }))}
          value={mode}
          onChange={(key) => changeMode(key as SearchMode)}
        />
      }
      headerAction={
        teams && teams.length > 0 ? (
          <span ref={teamRef} className={styles['search-modal__team']}>
            <Dropdown
              size="small"
              isOpen={teamMenuOpen}
              aria-label={labels.teamLabel ?? 'Search team'}
              aria-haspopup="menu"
              onClick={() => setTeamMenuOpen((o) => !o)}
            >
              {activeTeamName}
            </Dropdown>
            <SearchPortalMenu
              open={teamMenuOpen}
              anchorRef={teamRef}
              align="end"
              label={labels.teamLabel ?? 'Search team'}
              onClose={() => setTeamMenuOpen(false)}
            >
              <MenuItem
                role="menuitemradio"
                aria-checked={activeTeam == null}
                leadingElement={false}
                label={labels.allTeamsLabel ?? 'All teams'}
                trailingElement={activeTeam == null}
                onClick={() => chooseTeam(null)}
              />
              {teams.map((team) => (
                <MenuItem
                  key={team.id}
                  role="menuitemradio"
                  aria-checked={team.id === activeTeam}
                  leadingElement={false}
                  label={team.name}
                  trailingElement={team.id === activeTeam}
                  onClick={() => chooseTeam(team.id)}
                />
              ))}
            </SearchPortalMenu>
          </span>
        ) : undefined
      }
      headerSlot={
        <div className={styles['search-modal__header']}>
          {chips.length > 0 && (
            <div className={styles['search-modal__chips']}>
              {chips.map((chip, index) => (
                <Chip
                  key={`${chip}-${index}`}
                  size="small"
                  aria-label={labels.removeChipLabel?.(chip)}
                  onRemove={() =>
                    setChips((all) => all.filter((_, i) => i !== index))
                  }
                >
                  {chip}
                </Chip>
              ))}
            </div>
          )}
          <div className={styles['search-modal__field']}>
            <SearchInput
              ref={inputRef}
              size="large"
              placeholder={placeholder}
              aria-label={placeholder}
              autoComplete="off"
              autoCorrect="off"
              spellCheck={false}
              {...search.inputProps}
              value={query}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setQuery(e.target.value)
              }
              clearLabel={labels.clearLabel ?? 'Clear search'}
              onClear={() => setQuery('')}
              onKeyDown={search.onKeyDown}
            />
          </div>
        </div>
      }
      footerLeading={<SearchTip tip={tip} tips={labels.tips} />}
      footerType="pagination"
      footerDivider
    >
      {/* Keyed by mode so a switch remounts the content and plays the slide. */}
      <div key={mode} className={styles['search-modal__stage']}>
        <div
          className={[
            styles['search-modal__content'],
            enterFrom === 'forward' &&
              styles['search-modal__content--enter-forward'],
            enterFrom === 'back' && styles['search-modal__content--enter-back'],
          ]
            .filter(Boolean)
            .join(' ')}
        >
          {content.noResults ? (
            <EmptyState
              title={labels.emptyTitle ?? 'No results found'}
              titleLevel={3}
              description={
                labels.emptyDescription ??
                "Try adjusting your search or filters to find what you're looking for."
              }
              illustration={{
                'aria-label': 'Search',
                width: '120px',
                height: '80px',
                children: <SearchIllustration />,
              }}
            />
          ) : (
            content.sections.length > 0 && (
              <SearchResultsList
                sections={content.sections}
                label={labels.listboxLabel ?? 'Search results'}
                {...search.listProps}
                onSelect={(option) => choose(option.value)}
              />
            )
          )}
        </div>
      </div>
    </Modal>
  );
}
