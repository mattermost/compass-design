import React, { type ReactNode, createContext, useContext } from 'react';
import EmoticonHappyOutlineIcon from '@mattermost/compass-icons/components/emoticon-happy-outline';
import styles from './Icon.module.scss';

export type IconSize =
  | '10'
  | '12'
  | '16'
  | '20'
  | '24'
  | '28'
  | '32'
  | '40'
  | '52'
  | '64'
  | '104';

/**
 * Maps container size → SVG render size. Icons bleed slightly past the container
 * to strip the built-in clear-space padding from compass-icons SVGs.
 * Pass SVG_SIZE_MAP[size] as the `size` prop on any compass-icons component
 * used as a glyph (e.g. <GlobeIcon size={SVG_SIZE_MAP['24']} />).
 */
export const SVG_SIZE_MAP: Record<IconSize, number> = {
  '10': 12,
  '12': 14,
  '16': 18,
  '20': 24,
  '24': 28,
  '28': 32,
  '32': 36,
  '40': 48,
  '52': 60,
  '64': 72,
  '104': 120,
};

/**
 * Context published by components that host an icon slot (Button, IconButton,
 * MenuItem, etc.). Icon reads this as a fallback when no `size` prop is passed,
 * so consumers can pass `<Icon glyph={<X />} />` without specifying a size.
 */
export const IconSlotContext = createContext<{ size: IconSize } | null>(null);
export const useIconSlotContext = () => useContext(IconSlotContext);

export interface IconProps {
  /** Optional CSS class name applied to the container. */
  className?: string;
  /**
   * Icon SVG from @mattermost/compass-icons (e.g. `<GlobeIcon />`).
   * Icon automatically injects the correct SVG size — no need to pass a size
   * prop on the glyph element. When omitted, shows emoticon-happy-outline.
   */
  glyph?: ReactNode | null;
  /** Container size from the Mattermost icon scale. Default 24. */
  size?: IconSize;
}

const SIZE_CLASS_MAP: Record<IconSize, string> = {
  '10': styles['icon--size-10'],
  '12': styles['icon--size-12'],
  '16': styles['icon--size-16'],
  '20': styles['icon--size-20'],
  '24': styles['icon--size-24'],
  '28': styles['icon--size-28'],
  '32': styles['icon--size-32'],
  '40': styles['icon--size-40'],
  '52': styles['icon--size-52'],
  '64': styles['icon--size-64'],
  '104': styles['icon--size-104'],
};

/**
 * Icon is the standard wrapper for any glyph from `@mattermost/compass-icons`. It enforces a
 * consistent container size, strips the package's built-in clear-space padding, and keeps
 * icons aligned with text and other icons across the system.
 */
export default function Icon({
  className = '',
  glyph = null,
  size,
}: IconProps) {
  const contextSize = useIconSlotContext()?.size;
  const resolvedSize: IconSize = size ?? contextSize ?? '24';
  const sizeClass = SIZE_CLASS_MAP[resolvedSize];
  const rootClass = [styles.icon, sizeClass, className]
    .filter(Boolean)
    .join(' ');

  const svgSize = SVG_SIZE_MAP[resolvedSize];
  const glyphContent = (() => {
    if (glyph === undefined || glyph === null) {
      return <EmoticonHappyOutlineIcon size={svgSize} aria-hidden />;
    }
    // Inject the correct SVG size into the glyph so callers don't need to
    // know about SVG_SIZE_MAP — the container size is all that's needed.
    if (React.isValidElement(glyph)) {
      return React.cloneElement(
        glyph as React.ReactElement<{ size?: number }>,
        {
          size: svgSize,
        },
      );
    }
    return glyph;
  })();

  return (
    <div className={rootClass} aria-hidden>
      <div className={styles['icon__glyph-area']}>{glyphContent}</div>
    </div>
  );
}
