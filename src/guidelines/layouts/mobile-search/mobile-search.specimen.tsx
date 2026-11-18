import { useState } from 'react';
import { Scrollbar } from '@mattermost/compass-ui/components/scrollbar';
import {
  MobileMessage,
  MobileSearch,
  type MobileTabBarTab,
  MobileSearchSuggestions,
  MobileTabBar,
  mobileMessageStyles,
} from '@mattermost/compass-proto';
import DeviceFrame from '@/components/layout/DeviceFrame';
import {
  mobileRecentSearches,
  mobileSearchResults,
} from '@/fixtures/mobileSearchFixtures';
import { personaHeaderProps } from '@/fixtures/workspacePersona';
import styles from './mobile-search.specimen.module.scss';

const bodyTextClass = mobileMessageStyles['mobile-message__body-text'];

/**
 * The Search tab. Idle, it lists the modifiers and recent searches built from
 * the sample workspace; type a word from its messages to see real results.
 */
export default function MobileSearchLibrary() {
  const [query, setQuery] = useState('');
  const [activeTab, setActiveTab] = useState<MobileTabBarTab>('search');
  const results = mobileSearchResults(query);

  return (
    <div className={styles['mobile-search-layout']}>
      <DeviceFrame insetContent={false} statusBarStyle="light">
        <div className={styles['mobile-search-layout__shell']}>
          <MobileSearch value={query} onChange={setQuery}>
            <Scrollbar>
              {query.trim() && results.length === 0 ? (
                <p className={bodyTextClass}>
                  No results for “{query.trim()}”.
                </p>
              ) : query.trim() ? (
                results.map((hit) => (
                  <MobileMessage
                    key={hit.id}
                    avatarSrc={hit.avatarSrc}
                    avatarAlt={hit.avatarAlt}
                    username={hit.username}
                    timestamp={hit.timestamp}
                    channelName={hit.channelLabel}
                  >
                    <p className={bodyTextClass}>{hit.body}</p>
                  </MobileMessage>
                ))
              ) : (
                <MobileSearchSuggestions recent={mobileRecentSearches} />
              )}
            </Scrollbar>
          </MobileSearch>
          <MobileTabBar
            activeTab={activeTab}
            onTabChange={setActiveTab}
            profileSrc={personaHeaderProps.userAvatarSrc}
            profileAlt={personaHeaderProps.userAvatarAlt}
          />
        </div>
      </DeviceFrame>
    </div>
  );
}
