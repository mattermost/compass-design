import { createElement, type ReactElement, type ReactNode } from 'react';
import Illustration from '../components/Illustration/Illustration';
import type { IllustrationProps } from '../components/Illustration/Illustration';
import {
  STORYBOOK_ILLUSTRATIONS,
  STORYBOOK_ILLUSTRATION_NAMES,
  type StorybookIllustrationName,
} from './compassIllustrations.generated';

type IllustrationSelectArgType = {
  control: 'select';
  options: string[];
  description?: string;
};

/** Hide an optional illustration slot in Storybook controls. */
export const ILLUSTRATION_NONE = 'None';

export type StoryIllustrationOption =
  | typeof ILLUSTRATION_NONE
  | StorybookIllustrationName;

export { STORYBOOK_ILLUSTRATION_NAMES, type StorybookIllustrationName };

function isIllustrationName(value: string): value is StorybookIllustrationName {
  return Object.prototype.hasOwnProperty.call(STORYBOOK_ILLUSTRATIONS, value);
}

/** Raw illustration SVG element (no Illustration wrapper). */
export function renderIllustrationGlyph(
  name: StorybookIllustrationName,
): ReactElement {
  const Glyph = STORYBOOK_ILLUSTRATIONS[name];
  return createElement(Glyph);
}

/** Compass Illustration wrapper around a named SVG. */
export function renderIllustration(
  name: StorybookIllustrationName,
  props?: Omit<IllustrationProps, 'glyph' | 'children'>,
): ReactElement {
  return <Illustration {...props} glyph={renderIllustrationGlyph(name)} />;
}

/**
 * Map a Storybook select value to an illustration glyph node.
 * `None` → undefined; otherwise a named SVG element for use as `glyph` / `children`.
 */
export function resolveStoryIllustration(
  value: string | undefined | null,
): ReactNode | undefined {
  if (value == null || value === ILLUSTRATION_NONE || value === '') {
    return undefined;
  }

  if (!isIllustrationName(value)) {
    return undefined;
  }

  return renderIllustrationGlyph(value);
}

export type IllustrationSelectArgTypeOptions = {
  /** Include a `None` option (optional illustration slots). Default false. */
  optional?: boolean;
  /** Control description shown in Storybook. */
  description?: string;
};

/** Shared select argType for illustration name controls. */
export function illustrationSelectArgType(
  options: IllustrationSelectArgTypeOptions = {},
): IllustrationSelectArgType {
  const names: string[] = [
    ...(options.optional ? [ILLUSTRATION_NONE] : []),
    ...STORYBOOK_ILLUSTRATION_NAMES,
  ];

  return {
    control: 'select',
    options: names,
    description:
      options.description ??
      'Illustration name from @mattermost/compass-ui/illustrations/<name>.',
  };
}
