import styles from './Divider.module.scss';

/**
 * A Divider is a thin horizontal rule that separates content into related groups. It does
 * the lightest possible work — split a list, mark a transition, give a layout breathing room
 * — without competing for attention.
 */
export default function Divider() {
  return (
    <div className={styles.divider}>
      <hr className={styles['divider__line']} />
    </div>
  );
}
