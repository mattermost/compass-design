import type { Meta, StoryObj } from '@storybook/react';
import Radio from './Radio';
import type { RadioSize } from './Radio';

const SIZES: RadioSize[] = ['small', 'medium', 'large'];

const meta = {
  title: 'Components/Forms and Input/Radio',
  component: Radio,
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'select', options: SIZES },
  },
} satisfies Meta<typeof Radio>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: 'Option',
    name: 'radio-default',
    size: 'medium',
    value: 'option',
  },
};

export const Checked: Story = {
  args: {
    children: 'Selected option',
    defaultChecked: true,
    name: 'radio-checked',
    size: 'medium',
    value: 'selected',
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
            width: 88,
            fontSize: 12,
            color: 'var(--center-channel-color)',
          }}
        >
          Group
        </span>
        <Radio name="radio-group" value="a" size="medium">
          Option A
        </Radio>
        <Radio name="radio-group" value="b" defaultChecked size="medium">
          Option B
        </Radio>
        <Radio name="radio-group" value="c" size="medium">
          Option C
        </Radio>
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
            width: 88,
            fontSize: 12,
            color: 'var(--center-channel-color)',
          }}
        >
          Sizes
        </span>
        {SIZES.map((size) => (
          <Radio
            key={size}
            name="radio-sizes"
            value={size.toLowerCase()}
            defaultChecked={size === 'medium'}
            size={size}
          >
            {size}
          </Radio>
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
            width: 88,
            fontSize: 12,
            color: 'var(--center-channel-color)',
          }}
        >
          Invalid
        </span>
        <Radio name="radio-invalid" value="unchecked" invalid>
          Unchecked invalid
        </Radio>
        <Radio
          name="radio-invalid"
          value="checked"
          defaultChecked
          invalid
        >
          Checked invalid
        </Radio>
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
            width: 88,
            fontSize: 12,
            color: 'var(--center-channel-color)',
          }}
        >
          Disabled
        </span>
        <Radio name="radio-disabled" value="unchecked" disabled>
          Disabled unchecked
        </Radio>
        <Radio name="radio-disabled" value="checked" defaultChecked disabled>
          Disabled checked
        </Radio>
      </div>
    </div>
  ),
};
