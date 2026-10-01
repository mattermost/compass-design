import { describe, expect, it, vi } from 'vitest';
import type { ReactNode } from 'react';
import { click, getByRole, render } from '@/test-utils/render';
import EmptyState from './EmptyState/EmptyState';
import ErrorMessage from './ErrorMessage/ErrorMessage';
import MenuItem from './MenuItem/MenuItem';
import PopoverNotice from './PopoverNotice/PopoverNotice';
import SectionNotice from './SectionNotice/SectionNotice';
import Tabs from './Tabs/Tabs';
import Tag from './Tag/Tag';
import Toast from './Toast/Toast';
import Tooltip from './Tooltip/Tooltip';

/** Stand-in for react-intl's `<FormattedMessage/>`: an element, not a string. */
function Msg({ children }: { children: ReactNode }) {
  return <span data-testid="msg">{children}</span>;
}

function messages(container: HTMLElement) {
  return Array.from(container.querySelectorAll('[data-testid="msg"]')).map(
    (el) => el.textContent,
  );
}

describe('text props accept translated nodes', () => {
  it('Tag label', () => {
    const { container } = render(<Tag label={<Msg>Beta</Msg>} />);
    expect(messages(container)).toEqual(['Beta']);
  });

  it('MenuItem label', () => {
    const { container } = render(<MenuItem label={<Msg>Edit</Msg>} />);
    expect(messages(container)).toEqual(['Edit']);
  });

  it('Tabs tab label', () => {
    const { container } = render(
      <Tabs
        tabs={[{ key: 'a', label: <Msg>Tools</Msg> }]}
        activeKey="a"
        onChange={() => {}}
      />,
    );
    expect(getByRole('tab').textContent).toBe('Tools');
    expect(messages(container)).toEqual(['Tools']);
  });

  it('SectionNotice title and button labels', () => {
    const onPrimary = vi.fn();
    const { container } = render(
      <SectionNotice
        title={<Msg>Heads up</Msg>}
        primaryButtonLabel={<Msg>Enable</Msg>}
        onPrimaryAction={onPrimary}
        secondaryButtonLabel={<Msg>Later</Msg>}
      />,
    );
    expect(messages(container)).toEqual(['Heads up', 'Enable', 'Later']);
    click(getByRole('button', 'Enable'));
    expect(onPrimary).toHaveBeenCalledTimes(1);
  });

  it('EmptyState title', () => {
    const { container } = render(<EmptyState title={<Msg>No bots</Msg>} />);
    expect(container.querySelector('h2')?.textContent).toBe('No bots');
  });

  it('ErrorMessage message', () => {
    render(<ErrorMessage message={<Msg>Required</Msg>} />);
    expect(getByRole('alert').textContent).toBe('Required');
  });

  it('Tooltip label and hint', () => {
    const { container } = render(
      <Tooltip label={<Msg>Copy</Msg>} hint={<Msg>Copies the link</Msg>} />,
    );
    expect(messages(container)).toEqual(['Copy', 'Copies the link']);
  });

  it('Tooltip renders a numeric zero hint', () => {
    const { container } = render(<Tooltip label="Copy" hint={0} />);
    expect(
      container.querySelector('[class*="tooltip__hint"]')?.textContent,
    ).toBe('0');
  });

  it('Tooltip omits an empty string hint', () => {
    const { container } = render(<Tooltip label="Copy" hint="" />);
    expect(container.textContent).toBe('Copy');
  });

  it('Toast message and action label', () => {
    const onAction = vi.fn();
    const { container } = render(
      <Toast
        message={<Msg>Saved</Msg>}
        actionLabel={<Msg>Undo</Msg>}
        onAction={onAction}
      />,
    );
    expect(messages(container)).toEqual(['Saved', 'Undo']);
    click(getByRole('button', 'Undo'));
    expect(onAction).toHaveBeenCalledTimes(1);
  });

  it('PopoverNotice title and action labels', () => {
    const { container } = render(
      <PopoverNotice
        title={<Msg>New</Msg>}
        actions={[{ label: <Msg>Got it</Msg> }]}
      >
        Body
      </PopoverNotice>,
    );
    expect(messages(container)).toEqual(['New', 'Got it']);
  });
});
