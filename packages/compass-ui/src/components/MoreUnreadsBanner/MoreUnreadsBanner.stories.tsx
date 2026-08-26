import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import MoreUnreadsBanner from './MoreUnreadsBanner';
import type {
  MoreUnreadsBannerDirection,
  MoreUnreadsBannerSize,
} from './MoreUnreadsBanner';

const DIRECTIONS: MoreUnreadsBannerDirection[] = ['up', 'down'];
const SIZES: MoreUnreadsBannerSize[] = ['small', 'medium', 'large'];

const meta = {
  title: 'Components/Banners/More Unreads Banner',
  component: MoreUnreadsBanner,
  tags: ['autodocs'],
  argTypes: {
    direction: { control: 'select', options: DIRECTIONS },
    size: { control: 'select', options: SIZES },
  },
} satisfies Meta<typeof MoreUnreadsBanner>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    direction: 'up',
    size: 'medium',
    onClick: fn(),
  },
};

export const AllVariants: Story = {
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
          Directions
        </h3>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <MoreUnreadsBanner direction="up" onClick={fn()} />
          <MoreUnreadsBanner direction="down" onClick={fn()} />
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
          Sizes
        </h3>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <MoreUnreadsBanner size="small" onClick={fn()} />
          <MoreUnreadsBanner size="medium" onClick={fn()} />
          <MoreUnreadsBanner size="large" onClick={fn()} />
        </div>
      </section>
    </div>
  ),
};
