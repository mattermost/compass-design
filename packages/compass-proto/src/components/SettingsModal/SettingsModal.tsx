import type { ReactNode } from 'react';
import {
  Modal,
  ModalOverlay,
  type ModalSize,
} from '@mattermost/compass-ui/components/modal';
import { Scrollbar } from '@mattermost/compass-ui/components/scrollbar';
import SettingsSidebar from '../SettingsSidebar/SettingsSidebar';
import styles from './SettingsModal.module.scss';

export interface SettingsModalProps {
  /** Host-owned open state; drives the enter/exit transition. */
  open: boolean;
  onClose: () => void;
  /** Called after the exit transition finishes. */
  onExited?: () => void;
  /**
   * Element the scrim is staged in. Pass the prototype shell so the scrim stays
   * inside it; the overlay is then positioned absolutely and page scroll is not locked.
   * Omit to portal to the page.
   */
  container?: HTMLElement | null;
  /** Dialog title (also its accessible name). Default: "Settings". */
  title?: string;
  /** Dialog width. Default: large. */
  size?: ModalSize;
  /** Navigation column. Default: a stock `SettingsSidebar`. */
  sidebar?: ReactNode;
  /** Settings pane content, e.g. a `SettingsPane`. Scrolls independently of the sidebar. */
  children: ReactNode;
  className?: string;
}

/**
 * Mattermost "Settings" dialog shell: a Compass `Modal` with a fixed sidebar and
 * one independently scrolling pane. Host owns open state and which tab is active.
 */
export default function SettingsModal({
  open,
  onClose,
  onExited,
  container,
  title = 'Settings',
  size = 'large',
  sidebar,
  children,
  className,
}: SettingsModalProps) {
  const stageInContainer = container != null;
  return (
    <ModalOverlay
      open={open}
      onClose={onClose}
      container={container}
      lockScroll={!stageInContainer}
      style={stageInContainer ? { position: 'absolute' } : undefined}
    >
      <Modal
        open={open}
        title={title}
        size={size}
        className={[styles['settings-modal'], className]
          .filter(Boolean)
          .join(' ')}
        bodyPadding="none"
        scrollable={false}
        onClose={onClose}
        onExited={onExited}
      >
        <div className={styles['settings-modal__layout']}>
          {sidebar ?? <SettingsSidebar />}
          <Scrollbar className={styles['settings-modal__pane']}>
            {children}
          </Scrollbar>
        </div>
      </Modal>
    </ModalOverlay>
  );
}
