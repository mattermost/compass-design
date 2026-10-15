import type { MenuItemPassthroughProps } from '@/components/MenuItem/MenuItem';
import { mergeClassNames } from '@/utils/props';

/** Later sources win; `className` is merged. Used for `menuItemProps` on a menu and on one of its options. */
export function mergeMenuItemProps(
  ...sources: Array<MenuItemPassthroughProps | undefined>
): MenuItemPassthroughProps {
  const merged: MenuItemPassthroughProps = {};
  for (const source of sources) {
    if (!source) continue;
    Object.assign(merged, source);
  }
  const className = mergeClassNames(...sources.map((s) => s?.className));
  if (className) merged.className = className;
  return merged;
}
