/* eslint-disable jsx-a11y/anchor-has-content -- asChild replaces empty anchor children with action anatomy */
import type { Meta, StoryObj } from '@storybook/react';
import type { ReactNode } from 'react';
import { MemoryRouter, Link } from 'react-router-dom';
import BellOffOutlineIcon from '@mattermost/compass-icons/components/bell-off-outline';
import AccountPlusOutlineIcon from '@mattermost/compass-icons/components/account-plus-outline';
import BellOutlineIcon from '@mattermost/compass-icons/components/bell-outline';
import EmoticonHappyOutlineIcon from '@mattermost/compass-icons/components/emoticon-happy-outline';
import LinkVariantIcon from '@mattermost/compass-icons/components/link-variant';
import StarIcon from '@mattermost/compass-icons/components/star';
import StarOutlineIcon from '@mattermost/compass-icons/components/star-outline';
import TrashCanOutlineIcon from '@mattermost/compass-icons/components/trash-can-outline';
import ActionButton from './ActionButton';
import Icon from '@/components/Icon/Icon';
import type { ActionButtonProps } from './ActionButton';
import { iconSelectArgType, resolveStoryIcon } from '../../storybook/icons';

type ActionButtonStoryArgs = Omit<ActionButtonProps, 'icon'> & {
  icon: string;
};

const meta = {
  title: 'Components/Actions/Action Button',
  component: ActionButton,
  tags: ['autodocs'],
  argTypes: {
    icon: iconSelectArgType({
      description: 'Action icon glyph from @mattermost/compass-icons.',
    }),
  },
  args: {
    icon: 'emoticon-happy-outline',
  },
  render: ({ icon, ...rest }) => (
    <ActionButton
      {...rest}
      icon={resolveStoryIcon(icon, { wrapIcon: true }) as ReactNode}
    />
  ),
} satisfies Meta<ActionButtonStoryArgs>;

export default meta;
type Story = StoryObj<typeof meta>;

function Row({
  label,
  children,
  align = 'center',
}: {
  label: string;
  children: ReactNode;
  align?: 'center' | 'stretch';
}) {
  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 16,
        alignItems: align,
      }}
    >
      <span
        style={{
          width: 96,
          fontSize: 12,
          color: 'var(--center-channel-color)',
        }}
      >
        {label}
      </span>
      {children}
    </div>
  );
}

export const Default: Story = {
  args: {
    label: 'Action',
    'aria-label': 'Action',
  },
};

export const AllVariants: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={{ display: 'grid', gap: 20 }}>
      <Row label="Default">
        <ActionButton
          icon={<Icon glyph={<EmoticonHappyOutlineIcon />} />}
          label="Action"
          aria-label="Action"
        />
        <ActionButton
          icon={<Icon glyph={<StarOutlineIcon />} />}
          label="Favorite"
          aria-label="Favorite"
        />
        <ActionButton
          icon={<Icon glyph={<BellOutlineIcon />} />}
          label="Mute"
          aria-label="Mute"
        />
        <ActionButton
          icon={<Icon glyph={<LinkVariantIcon />} />}
          label="Copy Link"
          aria-label="Copy link"
        />
      </Row>
      <Row label="Active">
        <ActionButton
          icon={<Icon glyph={<EmoticonHappyOutlineIcon />} />}
          label="Action"
          aria-label="Action"
          active
        />
        <ActionButton
          icon={<Icon glyph={<StarIcon />} />}
          label="Favorited"
          aria-label="Favorited"
          active
        />
        <ActionButton
          icon={<Icon glyph={<BellOffOutlineIcon />} />}
          label="Muted"
          aria-label="Muted"
          active
        />
      </Row>
      <Row label="Destructive">
        <ActionButton
          icon={<Icon glyph={<TrashCanOutlineIcon />} />}
          label="Delete"
          aria-label="Delete"
          destructive
        />
      </Row>
      <Row label="Disabled">
        <ActionButton
          icon={<Icon glyph={<EmoticonHappyOutlineIcon />} />}
          label="Action"
          aria-label="Action"
          disabled
        />
      </Row>
    </div>
  ),
};

export const LongLabels: Story = {
  parameters: { controls: { disable: true } },
  render: () => {
    const labels = [
      { glyph: <AccountPlusOutlineIcon />, label: 'Personen hinzufügen' },
      { glyph: <BellOffOutlineIcon />, label: 'Stummgeschaltet' },
      { glyph: <EmoticonHappyOutlineIcon />, label: 'Ajouter des personnes' },
      { glyph: <LinkVariantIcon />, label: 'Copy Link' },
    ];
    const Container = ({ width }: { width: number }) => (
      <div
        style={{
          display: 'flex',
          gap: 8,
          justifyContent: 'center',
          width,
          outline: '1px dashed rgba(var(--center-channel-color-rgb), 0.24)',
          outlineOffset: 4,
        }}
      >
        {labels.map(({ glyph, label }) => (
          <ActionButton
            key={label}
            icon={<Icon glyph={glyph} />}
            label={label}
          />
        ))}
      </div>
    );
    return (
      <div style={{ display: 'grid', gap: 20 }}>
        <Row label="Default width" align="stretch">
          {labels.map(({ glyph, label }) => (
            <ActionButton
              key={label}
              icon={<Icon glyph={glyph} />}
              label={label}
            />
          ))}
        </Row>
        <Row label="Narrow container">
          <Container width={320} />
        </Row>
        <Row label="Wide container">
          <Container width={560} />
        </Row>
        <Row label="Clamped" align="stretch">
          <ActionButton
            icon={<Icon glyph={<AccountPlusOutlineIcon />} />}
            label="Add people to this channel and notify them"
          />
          <ActionButton
            icon={<Icon glyph={<AccountPlusOutlineIcon />} />}
            label="Donaudampfschifffahrtsgesellschaft"
          />
        </Row>
      </div>
    );
  },
};

export const AsLink: Story = {
  render: () => (
    <ActionButton
      asChild
      icon={<Icon glyph={<LinkVariantIcon />} />}
      label="View profile"
    >
      <a href="https://mattermost.com" />
    </ActionButton>
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
    <ActionButton
      asChild
      icon={<Icon glyph={<LinkVariantIcon />} />}
      label="View profile"
    >
      <Link to="/users/me" />
    </ActionButton>
  ),
};
