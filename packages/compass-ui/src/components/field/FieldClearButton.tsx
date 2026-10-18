import type { IconSize } from '@/components/Icon/Icon';
import Icon from '@/components/Icon/Icon';
import CloseCircleIcon from '@mattermost/compass-icons/components/close-circle';
import type { BuiltInButtonProps } from '@/utils/props';
import { mergeClassNames } from '@/utils/props';
import styles from './FieldClearButton.module.scss';

export type FieldClearButtonSize = 'small' | 'medium' | 'large';

const CLEAR_ICON_SIZE_MAP: Record<FieldClearButtonSize, IconSize> = {
  small: '12',
  medium: '16',
  large: '16',
};

export interface FieldClearButtonProps {
  size?: FieldClearButtonSize;
  clearLabel: string;
  clearButtonProps?: BuiltInButtonProps;
  onClick: () => void;
  /** When set, overrides the default tabIndex (SearchInput uses `-1`). */
  tabIndex?: number;
  className?: string;
}

/**
 * Built-in clear control for text fields. Hosts size the button via `size`;
 * accessible name comes from `clearLabel` (hosts should pass a translated string).
 */
export default function FieldClearButton({
  size = 'medium',
  clearLabel,
  clearButtonProps,
  onClick,
  tabIndex,
  className,
}: FieldClearButtonProps) {
  const iconSize = CLEAR_ICON_SIZE_MAP[size];
  const resolvedTabIndex = tabIndex ?? clearButtonProps?.tabIndex ?? undefined;

  return (
    <button
      {...clearButtonProps}
      type="button"
      className={mergeClassNames(
        styles['field-clear-button'],
        className,
        clearButtonProps?.className,
      )}
      onClick={onClick}
      aria-label={clearLabel}
      tabIndex={resolvedTabIndex}
    >
      <Icon size={iconSize} glyph={<CloseCircleIcon />} />
    </button>
  );
}
