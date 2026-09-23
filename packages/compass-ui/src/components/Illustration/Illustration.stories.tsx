import type { Meta, StoryObj } from '@storybook/react';
import type { ReactNode } from 'react';
import Illustration from './Illustration';
import type { IllustrationProps } from './Illustration';
import {
  illustrationSelectArgType,
  resolveStoryIllustration,
  STORYBOOK_ILLUSTRATION_NAMES,
  type StorybookIllustrationName,
} from '../../storybook/illustrations';
import { STORYBOOK_ILLUSTRATIONS } from '../../storybook/compassIllustrations.generated';

type IllustrationStoryArgs = Omit<IllustrationProps, 'glyph' | 'children'> & {
  glyph?: string;
};

const meta = {
  title: 'Components/Images and Icons/Illustration',
  component: Illustration,
  tags: ['autodocs'],
  argTypes: {
    glyph: illustrationSelectArgType({
      description:
        'Illustration from @mattermost/compass-ui/illustrations/<name>.',
    }),
  },
  args: {
    glyph: 'search',
    'aria-label': 'Search',
    width: '200px',
    height: '120px',
  },
  render: ({ glyph, ...rest }) => (
    <Illustration
      {...rest}
      glyph={resolveStoryIllustration(glyph) as ReactNode}
    />
  ),
} satisfies Meta<IllustrationStoryArgs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const CustomSize: Story = {
  args: {
    glyph: 'ai-copilot-intro',
    'aria-label': 'AI Copilot intro',
    width: '280px',
    height: '160px',
  },
};

/**
 * Full catalog of brand SVGs shipped from
 * `@mattermost/compass-ui/illustrations/<name>`.
 */
export const Library: Story = {
  render: () => (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
        gap: 'var(--spacing-l)',
        color: 'var(--center-channel-color)',
      }}
    >
      {STORYBOOK_ILLUSTRATION_NAMES.map((name: StorybookIllustrationName) => {
        const Glyph = STORYBOOK_ILLUSTRATIONS[name];
        const onSidebar = name.endsWith('-on-sidebar-bg');
        return (
          <div
            key={name}
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--spacing-xs)',
              alignItems: 'center',
              padding: 'var(--spacing-m)',
              borderRadius: 'var(--radius-m)',
              background: onSidebar
                ? 'var(--sidebar-bg)'
                : 'var(--center-channel-bg)',
              border: '1px solid rgba(var(--center-channel-color-rgb), 0.08)',
            }}
          >
            <Illustration aria-label="" width="140px" height="96px">
              <Glyph />
            </Illustration>
            <span
              style={{
                fontSize: 'var(--font-size-75)',
                lineHeight: 'var(--line-height-75)',
                textAlign: 'center',
                wordBreak: 'break-word',
                color: onSidebar
                  ? 'var(--sidebar-text)'
                  : 'rgba(var(--center-channel-color-rgb), 0.72)',
              }}
            >
              {name}
            </span>
          </div>
        );
      })}
    </div>
  ),
};
