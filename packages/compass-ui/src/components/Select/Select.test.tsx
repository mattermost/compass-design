import { describe, expect, it } from 'vitest';
import {
  getByRole,
  keyDown,
  render,
  withoutScrollIntoView,
} from '@/test-utils/render';
import Select from './Select';

const OPTIONS = [
  { value: 'a', label: 'Alpha' },
  { value: 'b', label: 'Beta' },
  { value: 'c', label: 'Gamma' },
];

describe('Select without scrollIntoView', () => {
  withoutScrollIntoView();

  it('opens and moves the highlight with the arrow keys', () => {
    render(<Select aria-label="Letter" options={OPTIONS} />);
    const trigger = getByRole('combobox');
    expect('scrollIntoView' in trigger).toBe(false);

    keyDown(trigger, 'ArrowDown');
    expect(trigger.getAttribute('aria-expanded')).toBe('true');
    const first = trigger.getAttribute('aria-activedescendant');
    expect(first).toBeTruthy();

    keyDown(trigger, 'ArrowDown');
    const second = trigger.getAttribute('aria-activedescendant');
    expect(second).toBeTruthy();
    expect(second).not.toBe(first);

    keyDown(trigger, 'ArrowUp');
    expect(trigger.getAttribute('aria-activedescendant')).toBe(first);
  });
});
