import { useRef, useState, type ReactNode } from 'react';
import ChevronDownIcon from '@mattermost/compass-icons/components/chevron-down';
import KeyboardReturnIcon from '@mattermost/compass-icons/components/keyboard-return';
import LightbulbOutlineIcon from '@mattermost/compass-icons/components/lightbulb-outline';
import { Button } from '@mattermost/compass-ui/components/button';
import { Icon } from '@mattermost/compass-ui/components/icon';
import { MenuItem } from '@mattermost/compass-ui/components/menu-item';
import { UserAvatar } from '@mattermost/compass-ui/components/user-avatar';
import SearchPortalMenu from './SearchPortalMenu';
import type { SearchAgent, SearchModalLabels } from './searchTypes';
import styles from './SearchModal.module.scss';

export type SearchTipConfig =
  | { kind: 'note'; text: ReactNode }
  | { kind: 'browse-channels'; onBrowse?: () => void }
  | {
      kind: 'modifiers';
      modifiers: readonly string[];
      onModifierClick: (modifier: string) => void;
    }
  | { kind: 'enter-search' }
  | { kind: 'people'; onBrowse?: () => void; onGroupMessage?: () => void }
  | {
      kind: 'agents';
      agents: readonly SearchAgent[];
      selectedId?: string;
      onSelect: (id: string) => void;
    };

function TipIcon() {
  return (
    <Icon
      className={styles['search-modal__tip-icon']}
      glyph={<LightbulbOutlineIcon />}
      size="16"
    />
  );
}

/** The dialog footer: a tip that changes with the mode and the field. */
export default function SearchTip({
  tip,
  tips = {},
}: {
  tip: SearchTipConfig;
  tips?: NonNullable<SearchModalLabels['tips']>;
}) {
  const pickerRef = useRef<HTMLButtonElement>(null);
  const [pickerOpen, setPickerOpen] = useState(false);

  switch (tip.kind) {
    case 'note':
      return (
        <div className={styles['search-modal__tip']}>
          <TipIcon />
          <p className={styles['search-modal__tip-text']}>{tip.text}</p>
        </div>
      );
    case 'browse-channels':
      return (
        <div className={styles['search-modal__tip']}>
          <TipIcon />
          <p className={styles['search-modal__tip-text']}>
            {tips.browseChannels ?? 'Looking for more channels?'}{' '}
            <Button
              emphasis="link"
              size="small"
              type="button"
              onClick={tip.onBrowse}
            >
              {tips.browseChannelsAction ?? 'Browse channels'}
            </Button>
          </p>
        </div>
      );
    case 'modifiers':
      return (
        <div className={styles['search-modal__tip']}>
          <TipIcon />
          <p className={styles['search-modal__tip-text']}>
            {tips.modifiers ?? 'Tip: Try'}
          </p>
          <div className={styles['search-modal__modifiers']}>
            {tip.modifiers.map((modifier) => (
              <Button
                key={modifier}
                compact
                emphasis="dim"
                size="x-small"
                type="button"
                onClick={() => tip.onModifierClick(modifier)}
              >
                {modifier}
              </Button>
            ))}
          </div>
        </div>
      );
    case 'enter-search':
      return (
        <div className={styles['search-modal__tip']}>
          <span className={styles['search-modal__enter-key']} aria-hidden>
            <Icon glyph={<KeyboardReturnIcon />} size="12" />
          </span>
          <p className={styles['search-modal__tip-text']}>
            {tips.enterToSearch ?? 'Enter to search'}
          </p>
        </div>
      );
    case 'people':
      return (
        <div className={styles['search-modal__tip']}>
          <TipIcon />
          <p className={styles['search-modal__tip-text']}>
            {tips.peopleShortcutPrefix ?? 'Use ⌘-Shift-K to'}{' '}
            <Button
              emphasis="link"
              size="small"
              type="button"
              onClick={tip.onBrowse}
            >
              {tips.browseTeammates ?? 'browse for teammates'}
            </Button>{' '}
            {tips.peopleOr ?? 'or'}{' '}
            <Button
              emphasis="link"
              size="small"
              type="button"
              onClick={tip.onGroupMessage}
            >
              {tips.startGroupMessage ?? 'start a group message'}
            </Button>
          </p>
        </div>
      );
    case 'agents': {
      const selected =
        tip.agents.find((a) => a.id === tip.selectedId) ?? tip.agents[0];
      return (
        <div
          className={[
            styles['search-modal__tip'],
            styles['search-modal__tip--spread'],
          ].join(' ')}
        >
          <div className={styles['search-modal__tip-hint']}>
            <TipIcon />
            <p className={styles['search-modal__tip-text']}>
              {tips.agentsNote ??
                'Agents searches only content you have access to'}
            </p>
          </div>
          {selected && (
            <div className={styles['search-modal__search-with']}>
              <span className={styles['search-modal__search-with-label']}>
                {tips.searchWith ?? 'Search with'}
              </span>
              <button
                ref={pickerRef}
                type="button"
                className={styles['search-modal__agent']}
                aria-expanded={pickerOpen}
                aria-haspopup="menu"
                onClick={() => setPickerOpen((o) => !o)}
              >
                <span className={styles['search-modal__agent-name']}>
                  {selected.name}
                </span>
                <Icon glyph={<ChevronDownIcon />} size="16" />
              </button>
              <SearchPortalMenu
                open={pickerOpen}
                anchorRef={pickerRef}
                align="end"
                above
                label={tips.chooseAgent ?? 'Choose an Agent'}
                onClose={() => setPickerOpen(false)}
              >
                {tip.agents.map((agent) => (
                  <MenuItem
                    key={agent.id}
                    role="menuitemradio"
                    aria-checked={agent.id === selected.id}
                    label={agent.name}
                    leadingVisual={
                      <UserAvatar src={agent.avatarSrc} alt="" size="24" />
                    }
                    trailingElement={agent.id === selected.id}
                    onClick={() => {
                      tip.onSelect(agent.id);
                      setPickerOpen(false);
                      pickerRef.current?.focus();
                    }}
                  />
                ))}
              </SearchPortalMenu>
            </div>
          )}
        </div>
      );
    }
  }
}
