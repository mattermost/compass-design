import type { Meta, StoryObj } from '@storybook/react';
import { useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { MemoryRouter, Link } from 'react-router-dom';
import EyeOutlineIcon from '@mattermost/compass-icons/components/eye-outline';
import FilterVariantIcon from '@mattermost/compass-icons/components/filter-variant';
import GlobeIcon from '@mattermost/compass-icons/components/globe';
import LayersOutlineIcon from '@mattermost/compass-icons/components/layers-outline';
import SortAscendingIcon from '@mattermost/compass-icons/components/sort-ascending';
import Button from './Button';
import type {
  ButtonAppearance,
  ButtonEmphasis,
  ButtonProps,
  ButtonSize,
} from './Button';
import Icon from '../Icon/Icon';
import {
  ICON_NONE,
  iconSelectArgType,
  resolveStoryIcon,
} from '../../storybook/icons';

const EMPHASES: ButtonEmphasis[] = [
  'primary',
  'secondary',
  'tertiary',
  'quaternary',
  'dim',
  'link',
];

const SIZES: ButtonSize[] = ['x-small', 'small', 'medium', 'large'];

type ButtonStoryArgs = Omit<ButtonProps, 'leadingIcon' | 'trailingIcon'> & {
  leadingIcon?: string;
  trailingIcon?: string;
};

const meta = {
  title: 'Components/Actions/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    appearance: { control: 'select', options: ['default', 'inverted'] },
    compact: { control: 'boolean' },
    emphasis: { control: 'select', options: EMPHASES },
    loading: { control: 'boolean' },
    size: { control: 'select', options: SIZES },
    leadingIcon: iconSelectArgType({
      optional: true,
      includeDefault: true,
      description:
        'Leading slot (icon or other JSX). None hides it; Default uses the built-in Icon glyph.',
    }),
    trailingIcon: iconSelectArgType({
      optional: true,
      includeDefault: true,
      description:
        'Trailing slot (icon or other JSX). None hides it; Default uses the built-in Icon glyph.',
    }),
  },
  args: {
    compact: false,
    leadingIcon: ICON_NONE,
    trailingIcon: ICON_NONE,
  },
  render: ({
    leadingIcon: leadingIcon,
    trailingIcon: trailingIcon,
    size = 'medium',
    ...rest
  }) => (
    <Button
      {...rest}
      size={size}
      leadingIcon={
        resolveStoryIcon(leadingIcon, {
          defaultMode: 'wrapped',
          wrapIcon: true,
        }) as ButtonProps['leadingIcon']
      }
      trailingIcon={
        resolveStoryIcon(trailingIcon, {
          defaultMode: 'wrapped',
          wrapIcon: true,
        }) as ButtonProps['trailingIcon']
      }
    />
  ),
} satisfies Meta<ButtonStoryArgs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    children: 'Label',
    emphasis: 'primary',
    size: 'medium',
  },
};

export const Loading: Story = {
  args: {
    children: 'Saving',
    emphasis: 'primary',
    size: 'medium',
    loading: true,
  },
};

export const WithLeadingIcon: Story = {
  args: {
    children: 'Label',
    leadingIcon: 'globe',
  },
};

export const DimCompact: Story = {
  args: {
    children: 'Filter',
    emphasis: 'dim',
    compact: true,
    size: 'small',
    leadingIcon: 'globe',
  },
};

function ToolbarBadge({ children }: { children: ReactNode }) {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        minHeight: 18,
        padding: '0 var(--spacing-xxs)',
        borderRadius: 'var(--radius-pill)',
        background: 'rgba(var(--button-bg-rgb), 0.16)',
        color: 'var(--button-bg)',
        fontSize: 'var(--font-size-50)',
        fontWeight: 'var(--font-weight-semibold)',
        lineHeight: '18px',
      }}
    >
      {children}
    </span>
  );
}

/** Boards-style view toolbar — dim + compact buttons with a trailing badge slot. */
export const ViewToolbar: Story = {
  parameters: {
    controls: { disable: true },
  },
  render: function Render() {
    const [filterOn, setFilterOn] = useState(false);
    const [sortOn, setSortOn] = useState(false);

    const activeStyle = {
      '--button-fg': 'var(--button-bg)',
      backgroundColor: 'rgba(var(--button-bg-rgb), 0.08)',
    } as CSSProperties;

    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          minHeight: 280,
          margin: -16,
          padding: '16px 20px',
          background: 'var(--center-channel-bg)',
          color: 'var(--center-channel-color)',
          fontFamily: 'var(--font-family-body)',
        }}
      >
        <div
          style={{
            marginBottom: 12,
            fontSize: 16,
            fontWeight: 600,
          }}
        >
          Test
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            marginBottom: 12,
            borderBottom:
              '1px solid rgba(var(--center-channel-color-rgb), 0.08)',
          }}
        >
          <Button emphasis="dim" compact size="small">
            Board
          </Button>
          <Button emphasis="dim" compact size="small">
            Table Test
          </Button>
        </div>
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            gap: 4,
            marginBottom: 20,
          }}
        >
          <Button
            emphasis="dim"
            compact
            size="small"
            leadingIcon={<Icon glyph={<LayersOutlineIcon />} />}
            trailingIcon={<ToolbarBadge>Status</ToolbarBadge>}
          >
            Group by
          </Button>
          <Button
            emphasis="dim"
            compact
            size="small"
            leadingIcon={<Icon glyph={<EyeOutlineIcon />} />}
          >
            Properties
          </Button>
          <Button
            emphasis="dim"
            compact
            size="small"
            leadingIcon={<Icon glyph={<FilterVariantIcon />} />}
            aria-pressed={filterOn}
            style={filterOn ? activeStyle : undefined}
            onClick={() => setFilterOn((v) => !v)}
          >
            Filter
          </Button>
          <Button
            emphasis="dim"
            compact
            size="small"
            leadingIcon={<Icon glyph={<SortAscendingIcon />} />}
            aria-pressed={sortOn}
            style={sortOn ? activeStyle : undefined}
            onClick={() => setSortOn((v) => !v)}
          >
            Sort
          </Button>
        </div>
        <div style={{ display: 'flex', gap: 16, flex: 1, minHeight: 0 }}>
          {(['To Do', 'In Progress'] as const).map((column) => (
            <div
              key={column}
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                gap: 8,
                minWidth: 0,
              }}
            >
              <div style={{ fontSize: 12, fontWeight: 600, opacity: 0.72 }}>
                {column} · 1
              </div>
              <div
                style={{
                  padding: 12,
                  borderRadius: 4,
                  background: 'rgba(var(--center-channel-color-rgb), 0.04)',
                  border:
                    '1px solid rgba(var(--center-channel-color-rgb), 0.08)',
                  fontSize: 14,
                }}
              >
                {column === 'To Do' ? 'This is a card title' : 'Test'}
              </div>
              <Button emphasis="dim" compact size="small">
                + New
              </Button>
            </div>
          ))}
        </div>
      </div>
    );
  },
};

function PermutationGrid({
  appearance,
  destructive,
  disabled,
  labelColor = 'var(--center-channel-color)',
}: {
  appearance: ButtonAppearance;
  destructive: boolean;
  disabled: boolean;
  labelColor?: string;
}) {
  return (
    <div style={{ display: 'grid', gap: 12 }}>
      {EMPHASES.map((emphasis) => (
        <div
          key={emphasis}
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
            {emphasis}
          </span>
          {SIZES.map((size) => (
            <Button
              key={size}
              appearance={appearance}
              emphasis={emphasis}
              destructive={destructive}
              disabled={disabled}
              size={size}
            >
              Label
            </Button>
          ))}
        </div>
      ))}
    </div>
  );
}

export const AllVariants: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={{ display: 'grid', gap: 32 }}>
      <section>
        <h3 style={{ marginBottom: 12 }}>Default</h3>
        <PermutationGrid
          appearance="default"
          destructive={false}
          disabled={false}
        />
      </section>
      <section>
        <h3 style={{ marginBottom: 12 }}>Destructive</h3>
        <PermutationGrid appearance="default" destructive disabled={false} />
      </section>
      <section>
        <h3 style={{ marginBottom: 12 }}>Disabled</h3>
        <PermutationGrid appearance="default" destructive={false} disabled />
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
          appearance="inverted"
          destructive={false}
          disabled={false}
          labelColor="var(--sidebar-text)"
        />
      </section>
    </div>
  ),
};

export const FocusViaRef: Story = {
  render: function Render() {
    const confirmRef = useRef<HTMLButtonElement>(null);
    return (
      <div style={{ display: 'flex', gap: 8 }}>
        <Button emphasis="tertiary" onClick={() => confirmRef.current?.focus()}>
          Focus confirm
        </Button>
        <Button ref={confirmRef} emphasis="primary" destructive>
          Delete
        </Button>
      </div>
    );
  },
};

export const AsLink: Story = {
  render: () => (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 12,
        alignItems: 'center',
      }}
    >
      <Button asChild emphasis="primary">
        <a href="https://mattermost.com">Add Custom Emoji</a>
      </Button>
      <Button
        asChild
        emphasis="link"
        leadingIcon={<Icon glyph={<GlobeIcon />} />}
      >
        <a href="https://mattermost.com">Learn more</a>
      </Button>
    </div>
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
    <Button asChild emphasis="secondary">
      <Link to="/team/emoji/add">Add Custom Emoji</Link>
    </Button>
  ),
};
