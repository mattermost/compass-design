import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { UserAvatar } from '@mattermost/compass-ui/components/user-avatar';
import { MessageHeader } from '@mattermost/compass-ui/components/message-header';
import WithTooltip from '../WithTooltip/WithTooltip';
import {
  MessageActions,
  type MessageActionsType,
} from '@mattermost/compass-ui/components/message-actions';
import { PinnedSavedIndicators } from '@mattermost/compass-ui/components/pinned-saved-indicators';
import styles from './Message.module.scss';

export interface MessageProps extends HTMLAttributes<HTMLDivElement> {
  avatarSrc?: string;
  avatarAlt: string;
  /**
   * Replaces the default 32px `UserAvatar`. Use it to make the avatar
   * interactive, e.g. wrap a `UserAvatar` in a `<button>` that opens a
   * profile popover. When set, `avatarSrc` and `avatarAlt` are ignored.
   */
  avatar?: ReactNode;
  /**
   * Display name in the byline. Pass a node (e.g. a `<button>`) to make the
   * username interactive or to render translated content.
   */
  username: ReactNode;
  timestamp: string;
  /** Emoji in the byline. Tooltip shows the emoji large above the text. */
  customStatus?: { emoji: string; text: string };
  isBot?: boolean;
  botLabel?: string;
  /** Hover toolbar context. Default: Center Channel. */
  messageActionsType?: MessageActionsType;
  /** When false, the hover Message Actions toolbar is omitted. Default: true. */
  showMessageActions?: boolean;
  /** When true, Pinned + Saved row appears at the top of the message container. */
  showPinnedSavedIndicators?: boolean;
  /** Merged onto the root element (e.g. documentation modifiers). */
  className?: string;
  /**
   * Primary body content (e.g. message text). When using structured slots, this
   * is usually the markdown/text block only. For plain `<p>` copy, use the
   * `message__body-text` class from `Message.module.scss` so typography matches
   * the component and host shells (docs, patterns) cannot restyle bare tags.
   */
  children: ReactNode;
  /** Link Preview block — renders after `children`. */
  linkPreview?: ReactNode;
  /** Image Preview block(s) — renders after the link preview slot. */
  imagePreviews?: ReactNode;
  /** Trailing body content — e.g. attachments and reactions — renders last. */
  footer?: ReactNode;
  /**
   * Thread footer — renders a `<ThreadFooter>` when this is a root post with replies.
   * Pass `<ThreadFooter .../>` directly; Message renders it flush (no extra padding).
   */
  threadFooter?: ReactNode;
}

/**
 * Desktop message (avatar, byline, body slots, hover actions). Other attributes
 * (`data-*`, `aria-*`, `id`, event handlers such as `onClick`) and `ref` go to
 * the root element, so hosts can target or anchor to a message without DOM queries.
 */
const Message = forwardRef<HTMLDivElement, MessageProps>(function Message(
  {
    avatarSrc,
    avatarAlt,
    avatar,
    username,
    timestamp,
    customStatus,
    isBot = false,
    botLabel,
    messageActionsType = 'center-channel',
    showMessageActions = true,
    showPinnedSavedIndicators = false,
    className = '',
    children,
    linkPreview,
    imagePreviews,
    footer,
    threadFooter,
    ...rest
  },
  ref,
) {
  const rootClass = [styles.message, className].filter(Boolean).join(' ');

  return (
    <div {...rest} ref={ref} className={rootClass}>
      {showPinnedSavedIndicators && (
        <div className={styles['message__pinned']}>
          <PinnedSavedIndicators />
        </div>
      )}
      <div className={styles['message__layout']}>
        <div className={styles['message__avatar-col']}>
          {avatar ?? <UserAvatar src={avatarSrc} alt={avatarAlt} size="32" />}
        </div>
        <div className={styles['message__content']}>
          <div className={styles['message__header-row']}>
            <div className={styles['message__header-block']}>
              <MessageHeader
                username={
                  customStatus ? (
                    <>
                      {username}
                      <WithTooltip
                        label={customStatus.text}
                        emoji={customStatus.emoji}
                        emojiSize="large"
                      >
                        <button
                          type="button"
                          className={styles['message__status-emoji']}
                        >
                          {customStatus.emoji}
                        </button>
                      </WithTooltip>
                    </>
                  ) : (
                    username
                  )
                }
                timestamp={timestamp}
                isBot={isBot}
                botLabel={botLabel}
              />
            </div>
            {showMessageActions && (
              <div className={styles['message__actions-slot']}>
                <MessageActions type={messageActionsType} />
              </div>
            )}
          </div>
          <div className={styles['message__body']}>
            {children}
            {linkPreview != null && (
              <div className={styles['message__link-preview-slot']}>
                {linkPreview}
              </div>
            )}
            {imagePreviews != null && (
              <div className={styles['message__images-slot']}>
                {imagePreviews}
              </div>
            )}
            {footer != null && (
              <div className={styles['message__footer-slot']}>{footer}</div>
            )}
          </div>
          {threadFooter != null && (
            <div className={styles['message__thread-footer-slot']}>
              {threadFooter}
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

export default Message;
