import { describe, expect, it, vi } from 'vitest';
import { click, getByRole, queryAllByRole, render } from '@/test-utils/render';
import DateRangePicker from './DateRangePicker';

const trigger = () => getByRole('combobox');
const clearButtons = () => queryAllByRole('button', 'Clear');

describe('DateRangePicker opens on the selected month', () => {
  it('single mode: month of the selected date', () => {
    render(<DateRangePicker value="2031-03-15" />);
    click(trigger());
    expect(getByRole('grid', 'March 2031')).toBeTruthy();
  });

  it('range mode: month of the range start', () => {
    render(
      <DateRangePicker
        mode="range"
        startDate="2030-11-20"
        endDate="2031-01-04"
      />,
    );
    click(trigger());
    expect(getByRole('grid', 'November 2030')).toBeTruthy();
  });

  it('returns to the selected month after browsing away and reopening', () => {
    render(<DateRangePicker value="2031-03-15" />);
    click(trigger());
    click(getByRole('button', 'Next month'));
    expect(getByRole('grid', 'April 2031')).toBeTruthy();
    click(trigger()); // close
    click(trigger()); // reopen
    expect(getByRole('grid', 'March 2031')).toBeTruthy();
  });
});

describe('DateRangePicker clearable', () => {
  it('renders no clear button by default', () => {
    render(<DateRangePicker value="2031-03-15" />);
    expect(clearButtons()).toHaveLength(0);
  });

  it('hides the clear button while empty or disabled', () => {
    const { rerender } = render(<DateRangePicker clearable />);
    expect(clearButtons()).toHaveLength(0);
    rerender(<DateRangePicker clearable disabled value="2031-03-15" />);
    expect(clearButtons()).toHaveLength(0);
  });

  it('single mode calls onChange("") and leaves the calendar closed', () => {
    const onChange = vi.fn();
    render(
      <DateRangePicker clearable value="2031-03-15" onChange={onChange} />,
    );
    click(getByRole('button', 'Clear'));
    expect(onChange).toHaveBeenCalledWith('');
    expect(trigger().getAttribute('aria-expanded')).toBe('false');
  });

  it('range mode calls onRangeChange("", "")', () => {
    const onRangeChange = vi.fn();
    render(
      <DateRangePicker
        clearable
        mode="range"
        startDate="2031-03-15"
        endDate="2031-03-20"
        onRangeChange={onRangeChange}
      />,
    );
    click(getByRole('button', 'Clear'));
    expect(onRangeChange).toHaveBeenCalledWith('', '');
  });

  it('empties an uncontrolled field and removes the button', () => {
    render(<DateRangePicker clearable placeholder="Pick a date" />);
    click(trigger());
    click(document.querySelector<HTMLElement>('[data-day="10"]')!);
    expect(clearButtons()).toHaveLength(1);
    click(getByRole('button', 'Clear'));
    expect(clearButtons()).toHaveLength(0);
    expect(document.body.textContent).toContain('Pick a date');
  });

  it('uses clearLabel and clearButtonProps', () => {
    render(
      <DateRangePicker
        clearable
        value="2031-03-15"
        clearLabel="Effacer"
        clearButtonProps={{ 'data-testid': 'clear' } as never}
      />,
    );
    expect(getByRole('button', 'Effacer')).toBeTruthy();
    expect(document.querySelector('[data-testid="clear"]')).toBeTruthy();
  });
});
