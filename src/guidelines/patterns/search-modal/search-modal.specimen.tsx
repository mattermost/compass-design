import { useCallback, useState } from 'react';
import {
  GlobalHeader,
  cyberDefenseCurrentUserId,
  getCyberDefenseUser,
  RightSidebar,
  RightSidebarSearchResults,
  SearchModal,
  type SearchMode,
  type SearchModalData,
  type SearchModalSubmission,
} from '@mattermost/compass-proto';
import { Button } from '@mattermost/compass-ui/components/button';
import { RightSidebarHeader } from '@mattermost/compass-ui/components/right-sidebar-header';
import { avatars } from '@/fixtures/avatarRegistry';
import styles from '@/styles/library-demo/patterns.module.scss';
import {
  SEARCH_MODAL_DATA,
  SEARCH_MODAL_TEAMS,
  searchMessages,
} from './searchModalFixtures';

/**
 * Stages the real dialog inside the canvas frame instead of the page, hanging
 * from a Global Header's Search field. Every mode has content; Enter in
 * Messages closes the dialog and shows the results panel, and Enter in Agents
 * reports the agent it was sent to. Removing a recent search sticks while open.
 */
export function SearchModalCanvas({
  initialMode = 'all',
}: {
  initialMode?: SearchMode;
}) {
  const [stage, setStage] = useState<HTMLDivElement | null>(null);
  const [open, setOpen] = useState(true);
  // The staged preview is open on load, so it must not take focus from the page.
  // Once the user opens it themselves it manages focus like the real dialog.
  const [focusManaged, setFocusManaged] = useState(false);
  const [mode, setMode] = useState<SearchMode>(initialMode);
  const [data, setData] = useState<SearchModalData>(SEARCH_MODAL_DATA);
  const [anchor, setAnchor] = useState<HTMLElement | null>(null);
  const [results, setResults] = useState<SearchModalSubmission | null>(null);
  const [note, setNote] = useState<string | null>(null);
  // The dialog hangs from the header's search field box.
  const headerRef = useCallback((el: HTMLDivElement | null) => {
    setAnchor(el?.querySelector('input[type="search"]')?.parentElement ?? null);
  }, []);

  const reopen = (next?: SearchMode) => {
    setFocusManaged(true);
    if (next) setMode(next);
    setResults(null);
    setOpen(true);
  };

  const terms = results ? results.query.split(/\s+/).filter(Boolean) : [];
  const hits = results ? searchMessages(terms) : [];

  return (
    <div style={{ width: '100%' }}>
      <div
        ref={setStage}
        className={[
          styles['patterns__modal-canvas'],
          styles['patterns__modal-canvas--tall'],
        ].join(' ')}
      >
        <div ref={headerRef}>
          <GlobalHeader
            product="channels"
            userAvatarSrc={avatars[cyberDefenseCurrentUserId]}
            userAvatarAlt={
              getCyberDefenseUser(cyberDefenseCurrentUserId)?.displayName
            }
            onSearchClick={(event) => {
              setAnchor(event.currentTarget.parentElement);
              reopen();
            }}
          />
        </div>
        {results && results.mode === 'messages' && (
          <div className={styles['patterns__search-modal-rhs']}>
            <RightSidebar
              header={
                <RightSidebarHeader
                  title="Search results"
                  onClose={() => setResults(null)}
                />
              }
            >
              <RightSidebarSearchResults results={hits} terms={terms} />
            </RightSidebar>
          </div>
        )}
        {stage && (
          <SearchModal
            open={open}
            anchor={anchor}
            manageFocus={focusManaged}
            data={data}
            defaultAgentId="matty"
            initialMode={mode}
            onModeChange={setMode}
            teams={SEARCH_MODAL_TEAMS}
            overlayProps={{
              container: stage,
              lockScroll: false,
              style: { position: 'absolute' },
            }}
            onClose={() => setOpen(false)}
            onRemoveRecent={(recentMode, item) =>
              setData((current) =>
                recentMode === 'files'
                  ? {
                      ...current,
                      recentFileSearches: current.recentFileSearches?.filter(
                        (r) => r.id !== item.id,
                      ),
                    }
                  : recentMode === 'agents'
                    ? {
                        ...current,
                        recentAgentSearches:
                          current.recentAgentSearches?.filter(
                            (r) => r.id !== item.id,
                          ),
                      }
                    : {
                        ...current,
                        recentMessageSearches:
                          current.recentMessageSearches?.filter(
                            (r) => r.id !== item.id,
                          ),
                      },
              )
            }
            onSelect={(selection) => {
              if (
                selection.kind === 'suggestion' ||
                (selection.kind === 'recent' && selection.mode === 'agents')
              ) {
                // A suggested or recent question goes to the agent like Enter.
                const agent = data.agents?.find(
                  (a) => a.id === selection.agentId,
                );
                setNote(`Sent “${selection.item.query}” to ${agent?.name}`);
              } else {
                setNote(
                  selection.kind === 'recent'
                    ? `Searched for “${selection.item.query}”`
                    : `Opened ${selection.item.name}`,
                );
              }
              setOpen(false);
            }}
            onSubmit={(submission) => {
              if (submission.mode === 'agents') {
                setNote(
                  `Sent “${submission.query}” to ${
                    data.agents?.find((a) => a.id === submission.agentId)?.name
                  }`,
                );
              } else {
                setResults(submission);
                setNote(null);
              }
              setOpen(false);
            }}
          />
        )}
      </div>
      {!open && (
        <Button emphasis="tertiary" onClick={() => reopen()}>
          Reopen search
        </Button>
      )}
      <p className={styles['patterns__variant-label']}>
        {note ?? 'Switch modes, type, use the arrow keys, Enter and Esc'}
      </p>
    </div>
  );
}

export default SearchModalCanvas;
