import type { Meta, StoryObj } from '@storybook/react';
import MenuGroupHeading from './MenuGroupHeading';
import MenuItem from '../MenuItem/MenuItem';
import Divider from '../Divider/Divider';

const menuDemoStyle = {
  display: 'grid',
  gap: 2,
  width: 280,
  padding: 4,
  borderRadius: 8,
  background: 'var(--center-channel-bg)',
  border: '1px solid rgba(var(--center-channel-color-rgb), 0.08)',
} as const;

const meta = {
  title: 'Components/Navigation/Menu Group Heading',
  component: MenuGroupHeading,
  tags: ['autodocs'],
  args: {
    label: 'Section',
  },
} satisfies Meta<typeof MenuGroupHeading>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const InContext: Story = {
  name: 'In a menu',
  render: (args) => (
    <div style={menuDemoStyle}>
      <MenuGroupHeading {...args} label="Preferences" />
      <MenuItem label="Theme" leadingElement={false} />
      <MenuItem label="Language" leadingElement={false} />
      <MenuItem label="Time zone" leadingElement={false} />
      <Divider />
      <MenuGroupHeading {...args} label="Notifications" />
      <MenuItem label="Desktop alerts" leadingElement={false} />
      <MenuItem label="Mobile push" leadingElement={false} />
    </div>
  ),
};
