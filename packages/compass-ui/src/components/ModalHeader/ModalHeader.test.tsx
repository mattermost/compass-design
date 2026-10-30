import { describe, expect, it } from 'vitest';
import { render } from '@/test-utils/render';
import ModalHeader from './ModalHeader';

function backButton(container: HTMLElement) {
  return container.querySelector<HTMLButtonElement>(
    'button[aria-label="Go back"]',
  );
}

describe('ModalHeader back button', () => {
  it('gets the back class so its hit target does not grow the title row', () => {
    const { container } = render(
      <ModalHeader title="Detail" showBackButton onBack={() => {}} />,
    );
    expect(backButton(container)?.className).toContain('modal-header__back');
  });

  it('merges backButtonProps.className with the back class', () => {
    const { container } = render(
      <ModalHeader
        title="Detail"
        showBackButton
        onBack={() => {}}
        backButtonProps={{ className: 'host-back' }}
      />,
    );
    const cls = backButton(container)?.className ?? '';
    expect(cls).toContain('modal-header__back');
    expect(cls).toContain('host-back');
  });
});
