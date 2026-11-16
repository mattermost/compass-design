import { act } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { render } from '@/test-utils/render';
import { CallCard } from './index';

const buttons = (c: HTMLElement) =>
  Array.from(c.querySelectorAll('button')).map((b) => b.textContent?.trim());
const click = (el: Element | null | undefined) =>
  act(() => (el as HTMLElement).click());

describe('CallCard', () => {
  it('names the region after the title and shows the meta line', () => {
    const { container } = render(
      <CallCard title="Call started" meta="3 minutes ago by Aiko Tan" />,
    );
    expect(container.querySelector('section')?.getAttribute('aria-label')).toBe(
      'Call started',
    );
    expect(container.textContent).toContain('3 minutes ago by Aiko Tan');
  });

  it('active: shows Join call only when onJoin is passed', () => {
    const onJoin = vi.fn();
    const { container, rerender } = render(
      <CallCard title="t" onJoin={onJoin} />,
    );
    expect(buttons(container)).toEqual(['Join call']);
    click(container.querySelector('button'));
    expect(onJoin).toHaveBeenCalledTimes(1);
    rerender(<CallCard title="t" />);
    expect(buttons(container)).toEqual([]);
  });

  it('joined shows Leave; calling shows Cancel', () => {
    const onLeave = vi.fn();
    const onCancel = vi.fn();
    const { container, rerender } = render(
      <CallCard state="joined" title="t" onLeave={onLeave} />,
    );
    expect(buttons(container)).toEqual(['Leave']);
    click(container.querySelector('button'));
    expect(onLeave).toHaveBeenCalledTimes(1);
    rerender(<CallCard state="calling" title="t" onCancel={onCancel} />);
    expect(buttons(container)).toEqual(['Cancel']);
    click(container.querySelector('button'));
    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it('ended: shows the recording label and no action buttons', () => {
    const { container } = render(
      <CallCard
        state="ended"
        title="Call ended"
        recordingLabel="1 recording"
        onJoin={() => {}}
      />,
    );
    expect(container.textContent).toContain('1 recording');
    expect(buttons(container)).toEqual([]);
  });

  it('trailing replaces the default right-hand content', () => {
    const { container } = render(
      <CallCard
        state="ended"
        title="Missed call"
        trailing={<button>Call back</button>}
      />,
    );
    expect(buttons(container)).toEqual(['Call back']);
  });
});
