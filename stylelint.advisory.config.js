// Advisory token rules: motion should use --duration-* and --ease-*, shadows
// --elevation-*, spacing --spacing-* and radius --radius-*, but some can't
// (e.g. a constant-rate spinner, a one-off width). Violations print as warnings
// and never fail CI. When a value can't use a token, say why inline:
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
      // Spacing and radius: use --spacing-* and --radius-*. Any raw unit warns
      // (px, rem, em, vw, …) except percentages, viewport units (vw, vh), zero and 1px hairlines; one-off widths and in-between values warn (disable inline
      // with a reason when there's no suitable token).
      '/^(padding|margin|gap|row-gap|column-gap)(-(top|right|bottom|left|block|inline)(-(start|end))?)?$/':
        [
          /(?<![\w.#-])(?!0+(?:\.0+)?[a-z]*(?![\w.])|1px\b|\d*\.?\d+[dsl]?v[hw]\b)\d*\.?\d+[a-z]+\b/,
        ],
      '/^border(-(top|bottom|start|end)-?(left|right|start|end)?)?-radius$/': [
        /(?<![\w.#-])(?!0+(?:\.0+)?[a-z]*(?![\w.])|1px\b|\d*\.?\d+[dsl]?v[hw]\b)\d*\.?\d+[a-z]+\b/,
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
