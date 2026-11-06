# Typography

Source: `/foundations/typography`, `.claude/rules/styling.md`.

- **Headings use the heading font:** `font-family: var(--font-family-heading)` (Metropolis). Body, labels and dense UI use the body font, `var(--font-family-body)` (Open Sans), which is the default. Always set the family with these tokens; never hardcode a font name, and never leave a heading on the inherited body font.
- Heading pairs used in forms and panels (size / line height tokens, semibold):

| Role | Size and line height | Family |
| ---- | -------------------- | ------ |
| Page or form title | `--font-size-700` / `--line-height-700` (28/36) | heading |
| Field group title | `--font-size-200` / `--line-height-200` (16/24) | heading |
| Sub-group title (radio, checkbox, switch list), and any Heading 100 or smaller | `--font-size-100` / `--line-height-100` (14/20) | body font (Open Sans), semibold. Both Figma files define Heading 100 as Open Sans **[proposed]** |

- **Space above and below every heading, never none.** A heading's space comes from the layout gap, not text margins: the gap above it is the gap between its group and the previous one (32px in forms), and the gap below it is the gap to its first field (16px for a field group title in forms, 12px for a sub-group title). A heading directly touching its first label or field is a bug.
- **Which spacing applies:**
  - **Forms:** use the role table above and the form gaps in `spacing-and-hierarchy.md`.
  - **Prose-like content** (a page, panel, detail view or list that is mostly headings and text): use the level-based defaults below. Set them as layout gaps, not as text margins.
  - If a design or Figma frame gives explicit gaps, those win over both.

| Heading level | Space above | Space below |
| ------------- | ----------- | ----------- |
| 200 (16px) | 16px | 8px |
| 300 (18px) | 16px | 8px |
| 400 (20px) | 16px | 8px |
| 500 (22px) | 20px | 8px |
| 600 (25px) | 24px | 8px |
| 700 (28px) | 24px | 8px |
| 800 (32px) | 28px | 8px |
| 900 (36px) | 32px | 8px |
| 1000 (40px) | 36px | 12px |

  The rule behind the table: above = font size / 1.125, rounded to the 4px grid; below = a quarter of the font size, rounded to 4px, at least 8px. Use the nearest spacing token for each value. The first heading in a container has no space above.

- Base size is **14px** (`--font-size-100`, line-height 20px). Scale ratio 1.125.
- Headings: **semibold**. Body: **regular**, with semibold for emphasis. No bold/700 unless a design specifies it.
- Pick heading level by information hierarchy (page title > section title > panel title > row label), not by how big you want it. Do not jump to an oversized heading to create space; use layout spacing.
- Secondary text (helper, metadata, captions) uses a smaller step (`-75`, `-50`) or reduced color alpha, not both beyond the opacity floors. Text alpha never below 0.72 (placeholder 0.64, disabled 0.4).
- Line heights stay on the 4px grid; use the `--line-height-*` token that pairs with the font-size step.
- Collapsing margins: set spacing in one direction only. For product UI prefer explicit layout spacing over text margins.
- Sentence case everywhere (see `writing.md`).
