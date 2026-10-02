import { describe, expect, it, vi } from 'vitest';
import type { ReactElement } from 'react';
import { click, render } from '@/test-utils/render';
import type { BuiltInButtonProps } from '@/utils/props';
import AdminPanel from './AdminPanel/AdminPanel';
import Combobox from './Combobox/Combobox';
import EmptyState from './EmptyState/EmptyState';
import ErrorMessage from './ErrorMessage/ErrorMessage';
import GlobalBanner from './GlobalBanner/GlobalBanner';
import Modal from './Modal/Modal';
import ModalHeader from './ModalHeader/ModalHeader';
import PopoverNotice from './PopoverNotice/PopoverNotice';
import ProgressBar from './ProgressBar/ProgressBar';
import SearchInput from './SearchInput/SearchInput';
import SectionNotice from './SectionNotice/SectionNotice';
import Tabs from './Tabs/Tabs';
import Tag from './Tag/Tag';
import Toast from './Toast/Toast';
import TourPoint from './TourPoint/TourPoint';

/**
 * Published composites must put host attributes (`data-*`, `id`, `aria-*`) on
 * their root element. Add new composites here.
 */
const ROOT_CASES: Record<string, (attrs: RootAttrs) => ReactElement> = {
  SectionNotice: (a) => <SectionNotice title="Heads up" {...a} />,
  TourPoint: (a) => (
    <TourPoint title="Tip" {...a}>
      Body
    </TourPoint>
  ),
  EmptyState: (a) => <EmptyState title="Nothing here" {...a} />,
  Tag: (a) => <Tag label="Beta" {...a} />,
  Modal: (a) => (
    <Modal title="Settings" {...a}>
      Body
    </Modal>
  ),
  ErrorMessage: (a) => <ErrorMessage message="Required" {...a} />,
  ProgressBar: (a) => <ProgressBar value={40} {...a} />,
  Tabs: (a) => (
    <Tabs
      tabs={[{ key: 'a', label: 'A' }]}
      activeKey="a"
      onChange={() => {}}
      {...a}
    />
  ),
  AdminPanel: (a) => <AdminPanel title="Panel" {...a} />,
  Toast: (a) => <Toast message="Saved" {...a} />,
  PopoverNotice: (a) => (
    <PopoverNotice title="New" {...a}>
      Body
    </PopoverNotice>
  ),
};

type RootAttrs = {
  'data-testid': string;
  id: string;
  'aria-describedby': string;
  className: string;
};

describe('composite root attribute pass-through', () => {
  for (const [name, renderCase] of Object.entries(ROOT_CASES)) {
    it(`${name} puts data-*, id and aria-* on its root`, () => {
      const { container } = render(
        renderCase({
          'data-testid': `${name}-root`,
          id: `${name}-id`,
          'aria-describedby': 'hint',
          className: 'host-class',
        }),
      );
      const root = container.firstElementChild!;
      expect(root.getAttribute('data-testid')).toBe(`${name}-root`);
      expect(root.id).toBe(`${name}-id`);
      expect(root.getAttribute('aria-describedby')).toBe('hint');
      expect(root.classList).toContain('host-class');
      expect(root.classList.length).toBeGreaterThan(1);
    });
  }

  it('keeps the component role when the host passes a conflicting one', () => {
    const { container } = render(
      <ErrorMessage message="Required" role="note" />,
    );
    expect(container.firstElementChild!.getAttribute('role')).toBe('alert');
  });
});

/** Every built-in button accepts `*ButtonProps`. Add new ones here. */
const BUTTON_CASES: Record<
  string,
  {
    label: string;
    render: (props: BuiltInButtonProps, onActivate: () => void) => ReactElement;
  }
> = {
  'TourPoint closeButtonProps': {
    label: 'Close',
    render: (p, on) => (
      <TourPoint title="Tip" onClose={on} closeButtonProps={p}>
        Body
      </TourPoint>
    ),
  },
  'PopoverNotice closeButtonProps': {
    label: 'Close',
    render: (p, on) => (
      <PopoverNotice title="New" onClose={on} closeButtonProps={p}>
        Body
      </PopoverNotice>
    ),
  },
  'ModalHeader closeButtonProps': {
    label: 'Close',
    render: (p, on) => (
      <ModalHeader title="Settings" onClose={on} closeButtonProps={p} />
    ),
  },
  'ModalHeader backButtonProps': {
    label: 'Go back',
    render: (p, on) => (
      <ModalHeader
        title="Settings"
        showBackButton
        onBack={on}
        backButtonProps={p}
      />
    ),
  },
  'Modal closeButtonProps': {
    label: 'Close',
    render: (p, on) => (
      <Modal title="Settings" onClose={on} closeButtonProps={p}>
        Body
      </Modal>
    ),
  },
  'Modal backButtonProps': {
    label: 'Go back',
    render: (p, on) => (
      <Modal title="Settings" showBackButton onBack={on} backButtonProps={p}>
        Body
      </Modal>
    ),
  },
  'SectionNotice dismissButtonProps': {
    label: 'Dismiss',
    render: (p, on) => (
      <SectionNotice title="Heads up" onDismiss={on} dismissButtonProps={p} />
    ),
  },
  'Toast dismissButtonProps': {
    label: 'Dismiss',
    render: (p, on) => (
      <Toast message="Saved" onDismiss={on} dismissButtonProps={p} />
    ),
  },
  'GlobalBanner dismissButtonProps': {
    label: 'Dismiss',
    render: (p, on) => (
      <GlobalBanner message="Update" onDismiss={on} dismissButtonProps={p} />
    ),
  },
  'SearchInput clearButtonProps': {
    label: 'Clear search',
    render: (p, on) => (
      <SearchInput defaultValue="abc" onClear={on} clearButtonProps={p} />
    ),
  },
  'Combobox clearButtonProps': {
    label: 'Clear',
    render: (p, on) => (
      <Combobox
        aria-label="Model"
        clearable
        options={[{ value: 'a', label: 'A' }]}
        value="a"
        onChange={on}
        clearButtonProps={p}
      />
    ),
  },
  'TabItem buttonProps': {
    label: 'B',
    render: (p) => (
      <Tabs
        tabs={[
          { key: 'a', label: 'A' },
          { key: 'b', label: 'B', buttonProps: p },
        ]}
        activeKey="a"
        onChange={() => {}}
      />
    ),
  },
};

describe('built-in button attribute pass-through', () => {
  for (const [name, { label, render: renderCase }] of Object.entries(
    BUTTON_CASES,
  )) {
    it(`${name} reaches the button and keeps its name and handler`, () => {
      const onActivate = vi.fn();
      const { container } = render(
        renderCase(
          {
            'data-testid': 'built-in',
            className: 'host-button',
            'aria-describedby': 'hint',
          },
          onActivate,
        ),
      );
      const button = container.ownerDocument.querySelector(
        '[data-testid="built-in"]',
      ) as HTMLButtonElement;
      expect(button?.tagName).toBe('BUTTON');
      expect(button.classList).toContain('host-button');
      expect(button.classList.length).toBeGreaterThan(1);
      expect(button.getAttribute('aria-describedby')).toBe('hint');
      expect(button.getAttribute('aria-label') ?? button.textContent).toBe(
        label,
      );
      if (!name.startsWith('TabItem')) {
        click(button);
        expect(onActivate).toHaveBeenCalledTimes(1);
      }
    });
  }
});
