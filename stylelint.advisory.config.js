// Advisory token rules: most motion should use --duration-* and --ease-*, and
// most shadows --elevation-*, but some can't (e.g. a constant-rate spinner, a
// focus ring). Violations print as warnings and never fail CI. When a value
// can't use a token, say why inline:
//   // stylelint-disable-next-line declaration-property-value-disallowed-list -- <reason>
import { sharedOverrides } from './stylelint.config.js';

export default {
  customSyntax: 'postcss-scss',
  defaultSeverity: 'warning',
  reportDescriptionlessDisables: true,
  ignoreFiles: ['**/dist/**', '**/storybook-static/**', '**/node_modules/**'],
  rules: {
    'declaration-property-value-disallowed-list': {
      '/^(transition|animation)(-duration|-delay)?$/': [
        /(?<![\w.-])(?!0m?s\b)\d*\.?\d+m?s\b/,
      ],
      '/^(transition|animation)(-timing-function)?$/': [
        /(?<![\w-])(ease|ease-in|ease-out|ease-in-out|linear)(?![\w-])/,
        /cubic-bezier\(/,
      ],
      // Shadows: use --elevation-1…6. Focus / field rings (`--focus-ring-color`
      // or a zero-blur `0 0 0 Npx` spread) are not elevations and are exempt.
      'box-shadow': [
        /^(?!none$|inherit$|initial$|unset$)(?!.*var\(--(elevation-|focus-ring-color))(?!(inset\s+)?0(px)?\s+0(px)?\s+0(px)?\s)/,
      ],
    },
  },
  overrides: sharedOverrides,
};
