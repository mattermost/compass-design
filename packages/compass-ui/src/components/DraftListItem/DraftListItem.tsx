import PencilOutlineIcon from '@mattermost/compass-icons/components/pencil-outline';
import SendOutlineIcon from '@mattermost/compass-icons/components/send-outline';
import TrashCanOutlineIcon from '@mattermost/compass-icons/components/trash-can-outline';
import ClockOutlineIcon from '@mattermost/compass-icons/components/clock-outline';
import AlertOutlineIcon from '@mattermost/compass-icons/components/alert-outline';
import type {
  HTMLAttributes,
  KeyboardEvent,
  MouseEvent,
  ReactNode,
} from 'react';
import Icon from '@/components/Icon/Icon';
import IconButton from '@/components/IconButton/IconButton';
import Tag from '@/components/Tag/Tag';
import { mergeClassNames, type BuiltInButtonProps } from '@/utils/props';
import { toKebab } from '@/utils/string';
import styles from './DraftListItem.module.scss';

export type DraftListItemStatus = 'draft' | 'scheduled' | 'failed';

export interface DraftListItemProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  'children' | 'onClick'
> {
  /**
   * What the row represents. `draft` is an unsent message, `scheduled` will send at a set time,
   * `failed` is a scheduled message that could not be sent. Default: `draft`.
   */
  status?: DraftListItemStatus;
  /** Where the message is going, e.g. a channel or person name. */
  destination: ReactNode;
  /** Optional leading visual for the destination (channel glyph, avatar). */
  destinationIcon?: ReactNode;
  /** Shown as a tag after the destination when the message is a thread reply. */
  threadLabel?: ReactNode;
  /** Message preview text (clamped to two lines). */
  previewText: ReactNode;
  /**
   * Timing line. For drafts, when it was last edited; for scheduled and failed rows, when it
   * is (or was) due to send.
   */
  timestamp?: ReactNode;
  /** Explanation shown under the preview on `failed` rows. */
  errorMessage?: ReactNode;
  /** Text of the status tag on `scheduled` rows. Default: "Scheduled". */
  scheduledLabel?: ReactNode;
  /** Text of the status tag on `failed` rows. Default: "Failed to send". */
  failedLabel?: ReactNode;
  /** Opens the draft for editing. Sibling of the action buttons for keyboard reachability. */
  onClick?: () => void;
  /** Edit action handler. The Edit button is hidden when omitted. */
  onEdit?: (event: MouseEvent<HTMLButtonElement>) => void;
  /** Delete action handler. The Delete button is hidden when omitted. */
  onDelete?: (event: MouseEvent<HTMLButtonElement>) => void;
  /** Send action handler. The Send button is hidden when omitted. */
  onSend?: (event: MouseEvent<HTMLButtonElement>) => void;
  /** Accessible name for the edit button. Default: "Edit". */
  editLabel?: string;
  /** Accessible name for the delete button. Default: "Delete". */
  deleteLabel?: string;
  /** Accessible name for the send button. Default: "Send now". */
  sendLabel?: string;
  /** Extra attributes for the edit button. */
  editButtonProps?: BuiltInButtonProps;
  /** Extra attributes for the delete button. */
  deleteButtonProps?: BuiltInButtonProps;
  /** Extra attributes for the send button. */
  sendButtonProps?: BuiltInButtonProps;
}

/**
 * A Draft List Item is one entry in the Drafts and Scheduled views. Each row shows where the
 * message is headed, a preview of it, and when it was last edited or will send, with quick
 * actions to edit, send, or delete it.
 */
export default function DraftListItem({
  status = 'draft',
  destination,
  destinationIcon,
  threadLabel,
  previewText,
  timestamp,
  errorMessage,
  scheduledLabel = 'Scheduled',
  failedLabel = 'Failed to send',
  onClick,
  onEdit,
  onDelete,
  onSend,
  editLabel = 'Edit',
  deleteLabel = 'Delete',
  sendLabel = 'Send now',
  editButtonProps,
  deleteButtonProps,
  sendButtonProps,
  className = '',
  ...rest
}: DraftListItemProps) {
  const rootClass = mergeClassNames(
    styles['draft-list-item'],
    styles[`draft-list-item--status-${toKebab(status)}`],
    className,
  );

  const handleMainClick = (event: MouseEvent<HTMLDivElement>) => {
    const selection = window.getSelection();
    if (
      selection?.type === 'Range' &&
      selection.toString().length > 0 &&
      event.currentTarget.contains(
        selection.getRangeAt(0).commonAncestorContainer,
      )
    ) {
      return;
    }
    onClick?.();
  };

  const handleMainKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.target !== event.currentTarget) return;
    if (event.key !== 'Enter' && event.key !== ' ') return;
    event.preventDefault();
    onClick?.();
  };

  const actionButton = (
    label: string,
    glyph: ReactNode,
    handler: (event: MouseEvent<HTMLButtonElement>) => void,
    buttonProps?: BuiltInButtonProps,
  ) => (
    <IconButton
      {...buttonProps}
      aria-label={label}
      icon={<Icon size="16" glyph={glyph} />}
      padding="compact"
      size="small"
      style="default"
      type="button"
      className={buttonProps?.className}
      onClick={(event) => {
        event.stopPropagation();
        handler(event);
      }}
    />
  );

  const hasActions = onEdit != null || onDelete != null || onSend != null;

  return (
    <div {...rest} className={rootClass}>
      <div
        className={styles['draft-list-item__main']}
        role={onClick ? 'button' : undefined}
        tabIndex={onClick ? 0 : undefined}
        onClick={onClick ? handleMainClick : undefined}
        onKeyDown={onClick ? handleMainKeyDown : undefined}
      >
        <div className={styles['draft-list-item__header']}>
          <div className={styles['draft-list-item__destination-group']}>
            {destinationIcon != null && (
              <span
                className={styles['draft-list-item__destination-icon']}
                aria-hidden
              >
                {destinationIcon}
              </span>
            )}
            <span className={styles['draft-list-item__destination']}>
              {destination}
            </span>
            {threadLabel != null && (
              <Tag casing="all-caps" label={threadLabel} />
            )}
            {status === 'scheduled' && (
              <Tag
                type="info-dim"
                label={scheduledLabel}
                leadingIcon={<Icon glyph={<ClockOutlineIcon />} />}
              />
            )}
            {status === 'failed' && (
              <Tag
                type="danger"
                label={failedLabel}
                leadingIcon={<Icon glyph={<AlertOutlineIcon />} />}
              />
            )}
          </div>
          {timestamp != null && (
            <span className={styles['draft-list-item__timestamp']}>
              {timestamp}
            </span>
          )}
        </div>
        <p className={styles['draft-list-item__preview']}>{previewText}</p>
        {status === 'failed' && errorMessage != null && (
          <p className={styles['draft-list-item__error']}>{errorMessage}</p>
        )}
      </div>
      {hasActions && (
        <div className={styles['draft-list-item__actions']}>
          {onEdit &&
            actionButton(
              editLabel,
              <PencilOutlineIcon />,
              onEdit,
              editButtonProps,
            )}
          {onSend &&
            actionButton(
              sendLabel,
              <SendOutlineIcon />,
              onSend,
              sendButtonProps,
            )}
          {onDelete &&
            actionButton(
              deleteLabel,
              <TrashCanOutlineIcon />,
              onDelete,
              deleteButtonProps,
            )}
        </div>
      )}
    </div>
  );
}
