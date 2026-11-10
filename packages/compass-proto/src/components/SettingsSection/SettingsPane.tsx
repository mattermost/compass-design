import { useId } from 'react';
import type { HTMLAttributes, ReactNode } from 'react';
import styles from './SettingsSection.module.scss';

export interface SettingsPaneProps extends Omit<
  HTMLAttributes<HTMLElement>,
  'title'
> {
  /** Pane heading, e.g. "Notifications". */
  title: ReactNode;
  /** `SettingsSection` rows. */
  children: ReactNode;
}

/** Content inset, heading and ruled list for the pane inside `SettingsModal`. */
export default function SettingsPane({
  title,
  children,
  className,
  ...rest
}: SettingsPaneProps) {
  const uid = useId();
  return (
    <section
      {...rest}
      className={[styles['settings-pane'], className].filter(Boolean).join(' ')}
      aria-labelledby={`${uid}-title`}
    >
      <h2 className={styles['settings-pane__title']} id={`${uid}-title`}>
        {title}
      </h2>
      <div className={styles['settings-pane__list']}>{children}</div>
    </section>
  );
}
