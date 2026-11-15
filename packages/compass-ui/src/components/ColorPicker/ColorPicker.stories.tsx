import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import ColorPicker from './ColorPicker';
import type { ColorPickerProps, ColorPickerSize } from './ColorPicker';

const SIZES: ColorPickerSize[] = ['small', 'medium', 'large'];

function ControlledDemo(args: ColorPickerProps) {
  const [value, setValue] = useState('#2F9E5B');
  return (
    <div style={{ display: 'grid', gap: 12 }}>
      <ColorPicker {...args} value={value} onChange={setValue} />
      <span style={{ color: 'var(--center-channel-color)' }}>{value}</span>
    </div>
  );
}

const meta = {
  title: 'Components/Forms and Input/Color Picker',
  component: ColorPicker,
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'select', options: SIZES },
    disabled: { control: 'boolean' },
    showHexInput: { control: 'boolean' },
  },
  args: { 'aria-label': 'Label color', size: 'medium' },
} satisfies Meta<typeof ColorPicker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { defaultValue: '#1C58D9' },
};

export const WithHexInput: Story = {
  args: { showHexInput: true, defaultValue: '#7F57D6' },
};

export const Controlled: Story = {
  render: (args) => <ControlledDemo {...args} />,
};

export const Disabled: Story = {
  args: { disabled: true, defaultValue: '#D24B4E' },
};

export const AllVariants: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={{ display: 'grid', gap: 16 }}>
      {SIZES.map((size) => (
        <ColorPicker
          key={size}
          aria-label={size}
          size={size}
          defaultValue="#1C58D9"
        />
      ))}
      <ColorPicker aria-label="Disabled" disabled defaultValue="#D24B4E" />
      <ColorPicker aria-label="Hex" showHexInput defaultValue="#123456" />
    </div>
  ),
};
