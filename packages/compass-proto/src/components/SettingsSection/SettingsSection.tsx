import { useEffect, useRef } from 'react';
import type { HTMLAttributes, ReactNode } from 'react';
import PencilOutlineIcon from '@mattermost/compass-icons/components/pencil-outline';
import { Button } from '@mattermost/compass-ui/components/button';
import { Icon } from '@mattermost/compass-ui/components/icon';
import styles from './SettingsSection.module.scss';

export interface SettingsSectionProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  'title' | 'children'
> {
  /** Row heading. May include adornments such as a `Tag`. */
  title: ReactNode;
  /** Current value summary shown under the title while collapsed. */
  description?: ReactNode;
  /**
   * Editor content shown when expanded. Omit for a static, read-only row
   * (the Edit button still renders unless `hideEdit`, but does nothing).
   */
  children?: ReactNode;
  /** Host-owned: whether the editor is open. */
  expanded?: boolean;
  /** Called by the Edit button and by clicking the collapsed row. */
  onEdit?: () => void;
  onSave?: () => void;
  onCancel?: () => void;
  /** Disables Save (e.g. invalid draft). */
  saveDisabled?: boolean;
  /** Default: "Save". */
  saveLabel?: string;
  /** Default: "Cancel". */
  cancelLabel?: string;
  /** Default: "Edit". */
  editLabel?: string;
  /** Accessible name of the Edit button. Default: `Edit <title>` when title is a string. */
  editAriaLabel?: string;
  /** Hide the Edit button entirely. */
  hideEdit?: boolean;
}

/**
 * One row of a settings pane: summary (title + value, Edit on hover) that expands in
 * place into an editor with Save / Cancel. The host owns `expanded` and the draft state.
 */
export default function SettingsSection({
  title,
  description,
  children,
  expanded = false,
  onEdit,
  onSave,
  onCancel,
  saveDisabled = false,
  saveLabel = 'Save',
  cancelLabel = 'Cancel',
  editLabel = 'Edit',
  editAriaLabel,
  hideEdit = false,
  className,
  ...rest
}: SettingsSectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const editable = children != null;

  // Bring the editor into view when it opens, as the design shows it.
  useEffect(() => {
    if (expanded) ref.current?.scrollIntoView({ block: 'nearest' });
  }, [expanded]);

  const ariaLabel =
    editAriaLabel ?? (typeof title === 'string' ? `Edit ${title}` : undefined);

  const summary = (
    <div className={styles['settings-section__summary']} inert={expanded}>
      <h3 className={styles['settings-section__title']}>{title}</h3>
      {!hideEdit && (
        <Button
          emphasis="quaternary"
          size="small"
          className={styles['settings-section__edit']}
          leadingIcon={<Icon glyph={<PencilOutlineIcon />} size="16" />}
          aria-label={ariaLabel}
          aria-expanded={editable ? expanded : undefined}
          onClick={editable ? onEdit : undefined}
        >
          {editLabel}
        </Button>
      )}
      {description != null && (
        <p className={styles['settings-section__description']}>{description}</p>
      )}
    </div>
  );

  const classes = [
    styles['settings-section'],
    editable && styles['settings-section--editable'],
    expanded && styles['settings-section--expanded'],
    className,
  ]
    .filter(Boolean)
    .join(' ');

  if (!editable) {
    return (
      <div {...rest} ref={ref} className={classes}>
        {summary}
      </div>
    );
  }

  return (
    // Row click is a pointer shortcut; the Edit button is the keyboard path.
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events
    <div
      {...rest}
      ref={ref}
      className={classes}
      onClick={expanded ? undefined : onEdit}
    >
      {/* Both views stay mounted in one grid cell so the swap can animate without
          moving content; the hidden one is inert. */}
      <div className={styles['settings-section__stack']}>
        {summary}
        <div className={styles['settings-section__collapse']} inert={!expanded}>
          <div className={styles['settings-section__collapse-inner']}>
            <div className={styles['settings-section__panel']}>
              <h3
                className={`${styles['settings-section__title']} ${styles['settings-section__title--hidden']}`}
              >
                {title}
              </h3>
              <div className={styles['settings-section__body']}>
                {children}
                <div className={styles['settings-section__actions']}>
                  <Button
                    emphasis="primary"
                    onClick={onSave}
                    disabled={saveDisabled}
                  >
                    {saveLabel}
                  </Button>
                  <Button emphasis="tertiary" onClick={onCancel}>
                    {cancelLabel}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
