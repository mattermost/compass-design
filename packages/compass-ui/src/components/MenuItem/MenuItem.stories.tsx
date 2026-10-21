import type { Meta, StoryObj } from '@storybook/react';
import type { ReactNode } from 'react';
import avatarEmma from '@/assets/avatars/Emma Novak.png';
import avatarStaffTeam from '@/assets/avatars/Staff Team.png';
import MenuItem from './MenuItem';
import type { MenuItemProps } from './MenuItem';
import TeamAvatar from '../TeamAvatar/TeamAvatar';
import UserAvatar from '../UserAvatar/UserAvatar';
import {
  ICON_DEFAULT,
  ICON_NONE,
  iconSelectArgType,
  resolveStoryIcon,
} from '../../storybook/icons';

const menuDemoStyle = {
  display: 'grid',
  gap: 2,
  width: 280,
  padding: 4,
  borderRadius: 8,
  background: 'var(--center-channel-bg)',
  border: '1px solid rgba(var(--center-channel-color-rgb), 0.08)',
} as const;

type MenuItemStoryArgs = Omit<
  MenuItemProps,
  'leadingVisual' | 'trailingVisual'
> & {
  leadingVisual?: string;
  trailingVisual?: string;
};

// `ReactNode` props make Storybook infer an object control, whose JSON isn't a valid React child.
const textControl = (description: string) => ({
  control: 'text' as const,
  description,
});

const meta = {
  title: 'Components/Navigation/Menu Item',
  component: MenuItem,
  tags: ['autodocs'],
  argTypes: {
    label: textControl('Primary label.'),
    secondaryLabel: textControl('Optional secondary label.'),
    secondaryLabelPosition: {
      control: 'inline-radio',
      options: ['below', 'inline'],
    },
    tagLabel: textControl('Text of the tag. Turn on `tag` to show it.'),
    customStatusEmoji: textControl('Emoji shown after the label.'),
    mentionCount: { control: 'number' },
    // Inherited button attributes: Storybook infers an object control for these, which breaks the story.
    className: { table: { disable: true } },
    type: { table: { disable: true } },
    leadingVisual: iconSelectArgType({
      includeDefault: true,
      description:
        'Leading icon glyph. Default uses the built-in emoticon placeholder. Turn off leadingElement to hide the slot.',
    }),
    trailingVisual: iconSelectArgType({
      optional: true,
      description:
        'Trailing icon glyph. None uses the built-in check. Turn on trailingElement to show the slot.',
    }),
  },
  args: {
    leadingVisual: ICON_DEFAULT,
    trailingVisual: ICON_NONE,
  },
  render: ({ leadingVisual, trailingVisual, ...rest }) => (
    <MenuItem
      {...rest}
      leadingVisual={
        leadingVisual === ICON_DEFAULT
          ? undefined
          : (resolveStoryIcon(leadingVisual, { wrapSize: '16' }) as ReactNode)
      }
      trailingVisual={
        resolveStoryIcon(trailingVisual, { wrapSize: '16' }) as ReactNode
      }
    />
  ),
} satisfies Meta<MenuItemStoryArgs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: 'Menu Item',
  },
};

export const WithTrailingCheck: Story = {
  args: {
    label: 'With trailing check',
    trailingElement: true,
  },
};

export const SecondaryLabelBelow: Story = {
  args: {
    label: 'Menu Item',
    secondaryLabel: 'Descriptive text below',
  },
};

export const SecondaryLabelInline: Story = {
  args: {
    label: 'Menu Item',
    secondaryLabel: 'Inline text',
    secondaryLabelPosition: 'inline',
  },
};

export const WithTag: Story = {
  args: {
    label: 'New feature',
    tag: true,
  },
};

/** A team's avatar as the leading visual; use `variant="menu"` at 24px so it stays non-interactive on `center-channel-bg`. */
export const WithTeamAvatar: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={menuDemoStyle}>
      <MenuItem
        label="Staff Team"
        leadingVisual={
          <TeamAvatar
            src={avatarStaffTeam}
            alt="Staff Team"
            size="24"
            variant="menu"
          />
        }
      />
      <MenuItem
        label="Core Team"
        leadingVisual={
          <TeamAvatar initials="Co" alt="Core Team" size="24" variant="menu" />
        }
      />
    </div>
  ),
};

/** A person's avatar as the leading visual, at 24px. */
export const WithUserAvatar: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={menuDemoStyle}>
      <MenuItem
        label="Emma Novak"
        secondaryLabel="@emma"
        secondaryLabelPosition="inline"
        leadingVisual={
          <UserAvatar src={avatarEmma} alt="Emma Novak" size="24" />
        }
      />
    </div>
  ),
};

export const Destructive: Story = {
  args: {
    label: 'Delete item',
    destructive: true,
  },
};

export const AllVariants: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={{ display: 'grid', gap: 24 }}>
      <section>
        <h3
          style={{
            marginBottom: 12,
            fontSize: 12,
            color: 'var(--center-channel-color)',
          }}
        >
          Default
        </h3>
        <div style={menuDemoStyle}>
          <MenuItem label="Menu Item" />
          <MenuItem label="With trailing check" trailingElement />
          <MenuItem label="No leading visual" leadingElement={false} />
        </div>
      </section>
      <section>
        <h3
          style={{
            marginBottom: 12,
            fontSize: 12,
            color: 'var(--center-channel-color)',
          }}
        >
          Secondary label
        </h3>
        <div style={menuDemoStyle}>
          <MenuItem label="Menu Item" secondaryLabel="Descriptive text below" />
          <MenuItem
            label="Menu Item"
            secondaryLabel="Inline text"
            secondaryLabelPosition="inline"
          />
        </div>
      </section>
      <section>
        <h3
          style={{
            marginBottom: 12,
            fontSize: 12,
            color: 'var(--center-channel-color)',
          }}
        >
          Team avatar
        </h3>
        <div style={menuDemoStyle}>
          <MenuItem
            label="Staff Team"
            leadingVisual={
              <TeamAvatar
                src={avatarStaffTeam}
                alt="Staff Team"
                size="24"
                variant="menu"
              />
            }
          />
          <MenuItem
            label="Core Team"
            leadingVisual={
              <TeamAvatar
                initials="Co"
                alt="Core Team"
                size="24"
                variant="menu"
              />
            }
          />
        </div>
      </section>
      <section>
        <h3
          style={{
            marginBottom: 12,
            fontSize: 12,
            color: 'var(--center-channel-color)',
          }}
        >
          User avatar
        </h3>
        <div style={menuDemoStyle}>
          <MenuItem
            label="Emma Novak"
            secondaryLabel="@emma"
            secondaryLabelPosition="inline"
            leadingVisual={
              <UserAvatar src={avatarEmma} alt="Emma Novak" size="24" />
            }
          />
        </div>
      </section>
      <section>
        <h3
          style={{
            marginBottom: 12,
            fontSize: 12,
            color: 'var(--center-channel-color)',
          }}
        >
          Badges and tag
        </h3>
        <div style={menuDemoStyle}>
          <MenuItem label="New feature" tag />
          <MenuItem label="Mentions" mentionCount={3} />
          <MenuItem label="Custom status" customStatusEmoji="🏄" />
        </div>
      </section>
      <section>
        <h3
          style={{
            marginBottom: 12,
            fontSize: 12,
            color: 'var(--center-channel-color)',
          }}
        >
          Destructive
        </h3>
        <div style={menuDemoStyle}>
          <MenuItem label="Delete item" destructive />
          <MenuItem label="Delete item" destructive trailingElement />
        </div>
      </section>
      <section>
        <h3
          style={{
            marginBottom: 12,
            fontSize: 12,
            color: 'var(--center-channel-color)',
          }}
        >
          Disabled
        </h3>
        <div style={menuDemoStyle}>
          <MenuItem label="Menu Item" disabled />
          <MenuItem label="With badge" disabled mentionCount={2} />
          <MenuItem label="Destructive" destructive disabled />
        </div>
      </section>
    </div>
  ),
};
