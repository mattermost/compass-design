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

  it('shows checked-by only when the task is closed', () => {
    const { container, rerender } = render(
      <ChecklistItem
        item={{
          ...baseItem,
          state: 'closed',
          checkedBy: { name: 'Aiko Tan' },
        }}
      />,
    );
    expect(container.textContent).toContain('Aiko Tan');
    rerender(
      <ChecklistItem
        item={{
          ...baseItem,
          state: 'open',
          checkedBy: { name: 'Aiko Tan' },
        }}
      />,
    );
    expect(container.textContent).not.toContain('Aiko Tan');
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

  it('shows a hover actions toolbar when action callbacks are provided', () => {
    const onEdit = vi.fn();
    const onAssign = vi.fn();
    const { container } = render(
      <ChecklistItem
        item={baseItem}
        onEdit={onEdit}
        onAssign={onAssign}
        onDueDate={() => undefined}
        onDuplicate={() => undefined}
        onDelete={() => undefined}
        onStateChange={() => undefined}
      />,
    );
    const toolbar = container.querySelector('[role="toolbar"]');
    expect(toolbar).toBeTruthy();
    expect(toolbar?.getAttribute('aria-label')).toBe('Task actions');
    const edit = toolbar?.querySelector(
      'button[aria-label="Edit"]',
    ) as HTMLButtonElement;
    expect(edit).toBeTruthy();
    click(edit);
    expect(onEdit).toHaveBeenCalled();
  });

  it('hides the actions toolbar when readOnly', () => {
    const { container } = render(
      <ChecklistItem
        item={baseItem}
        readOnly
        onEdit={() => undefined}
        onAssign={() => undefined}
      />,
    );
    expect(container.querySelector('[role="toolbar"]')).toBeNull();
  });
});
