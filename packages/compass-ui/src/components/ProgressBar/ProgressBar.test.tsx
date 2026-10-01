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

  it('does not size the fill from value when indeterminate', () => {
    render(<ProgressBar indeterminate value={60} />);
    const fill = getByRole('progressbar').firstElementChild as HTMLElement;
    expect(fill.style.width).toBe('');
  });
});
