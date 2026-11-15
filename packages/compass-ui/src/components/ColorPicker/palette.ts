export interface ColorPickerOption {
  /** Hex color (`#RRGGBB` or `#RGB`). Data — also the value passed to `onChange`. */
  value: string;
  /**
   * Accessible name of the swatch (e.g. "Blue"). Pass translated strings;
   * a string because it becomes the radio's `aria-label` and `title`.
   */
  label: string;
  /** Disables this swatch only. */
  disabled?: boolean;
}

/**
 * Default palette: nine named colors. English `label`s — pass your own
 * `colors` to translate or change the set.
 */
export const COLOR_PICKER_DEFAULT_COLORS: ColorPickerOption[] = [
  { value: '#1C58D9', label: 'Blue' },
  { value: '#7F57D6', label: 'Purple' },
  { value: '#D6409F', label: 'Pink' },
  { value: '#D24B4E', label: 'Red' },
  { value: '#E5622B', label: 'Orange' },
  { value: '#C99A07', label: 'Yellow' },
  { value: '#2F9E5B', label: 'Green' },
  { value: '#1A9CA6', label: 'Teal' },
  { value: '#6B7280', label: 'Gray' },
];
