import type { ButtonHTMLAttributes } from 'react';

/** `data-*` attributes, so object literals like `{ 'data-testid': 'x' }` type-check. */
export type DataAttributes = {
  [key: `data-${string}`]: string | number | boolean | undefined;
};

/**
 * Extra attributes for a component's built-in button (close, dismiss, back,
 * clear). The component's own `onClick`, `aria-label`, and variant props take
 * precedence; `className` is merged.
 */
export type BuiltInButtonProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  'children' | 'style'
> &
  DataAttributes;

export function mergeClassNames(
  ...names: Array<string | false | null | undefined>
): string {
  return names.filter(Boolean).join(' ');
}
