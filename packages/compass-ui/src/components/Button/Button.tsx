import {
  forwardRef,
  type ButtonHTMLAttributes,
  type HTMLAttributes,
  type ReactElement,
  type ReactNode,
  type Ref,
  type RefAttributes,
} from 'react';
import type { IconSize } from '@/components/Icon/Icon';
import { IconSlotContext } from '@/components/Icon/Icon';
import Spinner from '@/components/Spinner/Spinner';
import type { SpinnerSize } from '@/components/Spinner/Spinner';
import { renderAsChild } from '@/utils/slot';
import { toKebab } from '@/utils/string';
import styles from './Button.module.scss';

export type ButtonEmphasis =
  | 'primary'
  | 'secondary'
  | 'tertiary'
  | 'quaternary'
  | 'dim'
  | 'link';

export type ButtonSize = 'x-small' | 'small' | 'medium' | 'large';

export type ButtonAppearance = 'default' | 'inverted';

/** True when the slot should render (icons, badges, or other JSX). */
function hasSlotContent(node: ReactNode): boolean {
  if (node == null || typeof node === 'boolean') {
    return false;
  }
  if (typeof node === 'string') {
    return node.length > 0;
  }
  return true;
}

interface ButtonOwnProps {
  /** default | inverted (for use on dark backgrounds). Maps to Figma "Style". */
  appearance?: ButtonAppearance;
  /** Optional CSS class name. */
  className?: string;
  /**
   * When true, uses denser padding and a 6px icon/label gap. On `small`,
   * height drops from 32px to 28px (6px × 10px padding). For dense toolbars.
   * Default: false.
   */
  compact?: boolean;
  /** When true, uses destructive (danger) styling. */
  destructive?: boolean;
  /** Visual emphasis. Default: primary. */
  emphasis?: ButtonEmphasis;
  /**
   * Leading slot — typically `<Icon glyph={<YourIcon />} />`, or any other
   * React node (badge, custom markup). Button provides Icon size via context
   * when an Icon is used; no `size` prop needed on the Icon.
   */
  leadingIcon?: ReactNode;
  /** When true, shows a Spinner in the leading slot and disables the button (or blocks navigation when `asChild`). */
  loading?: boolean;
  /** Size variant. Default: medium. */
  size?: ButtonSize;
  /**
   * Trailing slot — typically `<Icon glyph={<YourIcon />} />`, or any other
   * React node (badge, custom markup). Button provides Icon size via context
   * when an Icon is used; no `size` prop needed on the Icon.
   */
  trailingIcon?: ReactNode;
  /**
   * When true, disables the control. On a native `<button>`, sets the `disabled`
   * attribute. With `asChild`, sets `aria-disabled`, applies disabled styles, and
   * blocks click / middle-click navigation (the link stays focusable).
   */
  disabled?: boolean;
}

export interface ButtonProps
  extends ButtonOwnProps, ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * When true, merges Button props onto the single child element instead of
   * rendering a `<button>`. Use with `<a>` or a router `Link`. Default: false.
   */
  asChild?: false;
  /** Button label. */
  children: ReactNode;
}

export interface ButtonAsChildProps
  extends
    ButtonOwnProps,
    Omit<HTMLAttributes<HTMLElement>, 'children' | 'color'> {
  /**
   * Merges Button props onto the single child element instead of rendering a
   * `<button>`. The child's own props (`href`, `to`, `target`, …) stay on the
   * child. Do not pass `type` — it is not forwarded.
   */
  asChild: true;
  /** Single element to render as the Button (e.g. `<a>` or `<Link>`). Its children become the label. */
  children: ReactElement;
}

const SIZE_ICON_MAP: Record<ButtonSize, IconSize> = {
  'x-small': '12',
  small: '12',
  medium: '16',
  large: '20',
};

type ButtonComponent = {
  (props: ButtonAsChildProps & RefAttributes<HTMLElement>): ReactElement | null;
  (props: ButtonProps & RefAttributes<HTMLButtonElement>): ReactElement | null;
  displayName?: string;
};

function buildRootClass({
  appearance = 'default',
  className = '',
  compact = false,
  destructive = false,
  emphasis = 'primary',
  size = 'medium',
}: {
  appearance?: ButtonAppearance;
  className?: string;
  compact?: boolean;
  destructive?: boolean;
  emphasis?: ButtonEmphasis;
  size?: ButtonSize;
}): string {
  return [
    styles.button,
    styles[`button--emphasis-${toKebab(emphasis)}`],
    styles[`button--size-${toKebab(size)}`],
    appearance === 'inverted' ? styles['button--appearance-inverted'] : '',
    compact ? styles['button--compact'] : '',
    destructive ? styles['button--destructive'] : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');
}

/**
 * Buttons let people take actions or make decisions with a single tap or click — saving a
 * form, sending a message, confirming a dialog. Compass ships several button variants, each
 * with the same anatomy and rhythm so they feel like members of the same family.
 *
 * Pass `asChild` with a single `<a>` or router `Link` child to render a navigational CTA
 * with Button styling and anatomy (no nested `<button>`).
 */
const Button = forwardRef(function Button(
  props: ButtonProps | ButtonAsChildProps,
  ref: Ref<HTMLButtonElement | HTMLElement>,
) {
  if (props.asChild) {
    const {
      appearance = 'default',
      className = '',
      compact = false,
      destructive = false,
      emphasis = 'primary',
      children,
      leadingIcon,
      loading = false,
      size = 'medium',
      trailingIcon,
      disabled,
      asChild,
      ...rest
    } = props;
    void asChild;

    const rootClass = buildRootClass({
      appearance,
      className,
      compact,
      destructive,
      emphasis,
      size,
    });
    const iconSize = SIZE_ICON_MAP[size];
    const showLeadingSlot = loading || hasSlotContent(leadingIcon);
    const isDisabled = Boolean(disabled || loading);
    const child = children as ReactElement<{ children?: ReactNode }>;

    const leading = showLeadingSlot ? (
      <span className={styles['button__icon-slot']} aria-hidden>
        {loading ? (
          <Spinner
            size={iconSize as SpinnerSize}
            inverted={appearance === 'inverted'}
          />
        ) : (
          <IconSlotContext.Provider value={{ size: iconSize }}>
            {leadingIcon}
          </IconSlotContext.Provider>
        )}
      </span>
    ) : null;

    const trailing =
      !loading && hasSlotContent(trailingIcon) ? (
        <span className={styles['button__icon-slot']} aria-hidden>
          <IconSlotContext.Provider value={{ size: iconSize }}>
            {trailingIcon}
          </IconSlotContext.Provider>
        </span>
      ) : null;

    return renderAsChild({
      child,
      props: {
        ...rest,
        className: rootClass,
        ...(loading ? { 'aria-busy': true } : null),
      },
      ref,
      content: (
        <>
          {leading}
          <span className={styles['button__label']}>
            {child.props.children}
          </span>
          {trailing}
        </>
      ),
      disabled: isDisabled,
      disabledClassName: styles['button--disabled'],
    });
  }

  const {
    appearance = 'default',
    className = '',
    compact = false,
    destructive = false,
    emphasis = 'primary',
    children,
    leadingIcon,
    loading = false,
    size = 'medium',
    trailingIcon,
    disabled,
    type = 'button',
    asChild,
    ...rest
  } = props;
  void asChild;

  const rootClass = buildRootClass({
    appearance,
    className,
    compact,
    destructive,
    emphasis,
    size,
  });
  const iconSize = SIZE_ICON_MAP[size];
  const showLeadingSlot = loading || hasSlotContent(leadingIcon);
  const isDisabled = Boolean(disabled || loading);

  return (
    <button
      ref={ref as Ref<HTMLButtonElement>}
      className={rootClass}
      type={type}
      disabled={isDisabled}
      {...rest}
    >
      {showLeadingSlot ? (
        <span className={styles['button__icon-slot']} aria-hidden>
          {loading ? (
            <Spinner
              size={iconSize as SpinnerSize}
              inverted={appearance === 'inverted'}
            />
          ) : (
            <IconSlotContext.Provider value={{ size: iconSize }}>
              {leadingIcon}
            </IconSlotContext.Provider>
          )}
        </span>
      ) : null}
      <span className={styles['button__label']}>{children}</span>
      {!loading && hasSlotContent(trailingIcon) ? (
        <span className={styles['button__icon-slot']} aria-hidden>
          <IconSlotContext.Provider value={{ size: iconSize }}>
            {trailingIcon}
          </IconSlotContext.Provider>
        </span>
      ) : null}
    </button>
  );
}) as ButtonComponent;

Button.displayName = 'Button';

export default Button;
