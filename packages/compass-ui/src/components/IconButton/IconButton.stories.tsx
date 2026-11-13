/* eslint-disable jsx-a11y/anchor-has-content -- asChild replaces empty anchor children with icon anatomy */
import type { Meta, StoryObj } from '@storybook/react';
import type { CSSProperties, ReactNode } from 'react';
import { MemoryRouter, Link } from 'react-router-dom';
import AccountMultipleOutlineIcon from '@mattermost/compass-icons/components/account-multiple-outline';
import MicrophoneOffIcon from '@mattermost/compass-icons/components/microphone-off';
import MonitorOffIcon from '@mattermost/compass-icons/components/monitor-off';
import RecordCircleOutlineIcon from '@mattermost/compass-icons/components/record-circle-outline';
import EmoticonHappyOutlineIcon from '@mattermost/compass-icons/components/emoticon-happy-outline';
import MessageTextOutlineIcon from '@mattermost/compass-icons/components/message-text-outline';
import DotsHorizontalIcon from '@mattermost/compass-icons/components/dots-horizontal';
import PhoneHangupIcon from '@mattermost/compass-icons/components/phone-hangup';
import InformationOutlineIcon from '@mattermost/compass-icons/components/information-outline';
import ArrowCollapseIcon from '@mattermost/compass-icons/components/arrow-collapse';
import GlobeIcon from '@mattermost/compass-icons/components/globe';
import IconButton, {
  type IconButtonPadding,
  type IconButtonProps,
  type IconButtonSize,
  type IconButtonStyle,
} from './IconButton';
import Icon from '../Icon/Icon';
import { iconSelectArgType, resolveStoryIcon } from '../../storybook/icons';

const SIZES: IconButtonSize[] = ['x-small', 'small', 'medium', 'large'];

const MATRIX_ROWS: {
  label: string;
  padding: IconButtonPadding;
  rounded: boolean;
}[] = [
  { label: 'Default', padding: 'default', rounded: false },
  { label: 'Compact', padding: 'compact', rounded: false },
  { label: 'Rounded', padding: 'default', rounded: true },
];

type IconButtonStoryArgs = Omit<IconButtonProps, 'icon'> & {
  icon: string;
};

const meta = {
  title: 'Components/Actions/Icon Button',
  component: IconButton,
  tags: ['autodocs'],
  argTypes: {
    style: { control: 'select', options: ['default', 'inverted'] },
    size: { control: 'select', options: SIZES },
    loading: { control: 'boolean' },
    padding: { control: 'select', options: ['default', 'compact'] },
    icon: iconSelectArgType({
      description: 'Icon glyph shown inside the button.',
    }),
  },
  args: {
    icon: 'globe',
  },
  render: ({ icon, size = 'medium', ...rest }) => (
    <IconButton
      {...rest}
      size={size}
      icon={resolveStoryIcon(icon, { wrapIcon: true }) as ReactNode}
    />
  ),
} satisfies Meta<IconButtonStoryArgs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    'aria-label': 'Open menu',
    size: 'medium',
    style: 'default',
  },
};

export const Loading: Story = {
  args: {
    'aria-label': 'Saving',
    size: 'medium',
    loading: true,
  },
};

export const Inverted: Story = {
  args: {
    'aria-label': 'Open menu',
    size: 'medium',
    style: 'inverted',
  },
  decorators: [
    (Story) => (
      <div
        style={{
          padding: 16,
          borderRadius: 8,
          background: 'var(--sidebar-header-bg)',
        }}
      >
        <Story />
      </div>
    ),
  ],
};

/**
 * Inverted buttons on a dark call surface, mirroring the call popout's header
 * and control bar. The surface sets `--inverted-color`, `--inverted-color-rgb`
 * and `--inverted-surface` from the `--calls-*` tokens; without them the
 * buttons fall back to the sidebar tokens, which are near-black on the call
 * surface in Quartz. Switch themes in the toolbar to compare; hover, press and
 * the toggled buttons (Participants, Call info) are the states that were
 * unreadable.
 */
/**
 * Mirrors the one-off fill `CallPopout` gives its inverted control-bar buttons
 * (a faint white fill). Kept inline so the story does not depend on compass-proto.
 */
const CALL_SURFACE_OVERRIDES = `
  .call-surface-story__controls button:not([aria-pressed='true']):not(.call-surface-story__leave) {
    background-color: color-mix(in srgb, var(--neutral-0) 8%, transparent);
  }
`;

export const InvertedOnCallSurface: Story = {
  render: () => (
    <div
      className="call-surface-story"
      style={
        {
          display: 'flex',
          flexDirection: 'column',
          gap: 24,
          padding: 16,
          width: 'fit-content',
          borderRadius: 8,
          background: 'var(--calls-bg)',
          '--inverted-color': 'var(--calls-color)',
          '--inverted-color-rgb': 'var(--calls-color-rgb)',
          '--inverted-surface': 'var(--calls-bg)',
        } as CSSProperties
      }
    >
      <style>{CALL_SURFACE_OVERRIDES}</style>
      <div style={{ display: 'flex', gap: 4, justifyContent: 'flex-end' }}>
        <IconButton
          size="small"
          style="inverted"
          aria-label="Close call info"
          toggled
          icon={<Icon size="16" glyph={<InformationOutlineIcon />} />}
        />
        <IconButton
          size="small"
          style="inverted"
          aria-label="Collapse call"
          icon={<Icon size="16" glyph={<ArrowCollapseIcon />} />}
        />
      </div>
      <div
        className="call-surface-story__controls"
        style={{ display: 'flex', gap: 8, alignItems: 'center' }}
      >
        <IconButton
          size="medium"
          style="inverted"
          aria-label="Participants (4)"
          toggled
          count={4}
          icon={<Icon size="20" glyph={<AccountMultipleOutlineIcon />} />}
        />
        <IconButton
          size="medium"
          style="inverted"
          aria-label="Unmute"
          icon={<Icon size="20" glyph={<MicrophoneOffIcon />} />}
        />
        <IconButton
          size="medium"
          style="inverted"
          aria-label="Share screen"
          icon={<Icon size="20" glyph={<MonitorOffIcon />} />}
        />
        <IconButton
          size="medium"
          style="inverted"
          aria-label="Record"
          icon={<Icon size="20" glyph={<RecordCircleOutlineIcon />} />}
        />
        <IconButton
          size="medium"
          style="inverted"
          aria-label="Reactions"
          icon={<Icon size="20" glyph={<EmoticonHappyOutlineIcon />} />}
        />
        <IconButton
          size="medium"
          style="inverted"
          aria-label="Chat"
          icon={<Icon size="20" glyph={<MessageTextOutlineIcon />} />}
        />
        <IconButton
          size="medium"
          style="inverted"
          aria-label="More"
          icon={<Icon size="20" glyph={<DotsHorizontalIcon />} />}
        />
        <IconButton
          className="call-surface-story__leave"
          size="medium"
          tone="danger"
          aria-label="Leave call"
          icon={<Icon size="20" glyph={<PhoneHangupIcon />} />}
        />
      </div>
    </div>
  ),
};

function Row({
  label,
  children,
  labelColor = 'var(--center-channel-color)',
}: {
  label: string;
  children: ReactNode;
  labelColor?: string;
}) {
  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 16,
        alignItems: 'center',
      }}
    >
      <span
        style={{
          width: 96,
          fontSize: 12,
          color: labelColor,
        }}
      >
        {label}
      </span>
      {children}
    </div>
  );
}

function PermutationGrid({
  style,
  destructive,
  disabled,
  labelColor = 'var(--center-channel-color)',
}: {
  style: IconButtonStyle;
  destructive: boolean;
  disabled: boolean;
  labelColor?: string;
}) {
  return (
    <div style={{ display: 'grid', gap: 12 }}>
      <div
        style={{
          display: 'flex',
          gap: 8,
          alignItems: 'center',
          paddingLeft: 96,
        }}
      >
        {SIZES.map((size) => (
          <span
            key={size}
            style={{
              width: 40,
              fontSize: 11,
              textAlign: 'center',
              color: labelColor,
            }}
          >
            {size}
          </span>
        ))}
      </div>
      {MATRIX_ROWS.map((row) => (
        <div
          key={row.label}
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 8,
            alignItems: 'center',
          }}
        >
          <span
            style={{
              width: 96,
              fontSize: 12,
              color: labelColor,
            }}
          >
            {row.label}
          </span>
          {SIZES.map((size) => (
            <IconButton
              key={size}
              aria-label={`${row.label}, ${size}`}
              style={style}
              destructive={destructive}
              disabled={disabled}
              size={size}
              padding={row.padding}
              rounded={row.rounded}
              icon={<Icon glyph={<GlobeIcon />} />}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

/** `tone` fills the button red (`danger`), green (`success`), yellow (`warning`) or blue (`info`). */
export const Tones: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 12 }}>
      {(['danger', 'success', 'warning', 'info'] as const).map((tone) => (
        <IconButton
          key={tone}
          tone={tone}
          aria-label={tone}
          icon={<Icon glyph={<GlobeIcon />} />}
        />
      ))}
    </div>
  ),
};

export const AllVariants: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={{ display: 'grid', gap: 32 }}>
      <section>
        <h3 style={{ marginBottom: 12 }}>Default</h3>
        <PermutationGrid style="default" destructive={false} disabled={false} />
      </section>
      <section>
        <h3 style={{ marginBottom: 12 }}>Destructive</h3>
        <PermutationGrid style="default" destructive disabled={false} />
      </section>
      <section>
        <h3 style={{ marginBottom: 12 }}>Disabled</h3>
        <PermutationGrid style="default" destructive={false} disabled />
      </section>
      <section
        style={{
          padding: 16,
          borderRadius: 8,
          background: 'var(--sidebar-header-bg)',
        }}
      >
        <h3 style={{ marginBottom: 12, color: 'var(--sidebar-text)' }}>
          Inverted
        </h3>
        <PermutationGrid
          style="inverted"
          destructive={false}
          disabled={false}
          labelColor="var(--sidebar-text)"
        />
      </section>
      <section>
        <h3 style={{ marginBottom: 12 }}>Toggled & Active</h3>
        <div style={{ display: 'grid', gap: 12 }}>
          <Row label="Toggled">
            {SIZES.map((size) => (
              <IconButton
                key={size}
                aria-label={`Toggled, ${size}`}
                size={size}
                toggled
                icon={<Icon glyph={<GlobeIcon />} />}
              />
            ))}
          </Row>
          <Row label="Active">
            {SIZES.map((size) => (
              <IconButton
                key={size}
                aria-label={`Active, ${size}`}
                size={size}
                active
                icon={<Icon glyph={<GlobeIcon />} />}
              />
            ))}
          </Row>
        </div>
      </section>
      <section>
        <h3 style={{ marginBottom: 12 }}>Count & Unread badge</h3>
        <div style={{ display: 'grid', gap: 12 }}>
          <Row label="Count">
            <IconButton
              aria-label="12 notifications"
              count={12}
              size="x-small"
              icon={<Icon glyph={<GlobeIcon />} />}
            />
            <IconButton
              aria-label="48 notifications"
              count={48}
              size="small"
              icon={<Icon glyph={<GlobeIcon />} />}
            />
            <IconButton
              aria-label="425 notifications"
              count={425}
              icon={<Icon glyph={<GlobeIcon />} />}
            />
            <IconButton
              aria-label="9 notifications"
              count={9}
              size="large"
              icon={<Icon glyph={<GlobeIcon />} />}
            />
          </Row>
          <Row label="Unread">
            {SIZES.map((size) => (
              <IconButton
                key={size}
                aria-label={`Unread, ${size}`}
                size={size}
                unreadBadge
                icon={<Icon glyph={<GlobeIcon />} />}
              />
            ))}
            <IconButton
              aria-label="Unread with count"
              count={3}
              unreadBadge
              icon={<Icon glyph={<GlobeIcon />} />}
            />
          </Row>
        </div>
      </section>
    </div>
  ),
};

export const AsLink: Story = {
  render: () => (
    <IconButton
      asChild
      aria-label="Open settings"
      icon={<Icon glyph={<GlobeIcon />} />}
    >
      <a href="https://mattermost.com" />
    </IconButton>
  ),
};

export const AsReactRouterLink: Story = {
  decorators: [
    (Story) => (
      <MemoryRouter>
        <Story />
      </MemoryRouter>
    ),
  ],
  render: () => (
    <IconButton
      asChild
      aria-label="Open settings"
      icon={<Icon glyph={<GlobeIcon />} />}
    >
      <Link to="/settings" />
    </IconButton>
  ),
};
