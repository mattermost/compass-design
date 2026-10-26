import { describe, expect, it } from 'vitest';
import { getByRole, render } from '@/test-utils/render';
import ProgressBar from './ProgressBar';

describe('ProgressBar', () => {
  it('reports the clamped value when determinate', () => {
    render(<ProgressBar value={140} aria-label="Upload" />);
    const bar = getByRole('progressbar', 'Upload');
    expect(bar.getAttribute('aria-valuenow')).toBe('100');
  });

  it('omits aria-valuenow when indeterminate', () => {
    render(<ProgressBar indeterminate value={60} aria-label="Reindexing" />);
    const bar = getByRole('progressbar', 'Reindexing');
    expect(bar.hasAttribute('aria-valuenow')).toBe(false);
    expect(bar.getAttribute('aria-valuemin')).toBe('0');
    expect(bar.getAttribute('aria-valuemax')).toBe('100');
  });

  it('keeps a default accessible label when indeterminate', () => {
    render(<ProgressBar indeterminate />);
    expect(getByRole('progressbar').getAttribute('aria-label')).toBe(
      'Progress',
    );
  });

  it('keeps progressbar semantics by default', () => {
    const { container } = render(<ProgressBar value={35} />);
    const bar = container.firstElementChild as HTMLElement;
    expect(bar.getAttribute('role')).toBe('progressbar');
    expect(bar.hasAttribute('aria-hidden')).toBe(false);
  });

  it('is hidden from assistive tech and drops progressbar attributes when decorative', () => {
    const { container } = render(
      <ProgressBar decorative value={35} aria-label="Ignored" />,
    );
    const bar = container.firstElementChild as HTMLElement;
    expect(bar.getAttribute('aria-hidden')).toBe('true');
    for (const attr of [
      'role',
      'aria-valuenow',
      'aria-valuemin',
      'aria-valuemax',
      'aria-label',
    ]) {
      expect(bar.hasAttribute(attr)).toBe(false);
    }
  });

  it('still sizes the fill from value when decorative', () => {
    const { container } = render(<ProgressBar decorative value={35} />);
    const fill = (container.firstElementChild as HTMLElement)
      .firstElementChild as HTMLElement;
    expect(fill.style.width).toBe('35%');
  });

  it('passes extra attributes through when decorative', () => {
    const { container } = render(
      <ProgressBar decorative value={35} data-testid="bar" id="bar-1" />,
    );
    const bar = container.firstElementChild as HTMLElement;
    expect(bar.getAttribute('data-testid')).toBe('bar');
    expect(bar.id).toBe('bar-1');
  });

  it('does not size the fill from value when indeterminate', () => {
    render(<ProgressBar indeterminate value={60} />);
    const fill = getByRole('progressbar').firstElementChild as HTMLElement;
    expect(fill.style.width).toBe('');
  });
});
