/* eslint-disable jsx-a11y/anchor-has-content -- type-only JSX; empty anchors are intentional */
/**
 * Compile-time checks for asChild prop narrowing. Excluded from the package
 * `typecheck` script (tests are); run with a one-off tsc include when changing
 * the overloads. The runtime suite is a no-op so vitest stays green.
 */
import { describe, it, expectTypeOf } from 'vitest';
import type { ComponentProps } from 'react';
import Button from './Button';
import IconButton from '../IconButton/IconButton';
import TileButton from '../TileButton/TileButton';

describe('asChild type narrowing', () => {
  it('keeps ComponentProps on the native button overload', () => {
    type ButtonP = ComponentProps<typeof Button>;
    expectTypeOf<ButtonP['asChild']>().toEqualTypeOf<false | undefined>();
    // Native button still accepts type="submit"
    const _ok: ButtonP = {
      children: 'Save',
      type: 'submit',
    };
    void _ok;
  });

  it('rejects button-only props on asChild', () => {
    // @ts-expect-error — type is not valid with asChild
    <Button asChild type="submit">
      <a href="/x">Go</a>
    </Button>;

    // @ts-expect-error — toggled is not valid with asChild
    <IconButton asChild aria-label="X" icon={null} toggled>
      <a href="/x" />
    </IconButton>;

    // @ts-expect-error — toggled is not valid with asChild
    <TileButton asChild icon={null} label="X" toggled>
      <a href="/x" />
    </TileButton>;

    // @ts-expect-error — aria-label is required with IconButton asChild
    <IconButton asChild icon={null}>
      <a href="/x" />
    </IconButton>;
  });
});
