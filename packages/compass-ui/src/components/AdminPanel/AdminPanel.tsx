import {
  Children,
  useId,
  useState,
  type ChangeEvent,
  type HTMLAttributes,
  type ReactNode,
} from 'react';
import AdminPanelHeader, {
  type AdminPanelExpandedState,
} from '@/components/AdminPanelHeader/AdminPanelHeader';
import styles from './AdminPanel.module.scss';

export type { AdminPanelExpandedState };

/** Non-null content for required header/body slots (runtime still guards nullish escapes). */
type AdminPanelContent = NonNullable<ReactNode>;

type AdminPanelChromeProps = Omit<
  HTMLAttributes<HTMLElement>,
  'title' | 'children'
> & {
  className?: string;
  /**
   * Optional footer rail below the body — typically
   * [`AdminPanelFooter`](/components/admin-panel-footer) with left/right action slots.
   * Collapses with the body when the panel is expandable.
   */
  footer?: ReactNode;
};

type AdminPanelHeaderSlotProps = {
  title: AdminPanelContent;
  subtitle?: ReactNode;
  headerActions?: ReactNode;
  iconLeft?: boolean;
  /** Icon forwarded to `AdminPanelHeader`'s 44×44 circular pill. Pass `<Icon glyph={<SomeIcon />} />`. */
  leadingIcon?: ReactNode;
  showBeta?: boolean;
  /** Default: "Beta". Accepts translated nodes. */
  betaLabel?: ReactNode;
  showEnterpriseLabel?: boolean;
  /** Default: "Enterprise". Accepts translated nodes. */
  enterpriseLabel?: ReactNode;
  showButton?: boolean;
  /** Default: "Button". Accepts translated nodes. */
  buttonLabel?: ReactNode;
  onButtonClick?: () => void;
  showSwitch?: boolean;
  switchLabel?: ReactNode;
  switchChecked?: boolean;
  defaultSwitchChecked?: boolean;
  onSwitchChange?: (
    checked: boolean,
    event: ChangeEvent<HTMLInputElement>,
  ) => void;
  switchDisabled?: boolean;
  expandable?: boolean;
  expandedState?: AdminPanelExpandedState;
  defaultExpandedState?: AdminPanelExpandedState;
  onExpandedStateChange?: (state: AdminPanelExpandedState) => void;
  /** Accessible name for the expand button while collapsed. Default: "Expand section". */
  expandLabel?: string;
  /** Accessible name for the expand button while expanded. Default: "Collapse section". */
  collapseLabel?: string;
};

/** Panel with a header. Body and footer are optional. */
type AdminPanelWithHeaderProps = AdminPanelChromeProps &
  AdminPanelHeaderSlotProps & {
    children?: ReactNode;
  };

/**
 * Header-less panel. `children` (body) are required — footer alone is not enough.
 * Header chrome props (`subtitle`, `expandable`, …) are not accepted on this variant.
 */
type AdminPanelWithoutHeaderProps = AdminPanelChromeProps & {
  title?: undefined;
  children: AdminPanelContent;
};

/**
 * System Console admin settings panel. Provide a `title` (header), `children`
 * (body), or both. Footer is always optional. Header-only and body-only panels
 * are valid; footer-only is not.
 */
export type AdminPanelProps =
  | AdminPanelWithHeaderProps
  | AdminPanelWithoutHeaderProps;

/**
 * Admin Panel is the bordered sheet used throughout System Console for a single
 * settings section. It can include an
 * [`Admin Panel Header`](/components/admin-panel-header), a body where grouped
 * fields and help text live, and an optional
 * [`Admin Panel Footer`](/components/admin-panel-footer) for sectional actions.
 * Provide a header, a body, or both — footer alone is not enough. Expand/collapse
 * state is owned here and passed to the header when present.
 */
export default function AdminPanel(props: AdminPanelProps) {
  const {
    title,
    children,
    footer,
    className = '',
    ...rest
  } = props as AdminPanelWithHeaderProps;

  const {
    subtitle,
    headerActions,
    iconLeft = false,
    leadingIcon,
    showBeta = false,
    betaLabel = 'Beta',
    showEnterpriseLabel = false,
    enterpriseLabel = 'Enterprise',
    showButton = false,
    buttonLabel = 'Button',
    onButtonClick,
    showSwitch = false,
    switchLabel = 'Off',
    switchChecked,
    defaultSwitchChecked,
    onSwitchChange,
    switchDisabled,
    expandable = false,
    expandedState: expandedStateProp,
    defaultExpandedState = 'collapsed',
    onExpandedStateChange,
    expandLabel,
    collapseLabel,
    ...domRest
  } = rest;

  const titleId = useId();
  // Treat nullish / false / '' as no header so JS callers and type escapes stay safe.
  const hasHeader = title != null && title !== false && title !== '';

  const [uncontrolledExpanded, setUncontrolledExpanded] =
    useState<AdminPanelExpandedState>(defaultExpandedState);

  // Expand/collapse lives on the header; without one, content stays visible.
  const canExpand = hasHeader && expandable;
  const isExpandControlled = canExpand && expandedStateProp !== undefined;
  const resolvedExpandedState: AdminPanelExpandedState = !canExpand
    ? 'expanded'
    : isExpandControlled
      ? expandedStateProp!
      : uncontrolledExpanded;

  const isExpanded = resolvedExpandedState === 'expanded';

  const setExpandedState = (next: AdminPanelExpandedState) => {
    if (!canExpand) return;
    if (!isExpandControlled) {
      setUncontrolledExpanded(next);
    }
    onExpandedStateChange?.(next);
  };

  const toggleExpanded = () => {
    setExpandedState(isExpanded ? 'collapsed' : 'expanded');
  };

  const hasBody = Children.toArray(children).length > 0;
  const hasFooter = footer != null;
  const hasContent = hasBody || hasFooter;
  // Skip the header divider when there is no body/footer so header-only
  // panels don’t show an orphan rule above the card edge.
  const showHeaderDivider = hasContent && (!canExpand || isExpanded);

  const body = hasBody ? (
    <div className={styles['admin-panel__body']}>{children}</div>
  ) : null;

  const content = hasContent ? (
    canExpand ? (
      <div
        className={[
          styles['admin-panel__collapse'],
          isExpanded ? styles['admin-panel__collapse--expanded'] : '',
        ]
          .filter(Boolean)
          .join(' ')}
        aria-hidden={!isExpanded}
        inert={!isExpanded}
      >
        <div className={styles['admin-panel__collapse-inner']}>
          {body}
          {footer}
        </div>
      </div>
    ) : (
      <>
        {body}
        {footer}
      </>
    )
  ) : null;

  return (
    <section
      {...domRest}
      className={[styles['admin-panel'], className].join(' ').trim()}
      aria-labelledby={hasHeader ? titleId : undefined}
    >
      {hasHeader ? (
        <AdminPanelHeader
          titleId={titleId}
          title={title}
          subtitle={subtitle}
          headerActions={headerActions}
          iconLeft={iconLeft}
          leadingIcon={leadingIcon}
          showBeta={showBeta}
          betaLabel={betaLabel}
          showEnterpriseLabel={showEnterpriseLabel}
          enterpriseLabel={enterpriseLabel}
          showButton={showButton}
          buttonLabel={buttonLabel}
          onButtonClick={onButtonClick}
          showSwitch={showSwitch}
          switchLabel={switchLabel}
          switchChecked={switchChecked}
          defaultSwitchChecked={defaultSwitchChecked}
          onSwitchChange={onSwitchChange}
          switchDisabled={switchDisabled}
          expandable={canExpand}
          isExpanded={isExpanded}
          onToggleExpand={toggleExpanded}
          expandLabel={expandLabel}
          collapseLabel={collapseLabel}
          showDivider={showHeaderDivider}
        />
      ) : null}
      {content}
    </section>
  );
}
