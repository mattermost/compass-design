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
  /** Sender's display name. */
  authorName?: string;
  /** Avatar image src. */
  avatarSrc: string;
  /** Timestamp label. */
  timestamp?: string;
  /** The quoted message body text. Ignored when `children` is provided. */
  messageText?: string;
  /**
   * Rich content to render in the message body instead of the plain `messageText` string.
   * Use this to embed structured content such as attachment cards or formatted fields.
   * When present, `messageText` is not rendered.
   */
  children?: React.ReactNode;
  /** "Originally posted in ~Channel" footer text. */
  originalChannel?: string;
  /** Called when the dismiss control is clicked. Shown on hover when provided. */
  onDismiss?: () => void;
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
  onDismiss,
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
            aria-label="Remove permalink preview"
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
                {isExpanded ? 'Show less' : 'Show more'}
              </button>
            )}
          </div>
        </div>
        <p className={styles['permalink-preview__origin']}>
          Originally posted in {originalChannel}
        </p>
      </div>
    </div>
  );
}
