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

  it('renders inline editable title and description when editing', () => {
    const onSave = vi.fn();
    const { container } = render(
      <ChecklistItem
        item={{ ...baseItem, title: 'Draft task' }}
        editing
        onSave={onSave}
      />,
    );
    const fields = container.querySelectorAll('[role="textbox"]');
    expect(fields).toHaveLength(2);
    expect(fields[0].getAttribute('contenteditable')).toBe('true');
    expect(fields[0].textContent).toBe('Draft task');
    fields[0].dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }),
    );
    expect(onSave).toHaveBeenCalled();
  });

  it('skips focusing the title when focusOnEdit is false', () => {
    const { container } = render(
      <ChecklistItem
        item={{ ...baseItem, title: 'Draft task' }}
        editing
        focusOnEdit={false}
      />,
    );
    const title = container.querySelector('[role="textbox"]') as HTMLElement;
    expect(title.textContent).toBe('Draft task');
    expect(document.activeElement).not.toBe(title);
  });

  it('reseeds empty draft text while staying focused after save', () => {
    const { container, rerender } = render(
      <ChecklistItem
        item={{ ...baseItem, title: 'Draft task', description: 'Notes' }}
        editing
        focusOnEdit={false}
      />,
    );
    const title = container.querySelector('[role="textbox"]') as HTMLElement;
    title.focus();
    expect(document.activeElement).toBe(title);

    rerender(
      <ChecklistItem
        item={{ ...baseItem, title: '', description: '' }}
        editing
        focusOnEdit={false}
      />,
    );
    expect(title.textContent).toBe('');
    expect(document.activeElement).toBe(title);
  });

  it('does not save on Enter while an IME composition is active', () => {
    const onSave = vi.fn();
    const { container } = render(
      <ChecklistItem
        item={{ ...baseItem, title: '下' }}
        editing
        onSave={onSave}
      />,
    );
    const title = container.querySelector('[role="textbox"]') as HTMLElement;
    title.dispatchEvent(
      new KeyboardEvent('keydown', {
        key: 'Enter',
        bubbles: true,
        // jsdom KeyboardEventInit supports isComposing in modern browsers.
        ...({ isComposing: true } as KeyboardEventInit),
      }),
    );
    expect(onSave).not.toHaveBeenCalled();
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
