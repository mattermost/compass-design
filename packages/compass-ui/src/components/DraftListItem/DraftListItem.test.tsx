import { describe, expect, it, vi } from 'vitest';
import { click, render } from '@/test-utils/render';
import DraftListItem from './DraftListItem';

const base = {
  destination: 'town-square',
  previewText: 'Draft preview text',
} as const;

describe('DraftListItem', () => {
  it('renders destination, preview and timestamp', () => {
    const { container } = render(
      <DraftListItem {...base} timestamp="5 mins ago" />,
    );
    expect(container.textContent).toContain('town-square');
    expect(container.textContent).toContain('Draft preview text');
    expect(container.textContent).toContain('5 mins ago');
  });

  it('shows status tags only for scheduled and failed rows', () => {
    const { container, rerender } = render(<DraftListItem {...base} />);
    expect(container.textContent).not.toContain('Scheduled');
    rerender(<DraftListItem {...base} status="scheduled" />);
    expect(container.textContent).toContain('Scheduled');
    rerender(
      <DraftListItem
        {...base}
        status="failed"
        errorMessage="Channel was archived"
      />,
    );
    expect(container.textContent).toContain('Failed to send');
    expect(container.textContent).toContain('Channel was archived');
  });

  it('hides the error message unless the row failed', () => {
    const { container } = render(
      <DraftListItem {...base} errorMessage="Nope" />,
    );
    expect(container.textContent).not.toContain('Nope');
  });

  it('opens on click and Enter/Space, but not from nested buttons', () => {
    const onClick = vi.fn();
    const onDelete = vi.fn();
    const { container } = render(
      <DraftListItem {...base} onClick={onClick} onDelete={onDelete} />,
    );
    const main = container.querySelector<HTMLElement>('[role="button"]')!;
    click(main);
    expect(onClick).toHaveBeenCalledTimes(1);
    main.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }),
    );
    expect(onClick).toHaveBeenCalledTimes(2);
    click(container.querySelector('button[aria-label="Delete"]')!);
    expect(onDelete).toHaveBeenCalledTimes(1);
    expect(onClick).toHaveBeenCalledTimes(2);
  });

  it('renders only the actions that have handlers', () => {
    const { container } = render(
      <DraftListItem {...base} onEdit={() => {}} onSend={() => {}} />,
    );
    const names = [...container.querySelectorAll('button')].map((b) =>
      b.getAttribute('aria-label'),
    );
    expect(names).toEqual(['Edit', 'Send now']);
  });

  it('is not a button when there is no onClick', () => {
    const { container } = render(<DraftListItem {...base} />);
    expect(container.querySelector('[role="button"]')).toBeNull();
  });

  it('applies translated labels and button props', () => {
    const { container } = render(
      <DraftListItem
        {...base}
        onDelete={() => {}}
        deleteLabel="Supprimer"
        deleteButtonProps={{ 'data-testid': 'del' }}
      />,
    );
    const btn = container.querySelector('[data-testid="del"]')!;
    expect(btn.getAttribute('aria-label')).toBe('Supprimer');
  });
});
