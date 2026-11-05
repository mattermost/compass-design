// Mechanical enforcement of the rules in .claude/rules/styling.md.
// Formatting is Prettier's job; this config only checks token usage and
// basic correctness, so it carries no formatting rules.
//
// Errors live here. Motion and shadow tokens are advisory (exceptions are
// legitimate) and live in stylelint.advisory.config.js; `npm run lint:styles` runs both.

// Token, theme and compat definitions are where raw values live.
const definitionFiles = [
  '**/tokens.scss',
  '**/themes.scss',
  '**/webapp-compat.scss',
  '**/reset.scss',
  '**/layers.scss',
];

// Docs-only mocks that reproduce OS / device chrome or fixed demo art.
// Raw values are intentional here.
const mockFiles = [
  'src/components/layout/DeviceFrame/*.scss',
  'src/components/layout/MobileModalStage/*.scss',
  'src/guidelines/layouts/mobile-channel/*.scss',
  'src/guidelines/_components/PopoverMenuMotion.module.scss',
  'src/pages/home/Home.module.scss',
  'src/pages/topics/FoundationsBento/*.scss',
  'packages/compass-proto/src/components/CallPopout/*.scss',
];

// Known debt found when Stylelint was introduced. Remove entries as they are
// fixed; do not add new ones.
const debtFiles = [
  'packages/compass-proto/src/components/AppBarItem/AppBarItem.module.scss',
  'packages/compass-proto/src/components/CallParticipantAvatar/CallParticipantAvatar.module.scss',
  'packages/compass-proto/src/components/MobileTabBar/MobileTabBar.module.scss',
  'packages/compass-ui/src/components/Chip/Chip.module.scss',
  'packages/compass-ui/src/components/Combobox/Combobox.module.scss',
  'packages/compass-ui/src/components/IconButton/IconButton.module.scss',
  'packages/compass-ui/src/components/ImagePreview/ImagePreview.module.scss',
  'packages/compass-ui/src/components/MentionBadge/MentionBadge.module.scss',
  'packages/compass-ui/src/components/PasswordInput/PasswordInput.module.scss',
  'packages/compass-ui/src/components/SearchInput/SearchInput.module.scss',
  'packages/compass-ui/src/components/Select/Select.module.scss',
  'packages/compass-ui/src/components/Tabs/Tabs.module.scss',
  'packages/compass-ui/src/components/TeamAvatar/TeamAvatar.module.scss',
  'packages/compass-ui/src/components/TextArea/TextArea.module.scss',
  'packages/compass-ui/src/components/TextInput/TextInput.module.scss',
  'packages/compass-ui/src/components/ThreadFooter/ThreadFooter.module.scss',
  'packages/compass-ui/src/components/UserAvatar/UserAvatar.module.scss',
  'src/guidelines/_components/Type.module.scss',
  'src/styles/library-demo/foundations.module.scss',
];

// Anything that isn't a token reference (or a CSS-wide keyword).
const notToken = '(?!var\\(|calc\\(.*var\\(|inherit$|initial$|unset$|revert)';

export const sharedOverrides = [
  {
    files: definitionFiles,
    rules: { 'declaration-property-value-disallowed-list': null },
  },
  {
    files: mockFiles,
    rules: { 'declaration-property-value-disallowed-list': null },
  },
];

export default {
  customSyntax: 'postcss-scss',
  // A disable comment must say why: `-- <reason>` after the rule name.
  reportDescriptionlessDisables: true,
  ignoreFiles: ['**/dist/**', '**/storybook-static/**', '**/node_modules/**'],
  rules: {
    'color-no-invalid-hex': true,
    'declaration-block-no-duplicate-properties': [
      true,
      { ignore: ['consecutive-duplicates-with-different-syntaxes'] },
    ],

    // Tokens over raw values
    'declaration-property-value-disallowed-list': {
      // Raw hex, except as a var() fallback (standalone default for a theme var)
      '/.*/': [/(?<!var\(\s*--[\w-]+\s*,\s*)#[0-9a-f]{3,8}\b/i],
      // Bold / numeric weights: use --font-weight-regular|semibold
      'font-weight': [/^(bold|bolder|[1-9]00)$/],
      // Type: use --font-family-*, --font-size-*, --line-height-*
      'font-family': [new RegExp(`^${notToken}`)],
      'font-size': [new RegExp(`^${notToken}`)],
      // Unitless 0 and 1 are resets, not sizes, so they are allowed.
      'line-height': [new RegExp(`^(?!0$|1$)${notToken}`)],
    },
  },
  overrides: [
    ...sharedOverrides,
    {
      files: debtFiles,
      rules: { 'declaration-property-value-disallowed-list': null },
    },
  ],
};
