import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type HTMLAttributes,
  type ReactNode,
} from 'react';
import WithTooltip from '../WithTooltip/WithTooltip';
import { channelBannerTextColor } from './channelBannerColor';
import styles from './ChannelBanner.module.scss';

export interface ChannelBannerProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  'children'
> {
  /**
   * Banner text: one line of inline content (text, emoji, links). It is
   * centered and ends in an ellipsis when it does not fit. Nothing renders
   * when it is empty.
   */
  children?: ReactNode;
  /** Background color, as a hex value such as `#FFF0BA`. */
  backgroundColor?: string;
  /**
   * Text color. Default: black or white, whichever contrasts with
   * `backgroundColor` (see `channelBannerTextColor`).
   */
  textColor?: string;
  /**
   * Plain text shown in a tooltip when the banner text is cut off. Defaults to
   * `children` when that is a string.
   */
  tooltip?: string;
  /**
   * Optional accessible name for the text. Unset by default so screen readers
   * read the banner copy itself; a name replaces that copy, so only pass one
   * when the text isn't self-describing. Pass a translated string.
   */
  textAriaLabel?: string;
  className?: string;
}

/**
 * Channel banner: the strip a channel admin sets across the top of a channel
 * for a notice, a classification or a reminder. Same size, spacing and text
 * rules as the Mattermost webapp: a 24px strip, one centered line, an ellipsis
 * plus a tooltip when the text does not fit, and text that turns black or
 * white to stay readable on any background color.
 */
export default function ChannelBanner({
  children,
  backgroundColor,
  textColor,
  tooltip,
  textAriaLabel,
  className,
  style,
  ...rest
}: ChannelBannerProps) {
  const textRef = useRef<HTMLSpanElement>(null);
  const [overflowing, setOverflowing] = useState(false);
  const empty = children === undefined || children === null || children === '';
  const tooltipText = tooltip ?? (typeof children === 'string' ? children : '');

  // The tooltip only exists while the text is cut off, horizontally or vertically.
  useEffect(() => {
    const el = textRef.current;
    if (!el) return undefined;
    const measure = () =>
      setOverflowing(
        el.offsetWidth < el.scrollWidth || el.offsetHeight < el.scrollHeight,
      );
    measure();
    if (typeof ResizeObserver === 'undefined') return undefined;
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, [children, overflowing, empty]);

  if (empty) return null;

  const color =
    textColor ?? (backgroundColor && channelBannerTextColor(backgroundColor));
  const textStyle = color
    ? ({ color, '--channel-banner-text-color': color } as CSSProperties)
    : undefined;

  const banner = (
    <div
      {...rest}
      className={[styles['channel-banner'], className]
        .filter(Boolean)
        .join(' ')}
      style={{ ...style, backgroundColor }}
    >
      <span
        ref={textRef}
        className={styles['channel-banner__text']}
        style={textStyle}
        aria-label={textAriaLabel}
      >
        {children}
      </span>
    </div>
  );

  return overflowing && tooltipText ? (
    <WithTooltip
      label={tooltipText}
      placement="bottom"
      className={styles['channel-banner__tooltip-host']}
    >
      {banner}
    </WithTooltip>
  ) : (
    banner
  );
}
