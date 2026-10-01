import { describe, expect, it, vi } from 'vitest';
import { act } from 'react';
import { click, focus, getByRole, keyDown, render } from '@/test-utils/render';
import Tabs from './Tabs';
import type { TabItem } from './Tabs';

const TABS: TabItem[] = [
  { key: 'general', label: 'General' },
  {
    key: 'mcps',
    label: 'MCPs',
    disabled: true,
    title: 'Enable tools to configure MCPs',
  },
  { key: 'access', label: 'Access' },
];

function renderTabs(onChange = vi.fn(), activeKey = 'general') {
  render(<Tabs tabs={TABS} activeKey={activeKey} onChange={onChange} />);
  return onChange;
}

describe('Tabs disabled', () => {
  it('marks the disabled tab with aria-disabled and its title', () => {
    renderTabs();
    const tab = getByRole('tab', 'MCPs');
    expect(tab.getAttribute('aria-disabled')).toBe('true');
    expect(tab.getAttribute('title')).toBe('Enable tools to configure MCPs');
    expect(getByRole('tab', 'General').hasAttribute('aria-disabled')).toBe(
      false,
    );
  });

  it('ignores clicks on a disabled tab', () => {
    const onChange = renderTabs();
    click(getByRole('tab', 'MCPs'));
    expect(onChange).not.toHaveBeenCalled();
    click(getByRole('tab', 'Access'));
    expect(onChange).toHaveBeenCalledWith('access');
  });

  it('skips disabled tabs with arrow keys, Home and End', () => {
    renderTabs();
    const general = getByRole('tab', 'General');
    const access = getByRole('tab', 'Access');
    focus(general);

    keyDown(general, 'ArrowRight');
    expect(document.activeElement).toBe(access);

    keyDown(access, 'ArrowLeft');
    expect(document.activeElement).toBe(general);

    keyDown(general, 'ArrowLeft');
    expect(document.activeElement).toBe(access);

    keyDown(access, 'Home');
    expect(document.activeElement).toBe(general);

    keyDown(general, 'End');
    expect(document.activeElement).toBe(access);
  });

  it('does not take focus when a disabled tab is pressed', () => {
    renderTabs();
    const mousedown = new MouseEvent('mousedown', {
      bubbles: true,
      cancelable: true,
    });
    act(() => {
      getByRole('tab', 'MCPs').dispatchEvent(mousedown);
    });
    expect(mousedown.defaultPrevented).toBe(true);
  });

  it('does not activate a disabled tab with Enter or Space', () => {
    const onChange = renderTabs();
    const mcps = getByRole('tab', 'MCPs');
    keyDown(mcps, 'Enter');
    keyDown(mcps, ' ');
    expect(onChange).not.toHaveBeenCalled();
  });

  it('keeps every tab out of the tab sequence when all tabs are disabled', () => {
    const { container } = render(
      <Tabs
        tabs={TABS.map((tab) => ({ ...tab, disabled: true }))}
        activeKey="general"
        onChange={vi.fn()}
      />,
    );
    const tabs = container.querySelectorAll<HTMLButtonElement>('[role="tab"]');
    expect(Array.from(tabs, (tab) => tab.tabIndex)).toEqual([-1, -1, -1]);
  });

  it('keeps disabled tabs out of the tab sequence', () => {
    renderTabs(vi.fn(), 'mcps');
    expect(getByRole('tab', 'MCPs').tabIndex).toBe(-1);
    expect(getByRole('tab', 'General').tabIndex).toBe(0);
  });
});
