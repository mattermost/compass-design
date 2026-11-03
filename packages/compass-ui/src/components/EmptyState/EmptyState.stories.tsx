import { useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import ChevronDownIcon from '@mattermost/compass-icons/components/chevron-down';
import { useOutsideClose } from '@/hooks/useOutsideClose';
import SearchIllustration from '@/illustrations/search';
import Button from '@/components/Button/Button';
import Icon from '@/components/Icon/Icon';
import MenuItem from '@/components/MenuItem/MenuItem';
import PopoverMenu from '@/components/PopoverMenu/PopoverMenu';
import EmptyState from './EmptyState';

const meta = {
  title: 'Components/Layout and Containers/Empty State',
  component: EmptyState,
  tags: ['autodocs'],
} satisfies Meta<typeof EmptyState>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Sample `actionSlot` content: a button with a trailing chevron that opens a popover menu.
 * `PopoverMenu` is only the surface, so the host owns open state and positioning. The
 * empty state sits inside a scroll container that would clip a menu rendered in place, so
 * the menu is portaled to `document.body` and positioned under the button.
 */
function AddConnectionMenu() {
  const [open, setOpen] = useState(false);
  const [anchor, setAnchor] = useState<{ top: number; left: number } | null>(
    null,
  );
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  useOutsideClose(triggerRef, open, () => setOpen(false), menuRef);

  const toggle = () => {
    if (!open) {
      const rect = triggerRef.current?.getBoundingClientRect();
      if (rect) {
        setAnchor({ top: rect.bottom + 4, left: rect.left + rect.width / 2 });
      }
    }
    setOpen((isOpen) => !isOpen);
  };

  return (
    <>
      <Button
        ref={triggerRef}
        emphasis="tertiary"
        trailingIcon={<Icon glyph={<ChevronDownIcon />} />}
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={toggle}
      >
        Add a connection
      </Button>
      {anchor &&
        createPortal(
          <div
            ref={menuRef}
            style={{
              position: 'fixed',
              top: anchor.top,
              left: anchor.left,
              transform: 'translateX(-50%)',
              zIndex: 1000,
            }}
          >
            <PopoverMenu
              open={open}
              onExited={() => setAnchor(null)}
              aria-label="Add a connection"
            >
              <MenuItem
                label="Create a connection"
                leadingElement={false}
                onClick={() => setOpen(false)}
              />
              <MenuItem
                label="Accept an invitation"
                leadingElement={false}
                onClick={() => setOpen(false)}
              />
            </PopoverMenu>
          </div>,
          document.body,
        )}
    </>
  );
}

export const WithIllustration: Story = {
  args: {
    illustration: {
      'aria-label': 'Search',
      width: '120px',
      height: '80px',
      children: <SearchIllustration />,
    },
    title: 'No results found',
    description:
      "Try adjusting your search or filters to find what you're looking for.",
    action: { children: 'Clear filters', onClick: fn() },
  },
};

export const TextOnly: Story = {
  args: {
    title: 'No messages yet',
    description: 'Be the first to start the conversation.',
  },
};

export const WithAction: Story = {
  args: {
    title: 'No saved messages',
    description: 'Messages you save will appear here.',
    action: { children: 'Browse channels', onClick: fn() },
  },
};

export const InFlexCenteredParent: Story = {
  args: TextOnly.args,
  render: (args) => (
    <div style={{ display: 'flex', justifyContent: 'center', height: 320 }}>
      <EmptyState {...args} />
    </div>
  ),
};

export const InGridCenteredParent: Story = {
  args: TextOnly.args,
  render: (args) => (
    <div style={{ display: 'grid', placeContent: 'center', height: 320 }}>
      <EmptyState {...args} />
    </div>
  ),
};

export const InWideParent: Story = {
  args: {
    title: 'Set up your first recap',
    description:
      'Recaps help you get caught up quickly on discussions that are most important to you with a summarized report. Create one to get started.',
    action: { children: 'Create a recap', onClick: fn() },
  },
  render: (args) => (
    <div style={{ width: 1200, height: 320 }}>
      <EmptyState {...args} />
    </div>
  ),
};

export const BelowHeaderInFlexColumn: Story = {
  args: TextOnly.args,
  render: (args) => (
    <div style={{ display: 'flex', flexDirection: 'column', height: 320 }}>
      <div style={{ flex: 'none', height: 60 }}>Header</div>
      <EmptyState {...args} />
    </div>
  ),
};

export const InModalBody: Story = {
  args: {
    title: 'No members yet',
    titleLevel: 3,
    description: (
      <>
        <p>There are currently no members in this group.</p>
        <p>Add one to get started.</p>
      </>
    ),
    descriptionAs: 'div',
  },
};

export const WithActionSlot: Story = {
  args: {
    title: 'Share channels',
    description:
      'Connecting with an external workspace allows you to share channels with them.',
    actionSlot: <AddConnectionMenu />,
  },
};
