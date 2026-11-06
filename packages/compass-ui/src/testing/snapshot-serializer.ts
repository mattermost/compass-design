/**
 * Jest / Vitest snapshot serializer that strips the build hash from
 * compass-ui CSS-module class names.
 *
 * compass-ui ships pre-compiled CSS modules named `_<class>_<hash>_<line>`
 * (e.g. `_icon-button--size-small_13ryy_77`). The hash comes from the
 * stylesheet's contents, so any style change in a release changes it and
 * every consumer snapshot that renders the component. Production keeps the
 * hash on purpose: plugins bundle their own compass-ui copy on the same page,
 * and content hashes stop different versions' styles from colliding.
 *
 * This serializer rewrites those tokens back to `<class>` in snapshots only.
 * It matches by shape, not by package: any class in Vite's default
 * CSS-module format (`_<class>_<hash>_<line>`) is stripped, including a
 * consumer's own or another library's. That only hides hash changes; adding,
 * removing or renaming a class still shows in the snapshot. Strings without
 * that shape are left untouched.
 *
 * ```js
 * // jest.config.js
 * snapshotSerializers: [require.resolve('@mattermost/compass-ui/testing/snapshot-serializer')],
 * // vitest.config.ts
 * test: { snapshotSerializers: ['@mattermost/compass-ui/testing/snapshot-serializer'] },
 * ```
 *
 * `scripts/verify-compass-ui-dist.mjs` fails the build if a generated class
 * name stops matching this pattern.
 */

/**
 * One hashed class token; captures the authored class name. Bounded by
 * whitespace or string ends (a `className` value), or by a ` class="`
 * attribute and its closing quote (a raw `innerHTML` string snapshot; the
 * leading space keeps `data-class="…"` and similar attributes untouched).
 * The authored name may start with `-`, as CSS identifiers can (the
 * `-host-shadow-a` specificity-boost classes in `styles/mixins.scss`).
 */
export const HASHED_CLASS_TOKEN =
  /(^|\s|\sclass=")_(-?[A-Za-z][\w-]*)_[a-z0-9]+_\d+(?=\s|"|$)/g;

// Separate non-global copy: `.test()` on a /g regex is stateful (lastIndex).
const HAS_HASHED_CLASS = new RegExp(HASHED_CLASS_TOKEN.source);

/** Removes the hash and line suffix from every compass-ui class token. */
export function stripCompassClassHashes(value: string): string {
  return value.replace(HASHED_CLASS_TOKEN, '$1$2');
}

/** pretty-format's printer callback (typed locally so consumers need no extra types). */
type Printer = (
  val: unknown,
  config: unknown,
  indentation: string,
  depth: number,
  refs: unknown,
) => string;

/** pretty-format `test` hook: true for strings holding a hashed class token. */
export function test(val: unknown): boolean {
  return typeof val === 'string' && HAS_HASHED_CLASS.test(val);
}

/**
 * pretty-format `serialize` hook: prints the string with every hashed class
 * token reduced to its authored name.
 */
export function serialize(
  val: string,
  config: unknown,
  indentation: string,
  depth: number,
  refs: unknown,
  printer: Printer,
): string {
  // Re-enter the printer so strings keep their normal quoting and escaping;
  // the stripped value no longer matches `test`, so this does not recurse.
  return printer(
    stripCompassClassHashes(val),
    config,
    indentation,
    depth,
    refs,
  );
}

/** Named exports serve Jest (CJS); `default` serves Vitest, which reads it. */
const compassSnapshotSerializer = { test, serialize };
export default compassSnapshotSerializer;
