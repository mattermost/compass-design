import type { Meta, StoryObj } from '@storybook/react';
import { useRef, useState } from 'react';
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
import ModalOverlay from './ModalOverlay';
import type { ModalSize } from './Modal';
import modalOverlayStyles from './ModalOverlay.module.scss';

const SIZES: ModalSize[] = ['small', 'medium', 'large'];

const modalFooter = (
  <>
    <Button emphasis="tertiary">Cancel</Button>
    <Button destructive>Delete Channel</Button>
  </>
);

const modalBody = (
  <div
    style={{
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--spacing-l)',
    }}
  >
    <p style={{ margin: 0, color: 'var(--center-channel-color)' }}>
      This will permanently delete{' '}
      <span style={{ fontWeight: 'var(--font-weight-semibold)' }}>#design</span>{' '}
      and all its messages. Members will lose access immediately. This action
      cannot be undone.
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

// Stages a real ModalOverlay inside a frame: the frame is the portal container,
// `position: absolute` keeps the scrim in the frame, and `lockScroll={false}`
// keeps open demos from freezing the docs page.
function ModalCanvas({
  children,
  tall = false,
  open = true,
}: {
  children: ReactNode;
  tall?: boolean;
  open?: boolean;
}) {
  const [stage, setStage] = useState<HTMLDivElement | null>(null);
  return (
    <div
      ref={setStage}
      style={{
        position: 'relative',
        height: tall ? 600 : 480,
        background: 'var(--center-channel-bg)',
        border: '1px solid rgba(var(--center-channel-color-rgb), 0.12)',
        borderRadius: 'var(--radius-l)',
        overflow: 'hidden',
      }}
    >
      {stage && (
        <ModalOverlay
          open={open}
          container={stage}
          lockScroll={false}
          style={{ position: 'absolute' }}
        >
          {children}
        </ModalOverlay>
      )}
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

export const WithSubtitle: Story = {
  render: () => (
    <ModalCanvas>
      <Modal
        title="Invite Members"
        subtitle="Add people to #design"
        headerDivider={false}
        footerDivider={false}
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
        headerDivider={false}
        footerDivider={false}
        footer={
          <>
            <Button emphasis="tertiary">Cancel</Button>
            <Button emphasis="primary">Save</Button>
          </>
        }
        onClose={fn()}
      >
        <p style={{ margin: 0, color: 'var(--center-channel-color)' }}>
          Settings body with an inline header subtitle (Figma Subtitle =
          Beside).
        </p>
      </Modal>
    </ModalCanvas>
  ),
};

export const WithHeaderAction: Story = {
  render: () => (
    <ModalCanvas>
      <Modal
        title="Browse Channels"
        headerDivider={false}
        footerDivider={false}
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

export const WithBackButton: Story = {
  render: () => (
    <ModalCanvas>
      <Modal
        title="Confirm Deletion"
        showBackButton
        onBack={fn()}
        onClose={fn()}
        headerDivider={false}
        footerDivider={false}
        footer={modalFooter}
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
        headerDivider={false}
        footerDivider={false}
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
        headerDivider={false}
        footerDivider={false}
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
        title="Add People"
        subtitle="Choose members to add to #design"
        bodyPadding="menu"
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

/** Scrollable body with header/footer dividers (default divider props). */
export const ScrollableBody: Story = {
  render: () => (
    <ModalCanvas tall>
      <Modal
        title="Notification preferences"
        style={{ maxHeight: '100%' }}
        footer={
          <>
            <Button emphasis="tertiary">Cancel</Button>
            <Button emphasis="primary">Save</Button>
          </>
        }
        onClose={fn()}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--spacing-s)',
          }}
        >
          {Array.from({ length: 24 }, (_, i) => (
            <p
              key={i}
              style={{ margin: 0, color: 'var(--center-channel-color)' }}
            >
              Setting row {i + 1}: the body scrolls once the dialog reaches its
              maximum height. Header and footer dividers stay visible.
            </p>
          ))}
        </div>
      </Modal>
    </ModalCanvas>
  ),
};

/** Host owns body padding + scroll (settings-style sidebar layout). */
export const HostOwnedLayout: Story = {
  render: () => (
    <ModalCanvas tall>
      <Modal
        title="Agent Settings"
        subtitle="Matty"
        size="large"
        style={{ height: '100%', maxHeight: '100%' }}
        bodyPadding="none"
        scrollable={false}
        footer={
          <>
            <Button emphasis="tertiary">Cancel</Button>
            <Button emphasis="primary">Save</Button>
          </>
        }
        onClose={fn()}
      >
        <div
          style={{
            display: 'flex',
            height: '100%',
            minHeight: 0,
          }}
        >
          <nav
            style={{
              width: 200,
              flexShrink: 0,
              padding: 'var(--spacing-l)',
              borderRight:
                '1px solid rgba(var(--center-channel-color-rgb), 0.12)',
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--spacing-xs)',
            }}
          >
            {['Info', 'Model & Instructions', 'Access & sharing'].map(
              (label) => (
                <button
                  key={label}
                  type="button"
                  style={{
                    textAlign: 'left',
                    padding: 'var(--spacing-xs) var(--spacing-s)',
                    border: 'none',
                    borderRadius: 'var(--radius-s)',
                    background:
                      label === 'Info'
                        ? 'rgba(var(--button-bg-rgb), 0.08)'
                        : 'transparent',
                    color: 'var(--center-channel-color)',
                    cursor: 'pointer',
                  }}
                >
                  {label}
                </button>
              ),
            )}
          </nav>
          <div
            style={{
              flex: 1,
              minWidth: 0,
              padding: 'var(--spacing-xxl) var(--spacing-xxxl)',
              overflow: 'auto',
            }}
          >
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--spacing-l)',
              }}
            >
              <TextInput label="Display name" placeholder="Matty" />
              <TextInput label="Username" placeholder="matty" />
              <TextInput
                label="Description"
                placeholder="Helpful teammate agent"
              />
              <TextInput label="Default model" placeholder="GPT-4o" />
              <TextInput
                label="System instructions"
                placeholder="You are a helpful assistant…"
              />
              <TextInput label="Temperature" placeholder="0.7" />
              <TextInput label="Max tokens" placeholder="2048" />
              <TextInput
                label="Knowledge sources"
                placeholder="Team wiki, design docs"
              />
            </div>
          </div>
        </div>
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
            <Modal
              title={`${size[0].toUpperCase()}${size.slice(1)} Modal`}
              size={size}
              headerDivider={false}
              footerDivider={false}
              onClose={fn()}
            >
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

function FormModalDemo() {
  const nameRef = useRef<HTMLInputElement>(null);
  return (
    <ModalCanvas>
      <Modal
        title="Create Channel"
        headerDivider={false}
        footerDivider={false}
        onClose={fn()}
        initialFocusRef={nameRef}
        footer={<Button>Create</Button>}
      >
        <TextInput ref={nameRef} label="Channel name" />
      </Modal>
    </ModalCanvas>
  );
}

export const InitialFocus: Story = {
  render: () => <FormModalDemo />,
};

function TransitionDemo() {
  const [open, setOpen] = useState(true);
  return (
    <div style={{ display: 'grid', gap: 16 }}>
      <div>
        <Button emphasis="secondary" onClick={() => setOpen((o) => !o)}>
          {open ? 'Close modal' : 'Open modal'}
        </Button>
      </div>
      <ModalCanvas open={open}>
        <Modal
          title="Transition"
          open={open}
          onClose={() => setOpen(false)}
          headerDivider={false}
          footerDivider={false}
          footer={<Button onClick={() => setOpen(false)}>Done</Button>}
        >
          <p style={{ margin: 0, color: 'var(--center-channel-color)' }}>
            Fades in, drops from the top and scales up slightly; reverses on
            close.
          </p>
        </Modal>
      </ModalCanvas>
    </div>
  );
}

export const Transition: Story = {
  render: () => <TransitionDemo />,
};

function HostOverlayDemo() {
  const [open, setOpen] = useState(true);
  const [mounted, setMounted] = useState(true);
  const show = () => {
    setMounted(true);
    setOpen(true);
  };
  return (
    // Tall stage so Docs doesn't clip a viewport-sized dialog. Product hosts
    // use position:fixed on the overlay; absolute keeps the demo inside this
    // frame. Modal max-height is overridden the same way — production keeps
    // the built-in 100dvh cap.
    <div
      style={{
        position: 'relative',
        height: 720,
        overflow: 'hidden',
        background: 'var(--center-channel-bg)',
        border: '1px solid rgba(var(--center-channel-color-rgb), 0.12)',
        borderRadius: 'var(--radius-l)',
      }}
    >
      <div style={{ padding: 'var(--spacing-l)' }}>
        <Button emphasis="secondary" onClick={show}>
          Open modal
        </Button>
      </div>
      {mounted && (
        // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions -- backdrop click is a pointer shortcut; keyboard users close with Escape
        <div
          className={[
            modalOverlayStyles['modal-overlay'],
            !open && modalOverlayStyles['modal-overlay--exiting'],
          ]
            .filter(Boolean)
            .join(' ')}
          style={{ position: 'absolute', zIndex: 1 }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setOpen(false);
          }}
        >
          <Modal
            title="Notification preferences"
            open={open}
            onClose={() => setOpen(false)}
            onExited={() => setMounted(false)}
            style={{ maxHeight: 'calc(100% - 80px)' }}
            footer={<Button onClick={() => setOpen(false)}>Done</Button>}
          >
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--spacing-s)',
              }}
            >
              {Array.from({ length: 30 }, (_, i) => (
                <p
                  key={i}
                  style={{ margin: 0, color: 'var(--center-channel-color)' }}
                >
                  Setting row {i + 1}: the body scrolls once the dialog reaches
                  its maximum height.
                </p>
              ))}
            </div>
          </Modal>
        </div>
      )}
    </div>
  );
}

function OverlayDemo() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button emphasis="secondary" onClick={() => setOpen(true)}>
        Open modal
      </Button>
      <ModalOverlay open={open} onClose={() => setOpen(false)}>
        <Modal
          title="Notification preferences"
          open={open}
          onClose={() => setOpen(false)}
          footer={<Button onClick={() => setOpen(false)}>Done</Button>}
        >
          <p style={{ margin: 0, color: 'var(--center-channel-color)' }}>
            The scrim portals to the page, locks body scroll, closes on a
            backdrop click and fades out with the dialog. Escape is handled by
            the Modal.
          </p>
        </Modal>
      </ModalOverlay>
    </>
  );
}

/** Default host setup: `ModalOverlay` around `Modal`, both driven by the host's `open` state. */
export const Overlay: Story = {
  render: () => <OverlayDemo />,
};

/** Escape hatch: overlay styles on a host-owned element, unmounted after `onExited`. */
export const HostOverlay: Story = {
  parameters: {
    docs: {
      story: { inline: true, height: '740px' },
    },
  },
  render: () => <HostOverlayDemo />,
};
