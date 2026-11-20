import { describe, expect, it, vi } from 'vitest';
import { click, render } from '@/test-utils/render';
import CollapsibleChecklist from './CollapsibleChecklist';
import type { ChecklistItemData } from '../ChecklistItem/ChecklistItem';

const items: ChecklistItemData[] = [
  { id: '1', title: 'Declare incident', state: 'closed' },
  { id: '2', title: 'Page on-call', state: 'open' },
  { id: '3', title: 'Skip me', state: 'skipped' },
];

describe('CollapsibleChecklist', () => {
  it('shows title, done count and progress from non-skipped items', () => {
    const { container } = render(
      <CollapsibleChecklist title="Triage" defaultItems={items} />,
    );
    expect(container.textContent).toContain('Triage');
    expect(container.textContent).toContain('1 / 2 done');
    expect(
      container
        .querySelector('[role="progressbar"]')
        ?.getAttribute('aria-valuenow'),
    ).toBe('50');
  });

  it('collapses and expands the body', () => {
    const onCollapsedChange = vi.fn();
    const { container } = render(
      <CollapsibleChecklist
        title="Triage"
        defaultItems={items}
        onCollapsedChange={onCollapsedChange}
      />,
    );
    const toggle = container.querySelector(
      'button[aria-expanded]',
    ) as HTMLButtonElement;
    expect(toggle.getAttribute('aria-expanded')).toBe('true');
    click(toggle);
    expect(onCollapsedChange).toHaveBeenCalledWith(true);
  });

  it('toggles a task through onItemsChange', () => {
    const onItemsChange = vi.fn();
    const { container } = render(
      <CollapsibleChecklist
        title="Triage"
        items={items}
        onItemsChange={onItemsChange}
      />,
    );
    const checkboxes = container.querySelectorAll('input[type="checkbox"]');
    click(checkboxes[1]);
    expect(onItemsChange).toHaveBeenCalled();
    const next = onItemsChange.mock.calls[0][0] as ChecklistItemData[];
    expect(next[1].state).toBe('closed');
  });

  it('starts adding a task from the add row', () => {
    const { container } = render(
      <CollapsibleChecklist title="Triage" defaultItems={items} />,
    );
    const add = Array.from(container.querySelectorAll('button')).find(
      (b) => b.textContent?.includes('Add a task'),
    );
    expect(add).toBeTruthy();
    click(add!);
    expect(
      container.querySelector('input[placeholder="Task name"]'),
    ).toBeTruthy();
  });

  it('passes rest attributes to the root', () => {
    const { container } = render(
      <CollapsibleChecklist
        title="Triage"
        defaultItems={[]}
        data-testid="section"
        className="host"
      />,
    );
    const root = container.firstElementChild as HTMLElement;
    expect(root.getAttribute('data-testid')).toBe('section');
    expect(root.className).toContain('host');
  });
});
