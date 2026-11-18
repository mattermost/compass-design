import { describe, expect, it } from 'vitest';
import { render } from '@/test-utils/render';
import ModalHeader from './ModalHeader';

function backButton(container: HTMLElement) {
  return container.querySelector<HTMLButtonElement>(
    'button[aria-label="Go back"]',
  );
}

function hasLocalClass(el: Element | null | undefined, local: string) {
  return (el?.className ?? '').split(/\s+/).some((cls) => {
    return cls === local || cls.startsWith(`_${local}_`);
  });
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

describe('ModalHeader leading slot', () => {
  it('renders the slot in the title position and keeps the title as the accessible name', () => {
    const { container } = render(
      <ModalHeader
        title="Search"
        titleId="search-title"
        subtitle="Ignored"
        leading={<button type="button">Channels</button>}
        headerAction={<button type="button">All teams</button>}
        headerSlot={<input aria-label="Search" />}
      />,
    );

    const heading = container.querySelector('h2');
    const slot = container.querySelector('[class*="modal-header__leading"]');
    expect(heading?.id).toBe('search-title');
    expect(heading?.textContent).toBe('Search');
    expect(hasLocalClass(heading, 'modal-header__title-sr')).toBe(true);
    expect(hasLocalClass(heading, 'modal-header__title')).toBe(false);
    expect(heading?.querySelector('button')).toBeNull();
    expect(slot?.querySelector('button')?.textContent).toBe('Channels');
    expect(heading?.contains(slot)).toBe(false);
    expect(container.textContent).not.toContain('Ignored');
    expect(
      container.querySelector('[class*="modal-header__actions"] button')
        ?.textContent,
    ).toBe('All teams');
    expect(
      container.querySelector('[class*="modal-header__slot"] input'),
    ).not.toBeNull();
    const root = container.querySelector('[class*="modal-header"]');
    expect(hasLocalClass(root, 'modal-header--has-leading')).toBe(true);
    expect(hasLocalClass(root, 'modal-header--close-only')).toBe(false);
  });

  it('puts the back button before the slot, outside the heading', () => {
    const { container } = render(
      <ModalHeader
        title="Search"
        titleId="search-title"
        showBackButton
        leading={<button type="button">Channels</button>}
      />,
    );
    const slot = container.querySelector('[class*="modal-header__leading"]');
    const back = backButton(container);
    expect(slot?.firstElementChild).toBe(back);
    expect(container.querySelector('h2')?.contains(back)).toBe(false);
  });

  it('keeps hideTitle as a close-only header when there is no leading slot', () => {
    const { container } = render(
      <ModalHeader title="Search" titleId="search-title" hideTitle />,
    );
    const heading = container.querySelector('h2');
    const root = container.firstElementChild;
    expect(hasLocalClass(heading, 'modal-header__title-sr')).toBe(true);
    expect(container.querySelector('[class*="modal-header__leading"]')).toBe(
      null,
    );
    expect(hasLocalClass(root, 'modal-header--close-only')).toBe(true);
    expect(hasLocalClass(root, 'modal-header--has-leading')).toBe(false);
  });
});
