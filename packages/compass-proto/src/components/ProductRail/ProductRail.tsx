import type { ReactNode } from 'react';
import ProductRailItem from './ProductRailItem';
import styles from './ProductRail.module.scss';

export interface ProductRailItemData {
  /** Stable id, passed back through `onSelect`. */
  id: string;
  /** Visible label under the icon, also the accessible name. */
  label: ReactNode;
  /** Plain-text accessible name. Required when `label` is not a string. */
  ariaLabel?: string;
  /** Icon node, e.g. `<Icon glyph={<ProductChannelsIcon />} size="24" />`. */
  icon: ReactNode;
  /** Mention count badge. */
  mentionBadge?: number;
  /** Unread dot badge. Hidden when `mentionBadge` is set. */
  unreadBadge?: boolean;
}

export interface ProductRailProps {
  /** Products shown top to bottom. */
  items: ProductRailItemData[];
  /** Id of the selected product. */
  activeId?: string;
  /** Fires with the item id when a product is clicked. */
  onSelect?: (id: string) => void;
  /** Accessible name of the navigation landmark. */
  navLabel?: string;
  /** Pinned above the items (e.g. a product switcher trigger). */
  header?: ReactNode;
  /** Pinned to the bottom of the rail (e.g. settings or help). */
  footer?: ReactNode;
  className?: string;
}

/**
 * Labeled vertical product rail: one icon + label tile per product (Channels,
 * Playbooks, Boards, …), with selection, badges, and header/footer slots.
 */
export default function ProductRail({
  items,
  activeId,
  onSelect,
  navLabel = 'Products',
  header,
  footer,
  className = '',
}: ProductRailProps) {
  const rootClass = [styles['product-rail'], className]
    .filter(Boolean)
    .join(' ');

  return (
    <nav className={rootClass} aria-label={navLabel}>
      {header != null && (
        <div className={styles['product-rail__header']}>{header}</div>
      )}
      <ul className={styles['product-rail__items']}>
        {items.map((item) => (
          <li key={item.id} className={styles['product-rail__entry']}>
            <ProductRailItem
              icon={item.icon}
              label={item.label}
              ariaLabel={item.ariaLabel}
              selected={item.id === activeId}
              mentionBadge={item.mentionBadge}
              unreadBadge={item.unreadBadge}
              onClick={() => onSelect?.(item.id)}
            />
          </li>
        ))}
      </ul>
      {footer != null && (
        <div className={styles['product-rail__footer']}>{footer}</div>
      )}
    </nav>
  );
}
