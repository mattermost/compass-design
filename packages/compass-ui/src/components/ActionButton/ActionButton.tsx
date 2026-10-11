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
import { renderAsChild } from '@/utils/slot';
import styles from './ActionButton.module.scss';

interface ActionButtonOwnProps {
  /** Pass `<Icon glyph={<SomeIcon />} />` — ActionButton provides the correct size (20) via context. */
  icon: ReactNode;
  /** Visible label. Accepts translated nodes (e.g. `<FormattedMessage/>`). */
  label: ReactNode;
  destructive?: boolean;
  className?: string;
  /**
   * When true, disables the control. On a native `<button>`, sets the `disabled`
   * attribute. With `asChild`, sets `aria-disabled`, applies disabled styles, and
   * blocks click / middle-click navigation (the link stays focusable).
   */
  disabled?: boolean;
}

export interface ActionButtonProps
  extends ActionButtonOwnProps, ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * When true, merges ActionButton props onto the single child element instead of
   * rendering a `<button>`. Use with `<a>` or a router `Link`. Default: false.
   */
  asChild?: false;
  /**
   * When set, this is a toggle; maps to `aria-pressed`. Only applies to the native
   * `<button>`; not available with `asChild`.
   */
  active?: boolean;
}

export interface ActionButtonAsChildProps
  extends
    ActionButtonOwnProps,
    Omit<HTMLAttributes<HTMLElement>, 'children' | 'color'> {
  /**
   * Merges ActionButton props onto the single child element instead of rendering a
   * `<button>`. The child's own props (`href`, `to`, `target`, …) stay on the
   * child. Do not pass `type` or `active` — they are not available on links.
   * Pass an empty child; ActionButton supplies the icon and label anatomy.
   */
  asChild: true;
  /** Single empty element to render as the ActionButton (e.g. `<a href="…" />`). */
  children: ReactElement;
}

type ActionButtonComponent = {
  (
    props: ActionButtonAsChildProps & RefAttributes<HTMLElement>,
  ): ReactElement | null;
  (
    props: ActionButtonProps & RefAttributes<HTMLButtonElement>,
  ): ReactElement | null;
  displayName?: string;
};

/**
 * Action Buttons surface a small set of high-frequency actions in a fixed context — a
 * profile popover, a channel info panel, a card. They sit close to the content they act on
 * and read as a row of equal-weight choices.
 *
 * Pass `asChild` with a single empty `<a>` or router `Link` child to render a navigational
 * action with Action Button styling (no nested `<button>`).
 */
const ActionButton = forwardRef(function ActionButton(
  props: ActionButtonProps | ActionButtonAsChildProps,
  ref: Ref<HTMLButtonElement | HTMLElement>,
) {
  if (props.asChild) {
    const {
      icon,
      label,
      destructive = false,
      className,
      disabled,
      children,
      asChild,
      ...rest
    } = props;
    void asChild;

    const rootClass = [
      styles['action-button'],
      destructive ? styles['action-button--destructive'] : '',
      className ?? '',
    ]
      .filter(Boolean)
      .join(' ');

    const anatomy = (
      <>
        <span className={styles['action-button__icon']} aria-hidden>
          <IconSlotContext.Provider value={{ size: '20' }}>
            {icon}
          </IconSlotContext.Provider>
        </span>
        <span className={styles['action-button__label']}>{label}</span>
      </>
    );

    return renderAsChild({
      child: children,
      props: {
        ...rest,
        className: rootClass,
      },
      ref,
      content: anatomy,
      disabled: Boolean(disabled),
      disabledClassName: styles['action-button--disabled'],
      warnOnChildContent: true,
    });
  }

  const {
    icon,
    label,
    active,
    destructive = false,
    className,
    disabled,
    type = 'button',
    asChild,
    ...htmlProps
  } = props;
  void asChild;

  const rootClass = [
    styles['action-button'],
    active ? styles['action-button--active'] : '',
    destructive ? styles['action-button--destructive'] : '',
    className ?? '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      ref={ref as Ref<HTMLButtonElement>}
      className={rootClass}
      type={type}
      disabled={disabled}
      aria-pressed={active === undefined ? undefined : active}
      {...htmlProps}
    >
      <span className={styles['action-button__icon']} aria-hidden>
        <IconSlotContext.Provider value={{ size: '20' }}>
          {icon}
        </IconSlotContext.Provider>
      </span>
      <span className={styles['action-button__label']}>{label}</span>
    </button>
  );
}) as ActionButtonComponent;

ActionButton.displayName = 'ActionButton';

export default ActionButton;
