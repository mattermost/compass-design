import type { Meta, StoryObj } from '@storybook/react';
import type { ReactNode } from 'react';
import Divider from '../Divider/Divider';
import Switch from './Switch';
import type { SwitchSize } from './Switch';

const SIZES: SwitchSize[] = ['small', 'medium', 'large'];
const SWITCH_WIDTH = 420;

function SwitchFrame({
  children,
  width = SWITCH_WIDTH,
}: {
  children: ReactNode;
  width?: number;
}) {
  return <div style={{ width, maxWidth: '100%' }}>{children}</div>;
}

function Section({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section style={{ display: 'grid', gap: 12 }}>
      <h3
        style={{
          margin: 0,
          fontSize: 12,
          fontWeight: 600,
          lineHeight: 1,
          color: 'var(--center-channel-color)',
        }}
      >
        {title}
      </h3>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
          alignItems: 'stretch',
        }}
      >
        {children}
      </div>
    </section>
  );
}

const meta = {
  title: 'Components/Forms and Input/Switch',
  component: Switch,
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'select', options: SIZES },
  },
  decorators: [
    (Story) => (
      <SwitchFrame>
        <Story />
      </SwitchFrame>
    ),
  ],
} satisfies Meta<typeof Switch>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: 'Enable notifications',
    size: 'medium',
  },
};

export const Checked: Story = {
  args: {
    children: 'Enable notifications',
    defaultChecked: true,
    size: 'medium',
  },
};

export const WithSecondaryLabel: Story = {
  args: {
    children: 'Thread replies',
    secondaryLabel: 'Notify me about replies to threads I follow',
    size: 'medium',
  },
};

export const AllVariants: Story = {
  decorators: [],
  render: () => (
    <SwitchFrame>
      <div style={{ display: 'grid' }}>
        <Section title="States">
          <Switch size="medium">Unchecked</Switch>
          <Switch size="medium" defaultChecked>
            Checked
          </Switch>
        </Section>

        <Divider />

        <Section title="Sizes">
          {SIZES.map((size) => (
            <Switch key={size} size={size} defaultChecked={size !== 'small'}>
              {size}
            </Switch>
          ))}
        </Section>

        <Divider />

        <Section title="Labels">
          <Switch size="medium">Default label</Switch>
          <Switch size="medium" semiBold>
            Semi-bold label
          </Switch>
          <Switch size="medium" secondaryLabel="Optional description text">
            With secondary label
          </Switch>
          <Switch
            size="medium"
            semiBold
            defaultChecked
            secondaryLabel="Optional description text"
          >
            Semi-bold with secondary
          </Switch>
        </Section>

        <Divider />

        <Section title="Disabled">
          <Switch size="medium" disabled>
            Disabled — off
          </Switch>
          <Switch size="medium" defaultChecked disabled>
            Disabled — on
          </Switch>
        </Section>
      </div>
    </SwitchFrame>
  ),
};
