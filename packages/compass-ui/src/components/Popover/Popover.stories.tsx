import { useRef, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import Button from '@/components/Button/Button';
import TextInput from '@/components/TextInput/TextInput';
import Popover from './Popover';

const meta = {
  title: 'Components/Layout and Containers/Popover',
  component: Popover,
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'select', options: ['small', 'medium', 'large'] },
    open: { control: false },
    initialFocusRef: { control: false },
  },
  // Stories fake the anchor and the open state; the component owns neither.
  decorators: [
    (Story) => (
      <div style={{ padding: 'var(--spacing-xl)', minHeight: 240 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Popover>;

export default meta;
type Story = StoryObj<typeof meta>;

const footer = (
  <>
    <Button emphasis="tertiary" size="small">
      Reset
    </Button>
    <Button emphasis="primary" size="small">
      Apply
    </Button>
  </>
);

export const Default: Story = {
  args: {
    title: 'Filter results',
    onClose: fn(),
    manageFocus: false,
    children: 'Choose which results to show in this view.',
    footer,
  },
};

export const WithoutHeader: Story = {
  args: {
    'aria-label': 'Help',
    manageFocus: false,
    children: 'A quick tip with no title and no close button.',
  },
};

export const Sizes: Story = {
  args: { children: null },
  render: () => (
    <div style={{ display: 'flex', gap: 'var(--spacing-l)', flexWrap: 'wrap' }}>
      {(['small', 'medium', 'large'] as const).map((size) => (
        <Popover
          key={size}
          size={size}
          title={size}
          manageFocus={false}
          onClose={fn()}
        >
          Width follows the size prop.
        </Popover>
      ))}
    </div>
  ),
};

// Host-owned open state and anchor: the trigger and placement below are story scaffolding only.
function ControlledDemo() {
  const [open, setOpen] = useState(false);
  const nameRef = useRef<HTMLInputElement>(null);
  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <Button
        emphasis="secondary"
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        Quick edit
      </Button>
      <div
        style={{
          position: 'absolute',
          top: 'calc(100% + var(--spacing-xs))',
          left: 0,
        }}
      >
        <Popover
          open={open}
          title="Quick edit"
          onClose={() => setOpen(false)}
          initialFocusRef={nameRef}
          footer={
            <Button size="small" onClick={() => setOpen(false)}>
              Save
            </Button>
          }
        >
          <TextInput ref={nameRef} label="Name" defaultValue="Design" />
        </Popover>
      </div>
    </div>
  );
}

export const Controlled: Story = {
  args: { children: null },
  render: () => <ControlledDemo />,
};
