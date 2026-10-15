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

describe('Select menuItemProps', () => {
  const CHANNELS = [
    { value: 'ts', label: 'Town Square', secondaryLabel: 'Engineering' },
    { value: 'ot', label: 'Off-Topic', secondaryLabel: 'Design' },
  ];

  function rows() {
    return Array.from(document.querySelectorAll('[role="option"]'));
  }

  function span(row: Element, text: string) {
    return Array.from(row.querySelectorAll('span')).find(
      (s) => s.textContent === text,
    ) as HTMLElement;
  }

  function isInline(row: Element, label: string, secondary: string) {
    return (
      span(row, label).parentElement === span(row, secondary).parentElement
    );
  }

  function open() {
    keyDown(getByRole('combobox'), 'ArrowDown');
  }

  it('renders secondary labels below by default', () => {
    render(<Select aria-label="Channel" options={CHANNELS} />);
    open();
    expect(isInline(rows()[0], 'Town Square', 'Engineering')).toBe(false);
  });

  it('applies menuItemProps to every option row', () => {
    render(
      <Select
        aria-label="Channel"
        options={CHANNELS}
        menuItemProps={{ secondaryLabelPosition: 'inline' }}
      />,
    );
    open();
    expect(isInline(rows()[0], 'Town Square', 'Engineering')).toBe(true);
    expect(isInline(rows()[1], 'Off-Topic', 'Design')).toBe(true);
  });

  it('lets an option override the Select menuItemProps and merges className', () => {
    render(
      <Select
        aria-label="Channel"
        menuItemProps={{ secondaryLabelPosition: 'inline', className: 'all' }}
        options={[
          CHANNELS[0],
          {
            ...CHANNELS[1],
            menuItemProps: {
              secondaryLabelPosition: 'below',
              className: 'one',
            },
          },
        ]}
      />,
    );
    open();
    expect(isInline(rows()[0], 'Town Square', 'Engineering')).toBe(true);
    expect(isInline(rows()[1], 'Off-Topic', 'Design')).toBe(false);
    expect(rows()[1].classList.contains('all')).toBe(true);
    expect(rows()[1].classList.contains('one')).toBe(true);
  });

  it('keeps the props Select owns when menuItemProps tries to set them', () => {
    render(
      <Select
        aria-label="Channel"
        options={CHANNELS}
        menuItemProps={{ role: 'button', 'aria-selected': true } as never}
      />,
    );
    open();
    expect(rows()).toHaveLength(2);
    expect(rows()[0].getAttribute('aria-selected')).toBe('false');
  });
});
