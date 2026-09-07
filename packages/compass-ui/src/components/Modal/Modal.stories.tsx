import type { Meta, StoryObj } from '@storybook/react';
import type { ReactNode } from 'react';
import { fn } from '@storybook/test';
import avatarAiko from '@/assets/avatars/Aiko Tan.png';
import avatarArjun from '@/assets/avatars/Arjun Patel.png';
import avatarDanielle from '@/assets/avatars/Danielle Okoro.png';
import avatarLeonard from '@/assets/avatars/Leonard Riley.png';
import avatarMarco from '@/assets/avatars/Marco Rinaldi.png';
import avatarSofia from '@/assets/avatars/Sofia Bauer.png';
import Button from '../Button/Button';
import MenuItem from '../MenuItem/MenuItem';
import TextInput from '../TextInput/TextInput';
import UserAvatar from '../UserAvatar/UserAvatar';
import Modal from './Modal';
import type { ModalSize } from './Modal';

const SIZES: ModalSize[] = ['small', 'medium', 'large'];

const modalFooter = (
  <>
    <Button emphasis="tertiary">Cancel</Button>
    <Button destructive>Delete Channel</Button>
  </>
);

const modalBody = (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-l)' }}>
    <p style={{ margin: 0, color: 'var(--center-channel-color)' }}>
      This will permanently delete <strong>#design</strong> and all its messages.
      Members will lose access immediately. This action cannot be undone.
    </p>
    <TextInput label='Type "design" to confirm' placeholder="design" />
  </div>
);

const people = [
  { name: 'Aiko Tan', handle: '@aiko', src: avatarAiko },
  { name: 'Arjun Patel', handle: '@arjun', src: avatarArjun },
  { name: 'Danielle Okoro', handle: '@danielle', src: avatarDanielle },
  { name: 'Leonard Riley', handle: '@leonard', src: avatarLeonard },
  { name: 'Marco Rinaldi', handle: '@marco', src: avatarMarco },
  { name: 'Sofia Bauer', handle: '@sofia', src: avatarSofia },
] as const;

function ModalCanvas({
  children,
  tall = false,
}: {
  children: ReactNode;
  tall?: boolean;
}) {
  return (
    <div
      style={{
        position: 'relative',
        height: tall ? 600 : 480,
        background: 'var(--center-channel-bg)',
        border: '1px solid rgba(var(--center-channel-color-rgb), 0.12)',
        borderRadius: 'var(--radius-l)',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 'var(--spacing-l)',
        }}
      >
        {children}
      </div>
    </div>
  );
}

const meta = {
  title: 'Patterns/Modal',
  component: Modal,
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'select', options: SIZES },
    bodyPadding: {
      control: 'select',
      options: ['default', 'menu', 'none'],
    },
    subtitlePlacement: {
      control: 'select',
      options: ['below', 'beside'],
    },
    scrollable: { control: 'boolean' },
  },
} satisfies Meta<typeof Modal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <ModalCanvas>
      <Modal
        title="Delete Channel"
        size="small"
        footer={modalFooter}
        onClose={fn()}
      >
        {modalBody}
      </Modal>
    </ModalCanvas>
  ),
};

export const WithSubtitle: Story = {
  render: () => (
    <ModalCanvas>
      <Modal
        title="Invite members"
        subtitle="Add people to #design"
        size="medium"
        footer={
          <>
            <Button emphasis="tertiary">Cancel</Button>
            <Button emphasis="primary">Send invites</Button>
          </>
        }
        onClose={fn()}
      >
        <TextInput label="Email addresses" placeholder="name@example.com" />
      </Modal>
    </ModalCanvas>
  ),
};

export const SubtitleBeside: Story = {
  render: () => (
    <ModalCanvas>
      <Modal
        title="Agent Settings"
        subtitle="Matty"
        subtitlePlacement="beside"
        size="large"
        footer={
          <>
            <Button emphasis="tertiary">Cancel</Button>
            <Button emphasis="primary">Save</Button>
          </>
        }
        onClose={fn()}
      >
        <p style={{ margin: 0, color: 'var(--center-channel-color)' }}>
          Settings body with an inline header subtitle (Figma Subtitle = Beside).
        </p>
      </Modal>
    </ModalCanvas>
  ),
};

export const WithHeaderAction: Story = {
  render: () => (
    <ModalCanvas>
      <Modal
        title="Browse channels"
        size="medium"
        headerAction={
          <Button emphasis="secondary" size="small">
            Create
          </Button>
        }
        footer={
          <>
            <Button emphasis="tertiary">Cancel</Button>
            <Button emphasis="primary">Done</Button>
          </>
        }
        onClose={fn()}
      >
        <TextInput label="Search" placeholder="Find a channel" />
      </Modal>
    </ModalCanvas>
  ),
};

export const CloseOnlyHeader: Story = {
  render: () => (
    <ModalCanvas>
      <Modal
        title="New agent"
        hideTitle
        headerDivider={false}
        footerDivider={false}
        footer={
          <>
            <Button emphasis="tertiary">Cancel</Button>
            <Button emphasis="primary">Create</Button>
          </>
        }
        onClose={fn()}
      >
        <p style={{ margin: 0, color: 'var(--center-channel-color)' }}>
          Close-only header (Figma Title = Off). Title stays for screen readers.
        </p>
      </Modal>
    </ModalCanvas>
  ),
};

export const WithBackButton: Story = {
  render: () => (
    <ModalCanvas>
      <Modal
        title="Confirm deletion"
        size="small"
        showBackButton
        onBack={fn()}
        onClose={fn()}
        footer={modalFooter}
      >
        {modalBody}
      </Modal>
    </ModalCanvas>
  ),
};

export const WithoutDividers: Story = {
  render: () => (
    <ModalCanvas>
      <Modal
        title="Delete Channel"
        size="small"
        headerDivider={false}
        footerDivider={false}
        footer={modalFooter}
        onClose={fn()}
      >
        {modalBody}
      </Modal>
    </ModalCanvas>
  ),
};

export const FooterSeparated: Story = {
  render: () => (
    <ModalCanvas>
      <Modal
        title="Share"
        size="small"
        footerType="2-actions-separated"
        footer={
          <>
            <Button emphasis="tertiary">Cancel</Button>
            <Button emphasis="primary">Share</Button>
          </>
        }
        onClose={fn()}
      >
        <p style={{ margin: 0, color: 'var(--center-channel-color)' }}>
          Footer actions spread to opposite edges.
        </p>
      </Modal>
    </ModalCanvas>
  ),
};

export const FooterPagination: Story = {
  render: () => (
    <ModalCanvas>
      <Modal
        title="Members"
        size="medium"
        footerType="pagination"
        footerLeading="Showing 1–30 of 132"
        footer={
          <>
            <Button emphasis="tertiary" size="small">
              Previous
            </Button>
            <Button emphasis="tertiary" size="small">
              Next
            </Button>
          </>
        }
        onClose={fn()}
      >
        <p style={{ margin: 0, color: 'var(--center-channel-color)' }}>
          Pagination footer with status on the left.
        </p>
      </Modal>
    </ModalCanvas>
  ),
};

export const MenuItemList: Story = {
  render: () => (
    <ModalCanvas tall>
      <Modal
        title="Add people"
        subtitle="Choose members to add to #design"
        size="small"
        bodyPadding="menu"
        headerDivider={false}
        footerDivider={false}
        footer={
          <>
            <Button emphasis="tertiary">Cancel</Button>
            <Button emphasis="primary">Add</Button>
          </>
        }
        onClose={fn()}
      >
        {people.map((person) => (
          <MenuItem
            key={person.handle}
            label={person.name}
            secondaryLabel={person.handle}
            leadingVisual={
              <UserAvatar src={person.src} alt={person.name} size="24" />
            }
          />
        ))}
      </Modal>
    </ModalCanvas>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 32 }}>
      {SIZES.map((size) => (
        <div key={size}>
          <p
            style={{
              marginBottom: 8,
              fontSize: 12,
              color: 'rgba(var(--center-channel-color-rgb), 0.56)',
            }}
          >
            {size}
          </p>
          <ModalCanvas>
            <Modal title={`${size} modal`} size={size} onClose={fn()}>
              <p style={{ margin: 0, color: 'var(--center-channel-color)' }}>
                Modal body content for the {size.toLowerCase()} size variant.
              </p>
            </Modal>
          </ModalCanvas>
        </div>
      ))}
    </div>
  ),
};
