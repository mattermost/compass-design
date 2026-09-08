import type { ReactNode } from 'react';
import CloseIcon from '@mattermost/compass-icons/components/close';
import ArrowLeftIcon from '@mattermost/compass-icons/components/arrow-left';
import Icon from '@/components/Icon/Icon';
import IconButton from '@/components/IconButton/IconButton';
import styles from './ModalHeader.module.scss';

export type ModalSubtitlePlacement = 'below' | 'beside';

export interface ModalHeaderProps {
  className?: string;
  /** Heading text. Omit (with `hideTitle`) for close-only headers. */
  title?: ReactNode;
  /** Optional secondary text — placement controlled by `subtitlePlacement`. */
  subtitle?: ReactNode;
  /**
   * Where the subtitle sits relative to the title.
   * Figma: Subtitle = Below | Beside. Default: `below`.
   */
  subtitlePlacement?: ModalSubtitlePlacement;
  /** When true, title is visually hidden (close-only chrome; keep `title`/`titleId` for a11y). */
  hideTitle?: boolean;
  /** id for the title element — pair with dialog `aria-labelledby`. */
  titleId?: string;
  /** Back arrow before the title. */
  showBackButton?: boolean;
  onBack?: () => void;
  /** Called when the × is clicked. */
  onClose?: () => void;
  /** Show bottom border. Figma: Divider = On. Default: true. */
  divider?: boolean;
  /**
   * Optional control before close (Figma Controls = Button / Small Input / …).
   * Host owns the Button, TextInput, etc.
   */
  headerAction?: ReactNode;
}

/**
 * Modal Header — title row, optional subtitle (below or beside), optional back,
 * optional header action, and close. Compose into `Modal` or use standalone.
 *
 * @see https://www.figma.com/design/qdm5tKododENqnTvjLovDT/Patterns---Modals?node-id=789-15921
 */
export default function ModalHeader({
  className = '',
  title,
  subtitle,
  subtitlePlacement = 'below',
  hideTitle = false,
  titleId,
  showBackButton = false,
  onBack,
  onClose,
  divider = true,
  headerAction,
}: ModalHeaderProps) {
  const showTitleBlock = !hideTitle && title != null;
  const showSubtitle = showTitleBlock && subtitle != null;
  const beside = subtitlePlacement === 'beside' && showSubtitle;

  return (
    <div
      className={[
        styles['modal-header'],
        !divider && styles['modal-header--no-divider'],
        hideTitle && styles['modal-header--close-only'],
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <div className={styles['modal-header__content']}>
        {showTitleBlock ? (
          <div className={styles['modal-header__titles']}>
            <div className={styles['modal-header__primary']}>
              {showBackButton && (
                <IconButton
                  aria-label="Go back"
                  icon={<Icon glyph={<ArrowLeftIcon />} size="20" />}
                  onClick={onBack}
                />
              )}
              <h2 id={titleId} className={styles['modal-header__title']}>
                {title}
              </h2>
              {beside && (
                <div className={styles['modal-header__subtitle-beside']}>
                  <span
                    className={styles['modal-header__subtitle-divider']}
                    aria-hidden
                  />
                  <p className={styles['modal-header__subtitle']}>{subtitle}</p>
                </div>
              )}
            </div>
            {showSubtitle && !beside && (
              <p className={styles['modal-header__subtitle']}>{subtitle}</p>
            )}
          </div>
        ) : titleId != null && title != null ? (
          <h2 id={titleId} className={styles['modal-header__title-sr']}>
            {title}
          </h2>
        ) : null}

        <div className={styles['modal-header__actions']}>
          {headerAction}
          <IconButton
            aria-label="Close"
            className={styles['modal-header__close']}
            icon={<Icon glyph={<CloseIcon />} size="20" />}
            onClick={onClose}
          />
        </div>
      </div>
    </div>
  );
}
