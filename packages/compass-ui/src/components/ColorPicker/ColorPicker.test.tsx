import { describe, expect, it, vi } from 'vitest';
import {
  blur,
  click,
  focus,
  getByRole,
  render,
  type,
} from '@/test-utils/render';
import ColorPicker, { COLOR_PICKER_DEFAULT_COLORS } from './ColorPicker';
import { contrastingTone, normalizeHex } from './colorUtils';

const colors = [
  { value: '#1C58D9', label: 'Blue' },
  { value: '#D24B4E', label: 'Red', disabled: true },
  { value: '#FFFF00', label: 'Yellow' },
];

function radios(container: HTMLElement) {
  return Array.from(
    container.querySelectorAll<HTMLInputElement>('input[type="radio"]'),
  );
}

describe('ColorPicker', () => {
  it('renders a named radiogroup with one named radio per swatch', () => {
    const { container } = render(
      <ColorPicker aria-label="Label color" colors={colors} />,
    );
    expect(getByRole('radiogroup', 'Label color')).toBeTruthy();
    expect(radios(container).map((r) => r.getAttribute('aria-label'))).toEqual([
      'Blue',
      'Red',
      'Yellow',
    ]);
    const names = new Set(radios(container).map((r) => r.name));
    expect(names.size).toBe(1);
  });

  it('ships a nine-color default palette', () => {
    const { container } = render(<ColorPicker aria-label="C" />);
    expect(radios(container)).toHaveLength(COLOR_PICKER_DEFAULT_COLORS.length);
    expect(COLOR_PICKER_DEFAULT_COLORS).toHaveLength(9);
  });

  it('selects uncontrolled and calls onChange with the swatch value', () => {
    const onChange = vi.fn();
    const { container } = render(
      <ColorPicker aria-label="C" colors={colors} onChange={onChange} />,
    );
    click(radios(container)[2]!);
    expect(onChange).toHaveBeenCalledWith('#FFFF00');
    expect(radios(container)[2]!.checked).toBe(true);
  });

  it('is controlled by value (case-insensitive, shorthand-aware)', () => {
    const { container } = render(
      <ColorPicker aria-label="C" colors={colors} value="#1c58d9" />,
    );
    expect(radios(container)[0]!.checked).toBe(true);
    click(radios(container)[2]!);
    expect(radios(container)[2]!.checked).toBe(false);
  });

  it('disables a single swatch or the whole group', () => {
    const onChange = vi.fn();
    const { container, rerender } = render(
      <ColorPicker aria-label="C" colors={colors} onChange={onChange} />,
    );
    expect(radios(container)[1]!.disabled).toBe(true);
    click(radios(container)[1]!);
    expect(onChange).not.toHaveBeenCalled();
    rerender(<ColorPicker aria-label="C" colors={colors} disabled />);
    expect(radios(container).every((r) => r.disabled)).toBe(true);
  });

  it('shows the selection mark only on the selected swatch', () => {
    const { container } = render(
      <ColorPicker aria-label="C" colors={colors} defaultValue="#FFFF00" />,
    );
    const marks = container.querySelectorAll('svg');
    expect(marks).toHaveLength(1);
    expect(marks[0]!.closest('label')!.className).toContain('tone-dark');
  });

  describe('hex input', () => {
    function setup(props = {}) {
      const onChange = vi.fn();
      const view = render(
        <ColorPicker
          aria-label="C"
          colors={colors}
          showHexInput
          onChange={onChange}
          {...props}
        />,
      );
      const input = view.container.querySelector<HTMLInputElement>(
        'input:not([type="radio"])',
      )!;
      return { onChange, input, ...view };
    }

    it('labels the field with the English default', () => {
      const { container } = setup();
      expect(container.textContent).toContain('Hex color');
    });

    it('is hidden by default', () => {
      const { container } = render(<ColorPicker aria-label="C" />);
      expect(container.querySelector('input:not([type="radio"])')).toBeNull();
    });

    it('commits a complete 6-digit hex while typing, normalized', () => {
      const { onChange, input } = setup();
      type(input, '#12ab');
      expect(onChange).not.toHaveBeenCalled();
      type(input, '#12abef');
      expect(onChange).toHaveBeenCalledWith('#12ABEF');
    });

    it('commits 3-digit shorthand on blur, expanded', () => {
      const { onChange, input } = setup();
      type(input, 'fa0');
      expect(onChange).not.toHaveBeenCalled();
      focus(input);
      blur(input);
      expect(onChange).toHaveBeenCalledWith('#FFAA00');
    });

    it('shows an error on blur for an invalid value and does not commit', () => {
      const { onChange, input, container } = setup();
      type(input, '#zzz');
      focus(input);
      blur(input);
      expect(onChange).not.toHaveBeenCalled();
      expect(input.getAttribute('aria-invalid')).toBe('true');
      expect(container.textContent).toContain('valid hex color');
    });

    it('accepts translated labels and messages', () => {
      const { container } = setup({
        hexInputLabel: <span data-testid="msg">Couleur</span>,
        invalidHexMessage: <span data-testid="msg2">Invalide</span>,
      });
      expect(container.querySelector('[data-testid="msg"]')).toBeTruthy();
      const input = container.querySelector<HTMLInputElement>(
        'input:not([type="radio"])',
      )!;
      type(input, 'x');
      focus(input);
      blur(input);
      expect(container.querySelector('[data-testid="msg2"]')).toBeTruthy();
    });

    it('mirrors a custom controlled value that is not in the palette', () => {
      const { input, container } = setup({ value: '#123456' });
      expect(input.value).toBe('#123456');
      expect(radios(container).some((r) => r.checked)).toBe(false);
    });

    it('selecting a swatch clears an in-progress draft', () => {
      const { input, container } = setup();
      type(input, '#12');
      click(radios(container)[0]!);
      expect(input.value).toBe('#1C58D9');
    });
  });
});

describe('colorUtils', () => {
  it('normalizes hex', () => {
    expect(normalizeHex('abc')).toBe('#AABBCC');
    expect(normalizeHex(' #aabbcc ')).toBe('#AABBCC');
    expect(normalizeHex('#abcd')).toBeNull();
    expect(normalizeHex('nope')).toBeNull();
  });

  it('picks the legible mark tone by WCAG contrast', () => {
    expect(contrastingTone('#FFFFFF')).toBe('dark');
    expect(contrastingTone('#FFFF00')).toBe('dark');
    expect(contrastingTone('#000000')).toBe('light');
    expect(contrastingTone('#1C58D9')).toBe('light');
  });
});

describe('ColorPicker ref', () => {
  it('forwards the ref to the radiogroup root', () => {
    const ref = { current: null as HTMLDivElement | null };
    render(<ColorPicker ref={ref} aria-label="C" />);
    expect(ref.current?.getAttribute('role')).toBe('radiogroup');
  });
});
