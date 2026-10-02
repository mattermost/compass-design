import { describe, expect, it, vi } from 'vitest';
import { click, getByRole, render } from '@/test-utils/render';
import SectionNotice from './SectionNotice';

function renderNotice(props: Partial<Parameters<typeof SectionNotice>[0]>) {
  const onPrimary = vi.fn();
  const onSecondary = vi.fn();
  render(
    <SectionNotice
      title="Index out of date"
      primaryButtonLabel="Reindex"
      onPrimaryAction={onPrimary}
      secondaryButtonLabel="Details"
      onSecondaryAction={onSecondary}
      {...props}
    />,
  );
  return {
    onPrimary,
    onSecondary,
    primary: getByRole('button', /Reindex/) as HTMLButtonElement,
    secondary: getByRole('button', /Details/) as HTMLButtonElement,
  };
}

describe('SectionNotice action states', () => {
  it('leaves both actions enabled by default', () => {
    const { primary, secondary, onPrimary, onSecondary } = renderNotice({});
    expect(primary.disabled).toBe(false);
    expect(secondary.disabled).toBe(false);
    click(primary);
    click(secondary);
    expect(onPrimary).toHaveBeenCalledTimes(1);
    expect(onSecondary).toHaveBeenCalledTimes(1);
  });

  it('disables each action independently', () => {
    const { primary, secondary, onPrimary, onSecondary } = renderNotice({
      primaryActionDisabled: true,
    });
    expect(primary.disabled).toBe(true);
    expect(secondary.disabled).toBe(false);
    click(primary);
    click(secondary);
    expect(onPrimary).not.toHaveBeenCalled();
    expect(onSecondary).toHaveBeenCalledTimes(1);
  });

  it('shows a spinner and disables an action while loading', () => {
    const { primary, secondary } = renderNotice({
      secondaryActionLoading: true,
    });
    expect(secondary.disabled).toBe(true);
    expect(secondary.querySelector('[role="status"]')).not.toBeNull();
    expect(primary.disabled).toBe(false);
    expect(primary.querySelector('[role="status"]')).toBeNull();
  });

  it('disables the secondary action and shows primary progress together', () => {
    const { primary, secondary } = renderNotice({
      primaryActionLoading: true,
      secondaryActionDisabled: true,
    });
    expect(primary.disabled).toBe(true);
    expect(primary.querySelector('[role="status"]')).not.toBeNull();
    expect(secondary.disabled).toBe(true);
  });
});
