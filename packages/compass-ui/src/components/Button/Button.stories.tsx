import type { Meta, StoryObj } from '@storybook/react';
import Button from './Button';
import type { ButtonAppearance, ButtonEmphasis, ButtonProps, ButtonSize } from './Button';
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
  'link',
];

const SIZES: ButtonSize[] = ['x-small', 'small', 'medium', 'large'];

type ButtonStoryArgs = Omit<ButtonProps, 'leadingIcon' | 'trailingIcon'> & {
  'leadingIcon'?: string;
  'trailingIcon'?: string;
};

const meta = {
  title: 'Components/Actions/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    appearance: { control: 'select', options: ['default', 'inverted'] },
    emphasis: { control: 'select', options: EMPHASES },
    loading: { control: 'boolean' },
    size: { control: 'select', options: SIZES },
    'leadingIcon': iconSelectArgType({
      optional: true,
      includeDefault: true,
      description:
        'Leading icon. None hides it; Default uses the built-in Icon glyph.',
    }),
    'trailingIcon': iconSelectArgType({
      optional: true,
      includeDefault: true,
      description:
        'Trailing icon. None hides it; Default uses the built-in Icon glyph.',
    }),
  },
  args: {
    'leadingIcon': ICON_NONE,
    'trailingIcon': ICON_NONE,
  },
  render: ({ 'leadingIcon': leadingIcon, 'trailingIcon': trailingIcon, size = 'medium', ...rest }) => (
    <Button
      {...rest}
      size={size}
      leadingIcon={
        resolveStoryIcon(leadingIcon, { defaultMode: 'wrapped', wrapIcon: true }) as ButtonProps['leadingIcon']
      }
      trailingIcon={
        resolveStoryIcon(trailingIcon, { defaultMode: 'wrapped', wrapIcon: true }) as ButtonProps['trailingIcon']
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
    'leadingIcon': 'globe',
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
