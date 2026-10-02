import React, { useEffect, useRef, useState } from 'react';
import UserAvatar from '@/components/UserAvatar/UserAvatar';
import MessageHeader from '@/components/MessageHeader/MessageHeader';
import Icon from '@/components/Icon/Icon';
import IconButton from '@/components/IconButton/IconButton';
import CloseIcon from '@mattermost/compass-icons/components/close';
import styles from './PermalinkPreview.module.scss';

// Keep in sync with max-height in PermalinkPreview.module.scss __body-clip
const TRUNCATION_HEIGHT_PX = 100;

export interface PermalinkPreviewProps {
  /** Sender's display name. Kept as `string`: it's also the avatar's alt text. */
  authorName?: string;
  /** Avatar image src. */
  avatarSrc: string;
  /** Timestamp label. */
  timestamp?: React.ReactNode;
  /** The quoted message body text. Ignored when `children` is provided. */
  messageText?: React.ReactNode;
  /**
   * Rich content to render in the message body instead of the plain `messageText` string.
   * Use this to embed structured content such as attachment cards or formatted fields.
   * When present, `messageText` is not rendered.
   */
  children?: React.ReactNode;
  /** "Originally posted in ~Channel" footer text. */
  originalChannel?: React.ReactNode;
  /**
   * Full footer line. Default: `Originally posted in {originalChannel}`.
   * Pass a translated node to localize the surrounding copy.
   */
  originalChannelLabel?: React.ReactNode;
  /** Called when the dismiss control is clicked. Shown on hover when provided. */
  onDismiss?: () => void;
  /** Accessible name for the dismiss button. Default: "Remove permalink preview". */
  dismissLabel?: string;
  /** Expand toggle text. Default: "Show more". */
  showMoreLabel?: React.ReactNode;
  /** Collapse toggle text. Default: "Show less". */
  showLessLabel?: React.ReactNode;
  /** Optional CSS class name. */
  className?: string;
}

/**
 * A Permalink Preview renders an inline card for a message that another message links to.
 * Sender, timestamp, body, and origin channel — enough context to recognise the quoted
 * message without leaving where you are.
 */
export default function PermalinkPreview({
  authorName = 'Leonard Riley',
  avatarSrc,
  timestamp = '10:43 AM',
  messageText = 'At eu sed tristique gravida et fames vel pellentesque. Urna phasellus integer eu tempor mauris amet sagittis. Mollis risus mi felis magna.',
  children,
  originalChannel = '~Desktop App',
  originalChannelLabel,
  onDismiss,
  dismissLabel = 'Remove permalink preview',
  showMoreLabel = 'Show more',
  showLessLabel = 'Show less',
  className = '',
}: PermalinkPreviewProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [needsTruncation, setNeedsTruncation] = useState(false);
  const [bodyHeight, setBodyHeight] = useState(0);
  const clipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = clipRef.current;
    if (!el) return;
    const measure = () => {
      const full = el.scrollHeight;
      setBodyHeight(full);
      setNeedsTruncation(full > TRUNCATION_HEIGHT_PX);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const rootClass = [styles['permalink-preview'], className]
    .filter(Boolean)
    .join(' ');

  const clipClass = [
    styles['permalink-preview__body-clip'],
    needsTruncation ? styles['permalink-preview__body-clip--truncated'] : '',
    isExpanded ? styles['permalink-preview__body-clip--expanded'] : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={rootClass}>
      {onDismiss != null && (
        <>
          <div
            className={styles['permalink-preview__dismiss-bridge']}
            aria-hidden
          />
          <IconButton
            className={styles['permalink-preview__dismiss']}
            size="x-small"
            padding="compact"
            aria-label={dismissLabel}
            icon={<Icon size="12" glyph={<CloseIcon />} />}
            onClick={onDismiss}
          />
        </>
      )}

      <div className={styles['permalink-preview__card']}>
        <div className={styles['permalink-preview__message']}>
          <div className={styles['permalink-preview__header']}>
            <UserAvatar src={avatarSrc} alt={authorName} size="24" />
            <MessageHeader username={authorName} timestamp={timestamp} />
          </div>
          <div className={styles['permalink-preview__body']}>
            <div
              ref={clipRef}
              className={clipClass}
              style={
                {
                  '--permalink-preview-body-height': `${bodyHeight}px`,
                } as React.CSSProperties
              }
            >
              {children ?? (
                <p className={styles['permalink-preview__text']}>
                  {messageText}
                </p>
              )}
            </div>
            {needsTruncation && (
              <button
                className={styles['permalink-preview__show-more']}
                onClick={(e) => {
                  e.stopPropagation();
                  setIsExpanded((prev) => !prev);
                }}
              >
                {isExpanded ? showLessLabel : showMoreLabel}
              </button>
            )}
          </div>
        </div>
        <p className={styles['permalink-preview__origin']}>
          {originalChannelLabel ?? <>Originally posted in {originalChannel}</>}
        </p>
      </div>
    </div>
  );
}
