import {
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from 'react';
import styles from './Tabs.module.scss';

export interface TabItem {
  /** Unique key for this tab. */
  key: string;
  /** Tab label. Accepts translated nodes (e.g. `<FormattedMessage/>`). */
  label: ReactNode;
  /** Optional count badge number. */
  countBadge?: number;
  /** When true, shows an unread dot badge. */
  unreadBadge?: boolean;
  /** Optional id for this tab (pair with `panelId` for `aria-controls`). */
  id?: string;
  /** Optional id of the host tabpanel this tab controls. */
  panelId?: string;
  /** When true, the tab can't be selected and arrow-key navigation skips it. */
  disabled?: boolean;
  /** Native tooltip text, e.g. to explain why the tab is disabled. */
  title?: string;
}

export interface TabsProps {
  /** Array of tab items to display. */
  tabs: TabItem[];
  /** Key of the currently active tab. */
  activeKey: string;
  /** Called when a tab is selected. */
  onChange: (key: string) => void;
  /** Optional CSS class name. */
  className?: string;
  /** Optional trailing controls rendered to the right of the tabs. */
  controls?: ReactNode;
}

/**
 * Tabs let people switch between sibling views inside the same surface — Mentions in the
 * right sidebar, sections of a settings panel, or filters on a list. The content area
 * changes; the surrounding chrome doesn't.
 */
export default function Tabs({
  tabs,
  activeKey,
  onChange,
  className = '',
  controls,
}: TabsProps) {
  const rootClass = [styles.tabs, className].filter(Boolean).join(' ');
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const [focusedKey, setFocusedKey] = useState(activeKey);

  useEffect(() => {
    setFocusedKey(activeKey);
  }, [activeKey]);

  const keys = tabs.map((tab) => tab.key);
  const enabledKeys = tabs.filter((tab) => !tab.disabled).map((tab) => tab.key);
  const focusKey = enabledKeys.includes(focusedKey)
    ? focusedKey
    : enabledKeys.includes(activeKey)
      ? activeKey
      : (enabledKeys[0] ?? activeKey);

  const moveFocus = (key: string) => {
    setFocusedKey(key);
    const index = keys.indexOf(key);
    tabRefs.current[index]?.focus();
  };

  const handleKeyDown = (
    event: KeyboardEvent<HTMLButtonElement>,
    key: string,
  ) => {
    const count = enabledKeys.length;
    if (count === 0) return;
    const index = enabledKeys.indexOf(key);

    if (event.key === 'ArrowRight') {
      event.preventDefault();
      moveFocus(enabledKeys[(index + 1) % count]);
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault();
      moveFocus(
        enabledKeys[index < 0 ? count - 1 : (index - 1 + count) % count],
      );
    } else if (event.key === 'Home') {
      event.preventDefault();
      moveFocus(enabledKeys[0]);
    } else if (event.key === 'End') {
      event.preventDefault();
      moveFocus(enabledKeys[count - 1]);
    } else if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      if (index >= 0) onChange(key);
    }
  };

  return (
    <div className={rootClass}>
      <div className={styles['tabs__tab-list']} role="tablist">
        {tabs.map((tab, index) => {
          const isActive = tab.key === activeKey;
          const isDisabled = tab.disabled === true;
          const tabClass = [
            styles['tabs__tab'],
            isActive ? styles['tabs__tab--active'] : '',
            isDisabled ? styles['tabs__tab--disabled'] : '',
          ]
            .filter(Boolean)
            .join(' ');

          return (
            <button
              key={tab.key}
              ref={(node) => {
                tabRefs.current[index] = node;
              }}
              id={tab.id}
              role="tab"
              type="button"
              tabIndex={focusKey === tab.key ? 0 : -1}
              aria-selected={isActive}
              aria-controls={tab.panelId}
              aria-disabled={isDisabled || undefined}
              title={tab.title}
              className={tabClass}
              onMouseDown={
                isDisabled ? (event) => event.preventDefault() : undefined
              }
              onClick={() => {
                if (isDisabled) return;
                setFocusedKey(tab.key);
                onChange(tab.key);
              }}
              onKeyDown={(event) => handleKeyDown(event, tab.key)}
            >
              <span className={styles['tabs__tab-label']}>{tab.label}</span>

              {tab.countBadge != null && (
                <span
                  className={[
                    styles['tabs__count-badge'],
                    isActive ? styles['tabs__count-badge--active'] : '',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                >
                  {tab.countBadge}
                </span>
              )}

              {tab.unreadBadge && !isActive && (
                <span className={styles['tabs__unread-badge']}>
                  <span className={styles['tabs__unread-label']}>
                    {'Unread'}
                  </span>
                </span>
              )}
            </button>
          );
        })}
      </div>

      {controls != null && (
        <div className={styles['tabs__controls']}>{controls}</div>
      )}
    </div>
  );
}
