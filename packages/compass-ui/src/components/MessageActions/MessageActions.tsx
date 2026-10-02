import type { HTMLAttributes, ReactNode } from 'react';
import Emoji from '@/components/Emoji/Emoji';
import IconButton from '@/components/IconButton/IconButton';
import Icon from '@/components/Icon/Icon';
import EmoticonPlusOutlineIcon from '@mattermost/compass-icons/components/emoticon-plus-outline';
import DotsHorizontalIcon from '@mattermost/compass-icons/components/dots-horizontal';
import BookmarkOutlineIcon from '@mattermost/compass-icons/components/bookmark-outline';
import CreationOutlineIcon from '@mattermost/compass-icons/components/creation-outline';
import AppsIcon from '@mattermost/compass-icons/components/apps';
import ReplyOutlineIcon from '@mattermost/compass-icons/components/reply-outline';
import styles from './MessageActions.module.scss';

export type MessageActionsType = 'center-channel' | 'rhs' | 'search-results';

export interface MessageActionsProps extends HTMLAttributes<HTMLDivElement> {
  /** Context variant. Default: Center Channel. */
  type?: MessageActionsType;
  /** Whether the hover toolbar is visible. Default: true. */
  visible?: boolean;
  /** Whether collapsed reply threads feature is on. Default: true. */
  collapsedReplyThreads?: boolean;
  /** Whether quick reactions are shown. Default: true. */
  quickReactions?: boolean;
  /** Optional CSS class name. */
  className?: string;
  /** Accessible name for the toolbar. Default: "Message actions". An explicit `aria-label` still wins. */
  toolbarLabel?: string;
  /** Default: "React with thumbs up". */
  reactThumbsUpLabel?: string;
  /** Default: "React with raised hands". */
  reactRaisedHandsLabel?: string;
  /** Default: "React with OK hand". */
  reactOkHandLabel?: string;
  /** Default: "Add reaction". */
  addReactionLabel?: string;
  /** Default: "More actions". */
  moreActionsLabel?: string;
  /** Default: "Save message". */
  saveLabel?: string;
  /** Default: "AI actions". */
  aiActionsLabel?: string;
  /** Default: "Plugin actions". */
  pluginActionsLabel?: string;
  /** Default: "Reply in thread". */
  replyLabel?: string;
  /** Visible Jump button text (search results). Default: "Jump". */
  jumpLabel?: ReactNode;
  /** Accessible name for the Jump button. Default: "Jump to message". */
  jumpAriaLabel?: string;
}

/**
 * Message Actions is the floating toolbar that appears on a message when you hover, tab, or
 * long-press it. It bundles the most common per-message actions — react, save, reply, more —
 * into a small, context-aware row that hovers above the post.
 */
export default function MessageActions({
  type = 'center-channel',
  visible = true,
  collapsedReplyThreads = true,
  quickReactions = true,
  className = '',
  toolbarLabel = 'Message actions',
  reactThumbsUpLabel = 'React with thumbs up',
  reactRaisedHandsLabel = 'React with raised hands',
  reactOkHandLabel = 'React with OK hand',
  addReactionLabel = 'Add reaction',
  moreActionsLabel = 'More actions',
  saveLabel = 'Save message',
  aiActionsLabel = 'AI actions',
  pluginActionsLabel = 'Plugin actions',
  replyLabel = 'Reply in thread',
  jumpLabel = 'Jump',
  jumpAriaLabel = 'Jump to message',
  ...rest
}: MessageActionsProps) {
  if (!visible) return null;

  const isCenterChannel = type === 'center-channel';
  const isRHS = type === 'rhs';
  const isSearchResults = type === 'search-results';
  const showQuickReactions = quickReactions && collapsedReplyThreads;

  const rootClass = [styles['message-actions'], className]
    .filter(Boolean)
    .join(' ');

  return (
    <div
      className={rootClass}
      role="toolbar"
      aria-label={toolbarLabel}
      {...rest}
    >
      {/* Quick reaction emojis — center channel + RHS */}
      {showQuickReactions && !isSearchResults && (
        <>
          <IconButton
            aria-label={reactThumbsUpLabel}
            size="small"
            padding="compact"
            icon={<Emoji emoji="👍" size="16" />}
          />
          {isCenterChannel && (
            <>
              <IconButton
                aria-label={reactRaisedHandsLabel}
                size="small"
                padding="compact"
                icon={<Emoji emoji="🙌" size="16" />}
              />
              <IconButton
                aria-label={reactOkHandLabel}
                size="small"
                padding="compact"
                icon={<Emoji emoji="👌" size="16" />}
              />
            </>
          )}
          <IconButton
            aria-label={addReactionLabel}
            size="small"
            padding="compact"
            icon={<Icon size="16" glyph={<EmoticonPlusOutlineIcon />} />}
          />
        </>
      )}

      {/* Search results only: more button first */}
      {isSearchResults && (
        <IconButton
          aria-label={moreActionsLabel}
          size="small"
          padding="compact"
          icon={<Icon size="16" glyph={<DotsHorizontalIcon />} />}
        />
      )}

      {/* Center channel actions */}
      {isCenterChannel && (
        <>
          <IconButton
            aria-label={saveLabel}
            size="small"
            padding="compact"
            icon={<Icon size="16" glyph={<BookmarkOutlineIcon />} />}
          />
          <IconButton
            aria-label={aiActionsLabel}
            size="small"
            padding="compact"
            icon={<Icon size="16" glyph={<CreationOutlineIcon />} />}
          />
          <IconButton
            aria-label={pluginActionsLabel}
            size="small"
            padding="compact"
            icon={<Icon size="16" glyph={<AppsIcon />} />}
          />
          <IconButton
            aria-label={replyLabel}
            size="small"
            padding="compact"
            icon={<Icon size="16" glyph={<ReplyOutlineIcon />} />}
          />
          <IconButton
            aria-label={moreActionsLabel}
            size="small"
            padding="compact"
            icon={<Icon size="16" glyph={<DotsHorizontalIcon />} />}
          />
        </>
      )}

      {/* RHS actions */}
      {isRHS && (
        <IconButton
          aria-label={moreActionsLabel}
          size="small"
          padding="compact"
          icon={<Icon size="16" glyph={<DotsHorizontalIcon />} />}
        />
      )}

      {/* Search results additional buttons */}
      {isSearchResults && (
        <>
          <IconButton
            aria-label={saveLabel}
            size="small"
            padding="compact"
            icon={<Icon size="16" glyph={<BookmarkOutlineIcon />} />}
          />
          <IconButton
            aria-label={replyLabel}
            size="small"
            padding="compact"
            icon={<Icon size="16" glyph={<ReplyOutlineIcon />} />}
          />
          <button
            type="button"
            className={styles['message-actions__jump']}
            aria-label={jumpAriaLabel}
          >
            {jumpLabel}
          </button>
        </>
      )}
    </div>
  );
}
