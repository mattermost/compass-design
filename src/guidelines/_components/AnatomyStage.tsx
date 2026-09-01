import type { CSSProperties, ReactNode } from 'react';
import styles from './AnatomyStage.module.scss';

interface AnatomyStageProps {
  children: ReactNode;
  /** Optional override for inner layout (e.g. flex direction, gap). Padding/radius are fixed. */
  style?: CSSProperties;
  /** Preview surface. Default is the docs wash; `sidebar-header` matches Team Sidebar chrome. */
  surface?: 'default' | 'sidebar-header';
}

export default function AnatomyStage({
  children,
  style,
  surface = 'default',
}: AnatomyStageProps) {
  return (
    <div
      className={[
        styles['stage'],
        surface === 'sidebar-header' ? styles['stage--sidebar-header'] : '',
        'compass-doc-embed',
      ]
        .filter(Boolean)
        .join(' ')}
      style={style}
    >
      {children}
    </div>
  );
}
