import type { ReactNode } from 'react';
import Tag from '@/components/Tag/Tag';
import styles from './MessageHeader.module.scss';

type MessageHeaderProps = {
  username: ReactNode;
  timestamp: ReactNode;
  isBot?: boolean;
  /** Default: "Bot". Accepts translated nodes. */
  botLabel?: ReactNode;
};

/**
 * The Message Header sits above every message body — username, optional bot or guest tag,
 * and timestamp. It's the byline of the conversation, so the rules are tight: same parts,
 * same order, every time.
 */
export default function MessageHeader({
  username,
  timestamp,
  isBot = false,
  botLabel = 'Bot',
}: MessageHeaderProps) {
  return (
    <div className={styles['message-header']}>
      <span className={styles['message-header__username']}>{username}</span>
      {isBot && <Tag label={botLabel} />}
      <span className={styles['message-header__timestamp']}>{timestamp}</span>
    </div>
  );
}
