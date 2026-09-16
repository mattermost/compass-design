import { useState } from 'react';
import { ReactionButton } from '@mattermost/compass-ui/components/reaction-button';
import styles from '@/styles/library-demo/components.module.scss';

function InteractiveReactionButton() {
  const [reacted, setReacted] = useState(false);
  const [count, setCount] = useState(3);

  const handleClick = () => {
    const next = !reacted;
    setReacted(next);
    setCount((c) => (next ? c + 1 : c - 1));
  };

  return (
    <ReactionButton
      emoji="👍"
      count={count}
      byCurrentUser={reacted}
      onClick={handleClick}
    />
  );
}

export default function ReactionButtonLibrary() {
  return (
    <>
      <div className={styles['components__button-block']}>
        <div className={styles['components__button-row']}>
          <span className={styles['components__instance-label']}>
            Interactive — click to toggle
          </span>
          <InteractiveReactionButton />
        </div>
        <div className={styles['components__button-row']}>
          <span className={styles['components__instance-label']}>Default</span>
          <ReactionButton emoji="👍" count={3} />
        </div>
        <div className={styles['components__button-row']}>
          <span className={styles['components__instance-label']}>Mine</span>
          <ReactionButton emoji="🎉" count={1} byCurrentUser />
        </div>
        <div className={styles['components__button-row']}>
          <span className={styles['components__instance-label']}>
            Mine — high count
          </span>
          <ReactionButton emoji="😀" count={24} byCurrentUser />
        </div>
        <div className={styles['components__button-row']}>
          <span className={styles['components__instance-label']}>
            Count of 1 (singular label)
          </span>
          <ReactionButton emoji="🙌" count={1} />
        </div>
      </div>
    </>
  );
}
