import { describe, expect, it, vi } from 'vitest';
import { click, render } from '@/test-utils/render';
import ChecklistItem from './ChecklistItem';
import type { ChecklistItemData } from './ChecklistItem';

const baseItem: ChecklistItemData = {
  id: '1',
  title: 'Page security on-call',
  state: 'open',
};

describe('ChecklistItem', () => {
  it('renders the title and toggles open/closed through onStateChange', () => {
    const onStateChange = vi.fn();
    const { container, rerender } = render(
      <ChecklistItem item={baseItem} onStateChange={onStateChange} />,
    );
    expect(container.textContent).toContain('Page security on-call');
    const checkbox = container.querySelector(
      'input[type="checkbox"]',
    ) as HTMLInputElement;
    expect(checkbox.checked).toBe(false);
    click(checkbox);
    expect(onStateChange).toHaveBeenCalledWith('closed');

    rerender(
      <ChecklistItem
        item={{ ...baseItem, state: 'closed' }}
        onStateChange={onStateChange}
      />,
    );
    expect(
      (container.querySelector('input[type="checkbox"]') as HTMLInputElement)
        .checked,
    ).toBe(true);
  });

  it('shows meta chips for assignee, due date and command', () => {
    const { container } = render(
      <ChecklistItem
        item={{
          ...baseItem,
          assignee: { name: 'Leonard Riley' },
          dueDate: 'Tomorrow',
          command: '/zoom start',
        }}
      />,
    );
    expect(container.textContent).toContain('Leonard Riley');
    expect(container.textContent).toContain('Tomorrow');
    expect(container.textContent).toContain('/zoom start');
  });

  it('passes rest attributes and className to the root', () => {
    const { container } = render(
      <ChecklistItem item={baseItem} data-testid="task" className="host" />,
    );
    const root = container.firstElementChild as HTMLElement;
    expect(root.getAttribute('data-testid')).toBe('task');
    expect(root.className).toContain('host');
  });

  it('keeps the checkbox control from stretching across the row', () => {
    const { container } = render(<ChecklistItem item={baseItem} />);
    const checkbox = container.querySelector('label');
    expect(checkbox?.className).toMatch(/checklist-item__checkbox/);
  });

  it('renders edit fields when editing', () => {
    const onSave = vi.fn();
    const { container } = render(
      <ChecklistItem
        item={{ ...baseItem, title: 'Draft task' }}
        editing
        onSave={onSave}
      />,
    );
    expect(
      container.querySelector('input[placeholder="Task name"]'),
    ).toBeTruthy();
    const save = Array.from(container.querySelectorAll('button')).find(
      (b) => b.textContent === 'Save',
    );
    expect(save).toBeTruthy();
    click(save!);
    expect(onSave).toHaveBeenCalled();
  });
});
