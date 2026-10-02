import type { ReactNode } from 'react';
import IconButton from '@/components/IconButton/IconButton';
import Icon from '@/components/Icon/Icon';
import { ShortcutTagGroup } from '@/components/ShortcutTag/ShortcutTag';
import CloseIcon from '@mattermost/compass-icons/components/close';
import styles from './SearchTipBanner.module.scss';

export interface ShortcutKey {
  /** Key label (e.g. `⌘`, `Shift`). Kept as `string`: it doubles as the React key. */
  label: string;
}

export interface SearchTipBannerProps {
  /** Text shown before the shortcut keys. Default: "Tip: Try". Accepts translated nodes. */
  prefix?: ReactNode;
  /** Text shown after the shortcut keys. Default: "to search this channel". Accepts translated nodes. */
  suffix?: ReactNode;
  /** Keyboard shortcut keys to display. */
  shortcutKeys?: ShortcutKey[];
  /** Called when the dismiss button is clicked. */
  onDismiss?: () => void;
  /** Accessible name for the dismiss button. Default: "Dismiss tip". */
  dismissLabel?: string;
  /** Optional CSS class name. */
  className?: string;
  /** Custom content to replace the default tip content. */
  children?: ReactNode;
}

/**
 * The Search Tip Banner nudges people toward the keyboard shortcut for in-channel search. It
 * appears once a user has scrolled up far enough that they're clearly looking for something,
 * and offers a faster path than scroll-and-skim.
 */
export default function SearchTipBanner({
  prefix = 'Tip: Try',
  suffix = 'to search this channel',
  shortcutKeys = [{ label: '⌘' }, { label: 'Shift' }, { label: 'F' }],
  onDismiss,
  dismissLabel = 'Dismiss tip',
  className = '',
  children,
}: SearchTipBannerProps) {
  return (
    <div
      className={[styles['search-tip-banner'], className]
        .filter(Boolean)
        .join(' ')}
    >
      <div className={styles['search-tip-banner__content']}>
        {children ?? (
          <>
            <span className={styles['search-tip-banner__text']}>{prefix}</span>
            <ShortcutTagGroup
              labels={shortcutKeys.map((key) => key.label)}
              size="medium"
            />
            <span className={styles['search-tip-banner__text']}>{suffix}</span>
          </>
        )}
      </div>
      {onDismiss != null && (
        <IconButton
          aria-label={dismissLabel}
          size="small"
          icon={<Icon size="16" glyph={<CloseIcon />} />}
          onClick={onDismiss}
        />
      )}
    </div>
  );
}
