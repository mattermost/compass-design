import type { Meta, StoryObj } from '@storybook/react';
import Checkbox from './Checkbox';
import type { CheckboxSize } from './Checkbox';

const SIZES: CheckboxSize[] = ['small', 'medium', 'large'];

const meta = {
  title: 'Components/Forms and Input/Checkbox',
  component: Checkbox,
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'select', options: SIZES },
  },
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Unchecked: Story = {
  args: {
    children: 'Remember me',
    checked: false,
  },
};

export const Checked: Story = {
  args: {
    children: 'Remember me',
    checked: true,
  },
};

export const Disabled: Story = {
  args: {
    children: 'Unavailable option',
    checked: false,
    disabled: true,
  },
};

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 20 }}>
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
            width: 112,
            fontSize: 12,
            color: 'var(--center-channel-color)',
          }}
        >
          States
        </span>
        <Checkbox size="medium">Unchecked</Checkbox>
        <Checkbox size="medium" defaultChecked>
          Checked
        </Checkbox>
        <Checkbox size="medium" indeterminate>
          Indeterminate
        </Checkbox>
      </div>
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
            width: 112,
            fontSize: 12,
            color: 'var(--center-channel-color)',
          }}
        >
          Sizes
        </span>
        {SIZES.map((size) => (
          <Checkbox key={size} size={size} defaultChecked={size !== 'small'}>
            {size}
          </Checkbox>
        ))}
      </div>
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
            width: 112,
            fontSize: 12,
            color: 'var(--center-channel-color)',
          }}
        >
          Invalid
        </span>
        <Checkbox size="medium" valid={false}>
          Unchecked invalid
        </Checkbox>
        <Checkbox size="medium" defaultChecked valid={false}>
          Checked invalid
        </Checkbox>
        <Checkbox size="medium" indeterminate valid={false}>
          Indeterminate invalid
        </Checkbox>
      </div>
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
            width: 112,
            fontSize: 12,
            color: 'var(--center-channel-color)',
          }}
        >
          Disabled
        </span>
        <Checkbox size="medium" disabled>
          Disabled unchecked
        </Checkbox>
        <Checkbox size="medium" defaultChecked disabled>
          Disabled checked
        </Checkbox>
        <Checkbox size="medium" indeterminate disabled>
          Disabled indeterminate
        </Checkbox>
      </div>
    </div>
  ),
};
