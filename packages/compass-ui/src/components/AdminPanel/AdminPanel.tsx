import {
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

export interface AdminPanelProps extends Omit<
  HTMLAttributes<HTMLElement>,
  'title' | 'children'
> {
  title: ReactNode;
  subtitle?: ReactNode;
  children?: ReactNode;
  className?: string;
  headerActions?: ReactNode;
  iconLeft?: boolean;
  /** Icon forwarded to `AdminPanelHeader`'s 44×44 circular pill. Pass `<Icon glyph={<SomeIcon />} size="20" />`. */
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
}

/**
 * System Console admin settings panel: `AdminPanelHeader` plus a body slot
 * for grouped fields. Expand/collapse state is owned here and passed to the header.
 */
export default function AdminPanel({
  title,
  subtitle,
  headerActions,
  children,
  className = '',
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
  ...rest
}: AdminPanelProps) {
  const titleId = useId();

  const [uncontrolledExpanded, setUncontrolledExpanded] =
    useState<AdminPanelExpandedState>(defaultExpandedState);

  const isExpandControlled = expandable && expandedStateProp !== undefined;
  const resolvedExpandedState: AdminPanelExpandedState = !expandable
    ? 'expanded'
    : isExpandControlled
      ? expandedStateProp!
      : uncontrolledExpanded;

  const isExpanded = resolvedExpandedState === 'expanded';

  const setExpandedState = (next: AdminPanelExpandedState) => {
    if (!expandable) return;
    if (!isExpandControlled) {
      setUncontrolledExpanded(next);
    }
    onExpandedStateChange?.(next);
  };

  const toggleExpanded = () => {
    setExpandedState(isExpanded ? 'collapsed' : 'expanded');
  };

  const showHeaderDivider = !expandable || isExpanded;

  return (
    <section
      {...rest}
      className={[styles['admin-panel'], className].join(' ').trim()}
      aria-labelledby={titleId}
    >
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
        expandable={expandable}
        isExpanded={isExpanded}
        onToggleExpand={toggleExpanded}
        expandLabel={expandLabel}
        collapseLabel={collapseLabel}
        showDivider={showHeaderDivider}
      />
      {expandable ? (
        <div
          className={[
            styles['admin-panel__collapse'],
            isExpanded ? styles['admin-panel__collapse--expanded'] : '',
          ]
            .filter(Boolean)
            .join(' ')}
          aria-hidden={!isExpanded}
        >
          <div className={styles['admin-panel__collapse-inner']}>
            <div className={styles['admin-panel__body']}>{children}</div>
          </div>
        </div>
      ) : (
        <div className={styles['admin-panel__body']}>{children}</div>
      )}
    </section>
  );
}
