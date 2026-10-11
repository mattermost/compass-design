import {
  forwardRef,
  type ButtonHTMLAttributes,
  type HTMLAttributes,
  type ReactElement,
  type ReactNode,
  type Ref,
  type RefAttributes,
} from 'react';
import { IconSlotContext } from '@/components/Icon/Icon';
import Spinner from '@/components/Spinner/Spinner';
import { renderAsChild } from '@/utils/slot';
import { toKebab } from '@/utils/string';
import styles from './IconButton.module.scss';

export type IconButtonSize = 'x-small' | 'small' | 'medium' | 'large';

/** Figma "Style": Default (light context) | Inverted (dark context). */
export type IconButtonStyle = 'default' | 'inverted';

export type IconButtonPadding = 'default' | 'compact';

interface IconButtonOwnProps {
  /** When true, forces the subtler pressed/active visual (lighter than toggled). */
  active?: boolean;
  /** Optional CSS class name. */
  className?: string;
  /** Numeric count shown inline after the icon. Figma: Count. */
  count?: number;
  /** When true, uses destructive (danger) styling. Figma: Destructive. */
  destructive?: boolean;
  /** Icon to show. Pass `<Icon glyph={<YourIcon />} />` — IconButton provides the correct size via context; no `size` prop needed on the Icon. */
  icon: ReactNode;
  /** When true, shows a Spinner in place of the icon and disables the button (or blocks navigation when `asChild`). */
  loading?: boolean;
  /** Padding variant. Figma: Padding = Default | Compact. */
  padding?: IconButtonPadding;
  /** When true, uses full border radius (pill). Figma: Rounded = On. */
  rounded?: boolean;
  /** Size variant. Figma: Size. Default: Medium. */
  size?: IconButtonSize;
  /** Default | Inverted. Figma: Style (for light vs dark backgrounds). Replaces the HTML `style` attribute. */
  style?: IconButtonStyle;
  /** When true, shows a small unread dot over the icon. Figma: Unread Badge. */
  unreadBadge?: boolean;
  /**
   * When true, disables the control. On a native `<button>`, sets the `disabled`
   * attribute. With `asChild`, sets `aria-disabled`, applies disabled styles, and
   * blocks click / middle-click navigation (the link stays focusable).
   */
  disabled?: boolean;
}

export interface IconButtonProps
  extends
    IconButtonOwnProps,
    Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'style'> {
  /**
   * When true, merges IconButton props onto the single child element instead of
   * rendering a `<button>`. Use with `<a>` or a router `Link`. Default: false.
   */
  asChild?: false;
  /**
   * When true, shows toggled/selected state. Figma: Toggled = On. When omitted,
   * the control is not a toggle. Only applies to the native `<button>` (maps to
   * `aria-pressed`); not available with `asChild`.
   */
  toggled?: boolean;
}

export interface IconButtonAsChildProps
  extends
    IconButtonOwnProps,
    Omit<HTMLAttributes<HTMLElement>, 'children' | 'color' | 'style'> {
  /**
   * Merges IconButton props onto the single child element instead of rendering a
   * `<button>`. The child's own props (`href`, `to`, `target`, …) stay on the
   * child. Do not pass `type` or `toggled` — they are not available on links.
   * Pass an empty child; IconButton supplies the icon anatomy.
   */
  asChild: true;
  /** Single empty element to render as the IconButton (e.g. `<a href="…" />`). */
  children: ReactElement;
  /**
   * Accessible name for the icon-only link. Required with `asChild`. An
   * `aria-label` on the child also satisfies this (child props win).
   */
  'aria-label': string;
}

/**
 * @deprecated No longer needed — IconButton sets the icon size via context.
 * Pass `<Icon glyph={<YourIcon />} />` without a size prop.
 */
export const ICON_BUTTON_ICON_SIZES: Record<
  IconButtonSize,
  '12' | '16' | '20' | '24'
> = {
  'x-small': '12',
  small: '16',
  medium: '20',
  large: '24',
};

type IconButtonComponent = {
  (
    props: IconButtonAsChildProps & RefAttributes<HTMLElement>,
  ): ReactElement | null;
  (
    props: IconButtonProps & RefAttributes<HTMLButtonElement>,
  ): ReactElement | null;
  displayName?: string;
};

function buildRootClass({
  className = '',
  count,
  destructive = false,
  padding = 'default',
  rounded = false,
  size = 'medium',
  style = 'default',
  active = false,
  toggled,
}: {
  className?: string;
  count?: number;
  destructive?: boolean;
  padding?: IconButtonPadding;
  rounded?: boolean;
  size?: IconButtonSize;
  style?: IconButtonStyle;
  active?: boolean;
  toggled?: boolean;
}): string {
  return [
    styles['icon-button'],
    styles[`icon-button--size-${toKebab(size)}`],
    padding === 'compact' ? styles['icon-button--padding-compact'] : '',
    style === 'inverted' ? styles['icon-button--style-inverted'] : '',
    destructive ? styles['icon-button--destructive'] : '',
    rounded ? styles['icon-button--rounded'] : '',
    toggled ? styles['icon-button--toggled'] : '',
    active ? styles['icon-button--active'] : '',
    count !== undefined ? styles['icon-button--has-count'] : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');
}

/**
 * Icon Buttons are compact, label-free actions for tight surfaces — channel headers, message
 * hover actions, modal dismissals, toolbar slots. They lean on the icon to communicate
 * intent, so every Icon Button must pair with a tooltip or `aria-label` that makes the
 * action explicit.
 *
 * Pass `asChild` with a single empty `<a>` or router `Link` child to render a navigational
 * icon control with Icon Button styling (no nested `<button>`).
 */
const IconButton = forwardRef(function IconButton(
  props: IconButtonProps | IconButtonAsChildProps,
  ref: Ref<HTMLButtonElement | HTMLElement>,
) {
  if (props.asChild) {
    const {
      active = false,
      className = '',
      count,
      destructive = false,
      icon,
      loading = false,
      padding = 'default',
      rounded = false,
      size = 'medium',
      style = 'default',
      unreadBadge = false,
      disabled,
      children,
      'aria-label': ariaLabel,
      asChild,
      ...rest
    } = props;
    void asChild;

    const rootClass = buildRootClass({
      className,
      count,
      destructive,
      padding,
      rounded,
      size,
      style,
      active,
    });
    const spinnerSize = ICON_BUTTON_ICON_SIZES[size];
    const isDisabled = Boolean(disabled || loading);
    const hasCount = count !== undefined;

    const anatomy = (
      <>
        <span className={styles['icon-button__icon-slot']} aria-hidden>
          {loading ? (
            <Spinner size={spinnerSize} inverted={style === 'inverted'} />
          ) : (
            <IconSlotContext.Provider value={{ size: spinnerSize }}>
              {icon}
            </IconSlotContext.Provider>
          )}
          {unreadBadge && !loading && (
            <span className={styles['icon-button__unread-badge']} />
          )}
        </span>
        {hasCount && (
          <span className={styles['icon-button__count']}>{count}</span>
        )}
      </>
    );

    return renderAsChild({
      child: children,
      props: {
        ...rest,
        className: rootClass,
        'aria-label': ariaLabel,
        'data-active': active ? 'true' : undefined,
        ...(loading ? { 'aria-busy': true } : null),
      },
      ref,
      content: anatomy,
      disabled: isDisabled,
      disabledClassName: styles['icon-button--disabled'],
      warnOnChildContent: true,
    });
  }

  const {
    active = false,
    className = '',
    count,
    destructive = false,
    icon,
    loading = false,
    padding = 'default',
    rounded = false,
    size = 'medium',
    style = 'default',
    toggled,
    unreadBadge = false,
    disabled,
    type = 'button',
    'aria-label': ariaLabel,
    asChild,
    ...rest
  } = props;
  void asChild;

  const rootClass = buildRootClass({
    className,
    count,
    destructive,
    padding,
    rounded,
    size,
    style,
    active,
    toggled,
  });
  const spinnerSize = ICON_BUTTON_ICON_SIZES[size];
  const isDisabled = Boolean(disabled || loading);
  const hasCount = count !== undefined;

  return (
    <button
      ref={ref as Ref<HTMLButtonElement>}
      className={rootClass}
      type={type}
      disabled={isDisabled}
      aria-label={ariaLabel}
      aria-pressed={toggled === undefined ? undefined : toggled}
      data-active={active ? 'true' : undefined}
      {...rest}
    >
      <span className={styles['icon-button__icon-slot']} aria-hidden>
        {loading ? (
          <Spinner size={spinnerSize} inverted={style === 'inverted'} />
        ) : (
          <IconSlotContext.Provider value={{ size: spinnerSize }}>
            {icon}
          </IconSlotContext.Provider>
        )}
        {unreadBadge && !loading && (
          <span className={styles['icon-button__unread-badge']} />
        )}
      </span>
      {hasCount && (
        <span className={styles['icon-button__count']}>{count}</span>
      )}
    </button>
  );
}) as IconButtonComponent;

IconButton.displayName = 'IconButton';

export default IconButton;
