import { describe, expect, it, vi } from 'vitest';
import { act } from 'react';
import { click, focus, getByRole, keyDown, render } from '@/test-utils/render';
import Icon from '@/components/Icon/Icon';
import SegmentedControl from './SegmentedControl';
import type { SegmentedControlOption } from './SegmentedControl';

const OPTIONS: SegmentedControlOption[] = [
  { key: 'channels', label: 'Channels' },
  {
    key: 'files',
    label: 'Files',
    disabled: true,
    title: 'Files search is unavailable',
  },
  { key: 'people', label: 'People' },
];

function renderControl(
  onChange = vi.fn(),
  value = 'channels',
  role?: 'tablist' | 'radiogroup',
) {
  render(
    <SegmentedControl
      aria-label="Search mode"
      options={OPTIONS}
      value={value}
      onChange={onChange}
      role={role}
    />,
  );
  return onChange;
}

describe('SegmentedControl tabs', () => {
  it('renders a tablist and marks the selected segment', () => {
    renderControl();
    const list = getByRole('tablist', 'Search mode');
    expect(list.getAttribute('aria-orientation')).toBe('horizontal');
    const channels = getByRole('tab', 'Channels');
    expect(channels.getAttribute('aria-selected')).toBe('true');
    expect(channels.tabIndex).toBe(0);
    expect(getByRole('tab', 'People').getAttribute('aria-selected')).toBe(
      'false',
    );
    expect(getByRole('tab', 'People').tabIndex).toBe(-1);
    expect(channels.hasAttribute('aria-checked')).toBe(false);
  });

  it('selects a segment on click', () => {
    const onChange = renderControl();
    click(getByRole('tab', 'People'));
    expect(onChange).toHaveBeenCalledWith('people');
  });

  it('moves focus with arrows, Home, and End without selecting', () => {
    const onChange = renderControl();
    const channels = getByRole('tab', 'Channels');
    const people = getByRole('tab', 'People');
    focus(channels);

    keyDown(channels, 'ArrowRight');
    expect(document.activeElement).toBe(people);
    expect(onChange).not.toHaveBeenCalled();

    keyDown(people, 'ArrowLeft');
    expect(document.activeElement).toBe(channels);

    keyDown(channels, 'ArrowLeft');
    expect(document.activeElement).toBe(people);

    keyDown(people, 'Home');
    expect(document.activeElement).toBe(channels);

    keyDown(channels, 'End');
    expect(document.activeElement).toBe(people);
    expect(onChange).not.toHaveBeenCalled();
  });

  it('selects the focused segment with Enter and Space', () => {
    const onChange = renderControl();
    const people = getByRole('tab', 'People');
    focus(people);
    keyDown(people, 'Enter');
    expect(onChange).toHaveBeenCalledWith('people');
    keyDown(people, ' ');
    expect(onChange).toHaveBeenCalledTimes(2);
  });

  it('links a tab to its panel', () => {
    render(
      <SegmentedControl
        aria-label="Search mode"
        options={[
          {
            key: 'messages',
            label: 'Messages',
            id: 'tab-messages',
            panelId: 'panel-messages',
          },
        ]}
        value="messages"
        onChange={vi.fn()}
      />,
    );
    const tab = getByRole('tab', 'Messages');
    expect(tab.id).toBe('tab-messages');
    expect(tab.getAttribute('aria-controls')).toBe('panel-messages');
  });
});

describe('SegmentedControl radiogroup', () => {
  it('renders radios and selects with arrow keys', () => {
    const onChange = renderControl(vi.fn(), 'channels', 'radiogroup');
    const list = getByRole('radiogroup', 'Search mode');
    expect(list.getAttribute('role')).toBe('radiogroup');
    const channels = getByRole('radio', 'Channels');
    const people = getByRole('radio', 'People');
    expect(channels.getAttribute('aria-checked')).toBe('true');
    expect(channels.hasAttribute('aria-selected')).toBe(false);
    focus(channels);
    keyDown(channels, 'ArrowDown');
    expect(document.activeElement).toBe(people);
    expect(onChange).toHaveBeenCalledWith('people');
  });

  it('does not expose a panel id on a radio', () => {
    render(
      <SegmentedControl
        aria-label="Density"
        role="radiogroup"
        options={[
          { key: 'day', label: 'Day', panelId: 'ignored' },
          { key: 'week', label: 'Week' },
        ]}
        value="day"
        onChange={vi.fn()}
      />,
    );
    expect(getByRole('radio', 'Day').hasAttribute('aria-controls')).toBe(false);
  });
});

describe('SegmentedControl disabled', () => {
  it('marks the disabled segment and skips it', () => {
    renderControl();
    const files = getByRole('tab', 'Files');
    expect(files.getAttribute('aria-disabled')).toBe('true');
    expect(files.getAttribute('title')).toBe('Files search is unavailable');
    expect(files.tabIndex).toBe(-1);
    expect(getByRole('tab', 'Channels').hasAttribute('aria-disabled')).toBe(
      false,
    );
  });

  it('ignores clicks and Enter on a disabled segment', () => {
    const onChange = renderControl();
    click(getByRole('tab', 'Files'));
    keyDown(getByRole('tab', 'Files'), 'Enter');
    keyDown(getByRole('tab', 'Files'), ' ');
    expect(onChange).not.toHaveBeenCalled();
  });

  it('does not take focus when a disabled segment is pressed', () => {
    renderControl();
    const mousedown = new MouseEvent('mousedown', {
      bubbles: true,
      cancelable: true,
    });
    act(() => {
      getByRole('tab', 'Files').dispatchEvent(mousedown);
    });
    expect(mousedown.defaultPrevented).toBe(true);
  });

  it('keeps every segment out of the tab sequence when all are disabled', () => {
    const { container } = render(
      <SegmentedControl
        aria-label="Search mode"
        options={OPTIONS.map((option) => ({ ...option, disabled: true }))}
        value="channels"
        onChange={vi.fn()}
      />,
    );
    const tabs = container.querySelectorAll<HTMLButtonElement>('[role="tab"]');
    expect(Array.from(tabs, (tab) => tab.tabIndex)).toEqual([-1, -1, -1]);
  });

  it('keeps a disabled selected segment out of the tab sequence', () => {
    renderControl(vi.fn(), 'files');
    expect(getByRole('tab', 'Files').tabIndex).toBe(-1);
    expect(getByRole('tab', 'Channels').tabIndex).toBe(0);
  });
});

describe('SegmentedControl indicator', () => {
  function stubBox(
    el: HTMLElement,
    box: { x: number; y: number; width: number; height: number },
  ) {
    Object.defineProperties(el, {
      offsetLeft: { configurable: true, get: () => box.x },
      offsetTop: { configurable: true, get: () => box.y },
      offsetWidth: { configurable: true, get: () => box.width },
      offsetHeight: { configurable: true, get: () => box.height },
    });
  }

  it('slides the surface to the selected segment', () => {
    const { rerender } = render(
      <SegmentedControl
        aria-label="Search mode"
        options={OPTIONS}
        value="channels"
        onChange={vi.fn()}
      />,
    );
    const channels = getByRole('tab', 'Channels');
    const people = getByRole('tab', 'People');
    stubBox(channels, { x: 4, y: 4, width: 72, height: 24 });
    stubBox(people, { x: 96, y: 4, width: 64, height: 24 });

    rerender(
      <SegmentedControl
        aria-label="Search mode"
        options={OPTIONS}
        value="people"
        onChange={vi.fn()}
      />,
    );

    const indicator = document.querySelector('[aria-hidden="true"]');
    expect(indicator).not.toBeNull();
    expect(indicator?.getAttribute('style')).toContain('translate(96px, 4px)');
    expect(indicator?.getAttribute('style')).toContain('width: 64px');
  });
});

describe('SegmentedControl options', () => {
  it('renders a leading icon and lets buttonProps veto selection', () => {
    const onChange = vi.fn();
    const { container } = render(
      <SegmentedControl
        aria-label="Search mode"
        options={[
          {
            key: 'channels',
            label: 'Channels',
            icon: <Icon glyph={null} />,
            buttonProps: {
              onClick: (event) => event.preventDefault(),
            },
          },
        ]}
        value="channels"
        onChange={onChange}
      />,
    );
    expect(container.querySelector('[class*="icon"]')).not.toBeNull();
    click(getByRole('tab', 'Channels'));
    expect(onChange).not.toHaveBeenCalled();
  });
});
