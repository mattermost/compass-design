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
import TileButton from './TileButton';
import Icon from '@/components/Icon/Icon';
import type { TileButtonProps } from './TileButton';
import { iconSelectArgType, resolveStoryIcon } from '../../storybook/icons';

type TileButtonStoryArgs = Omit<TileButtonProps, 'icon'> & {
  icon: string;
};

const meta = {
  title: 'Components/Actions/Tile Button',
  component: TileButton,
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
    <TileButton
      {...rest}
      icon={resolveStoryIcon(icon, { wrapIcon: true }) as ReactNode}
    />
  ),
} satisfies Meta<TileButtonStoryArgs>;

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
        <TileButton
          icon={<Icon glyph={<EmoticonHappyOutlineIcon />} />}
          label="Action"
          aria-label="Action"
        />
        <TileButton
          icon={<Icon glyph={<StarOutlineIcon />} />}
          label="Favorite"
          aria-label="Favorite"
        />
        <TileButton
          icon={<Icon glyph={<BellOutlineIcon />} />}
          label="Mute"
          aria-label="Mute"
        />
        <TileButton
          icon={<Icon glyph={<LinkVariantIcon />} />}
          label="Copy Link"
          aria-label="Copy link"
        />
      </Row>
      <Row label="Toggled">
        <TileButton
          icon={<Icon glyph={<EmoticonHappyOutlineIcon />} />}
          label="Action"
          aria-label="Action"
          toggled
        />
        <TileButton
          icon={<Icon glyph={<StarIcon />} />}
          label="Favorited"
          aria-label="Favorited"
          toggled
        />
        <TileButton
          icon={<Icon glyph={<BellOffOutlineIcon />} />}
          label="Muted"
          aria-label="Muted"
          toggled
        />
      </Row>
      <Row label="Destructive">
        <TileButton
          icon={<Icon glyph={<TrashCanOutlineIcon />} />}
          label="Delete"
          aria-label="Delete"
          destructive
        />
      </Row>
      <Row label="Disabled">
        <TileButton
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
          <TileButton key={label} icon={<Icon glyph={glyph} />} label={label} />
        ))}
      </div>
    );
    return (
      <div style={{ display: 'grid', gap: 20 }}>
        <Row label="Default width" align="stretch">
          {labels.map(({ glyph, label }) => (
            <TileButton
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
          <TileButton
            icon={<Icon glyph={<AccountPlusOutlineIcon />} />}
            label="Add people to this channel and notify them"
          />
          <TileButton
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
    <TileButton
      asChild
      icon={<Icon glyph={<LinkVariantIcon />} />}
      label="View profile"
    >
      <a href="https://mattermost.com" />
    </TileButton>
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
    <TileButton
      asChild
      icon={<Icon glyph={<LinkVariantIcon />} />}
      label="View profile"
    >
      <Link to="/users/me" />
    </TileButton>
  ),
};
