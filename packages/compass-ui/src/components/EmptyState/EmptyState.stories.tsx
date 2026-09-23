import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import type { ReactNode } from 'react';
import EmptyState from './EmptyState';
import type { EmptyStateProps } from './EmptyState';
import {
  ILLUSTRATION_NONE,
  illustrationSelectArgType,
  resolveStoryIllustration,
} from '../../storybook/illustrations';

type EmptyStateStoryArgs = Omit<EmptyStateProps, 'illustration'> & {
  illustrationName?: string;
};

const meta = {
  title: 'Components/Layout and Containers/Empty State',
  component: EmptyState,
  tags: ['autodocs'],
  argTypes: {
    illustrationName: illustrationSelectArgType({
      optional: true,
      description:
        'Illustration from @mattermost/compass-ui/illustrations/<name>.',
    }),
  },
  render: ({ illustrationName, ...rest }) => {
    const glyph = resolveStoryIllustration(illustrationName) as
      | ReactNode
      | undefined;
    return (
      <EmptyState
        {...rest}
        illustration={
          glyph != null
            ? {
                glyph,
                width: '120px',
                height: '80px',
                'aria-label':
                  illustrationName != null &&
                  illustrationName !== ILLUSTRATION_NONE
                    ? illustrationName
                    : '',
              }
            : undefined
        }
      />
    );
  },
} satisfies Meta<EmptyStateStoryArgs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const WithIllustration: Story = {
  args: {
    illustrationName: 'search',
    title: 'No results found',
    description:
      'Try adjusting your search or filters to find what you\'re looking for.',
    action: { children: 'Clear filters', onClick: fn() },
  },
};

export const TextOnly: Story = {
  args: {
    illustrationName: ILLUSTRATION_NONE,
    title: 'No messages yet',
    description: 'Be the first to start the conversation.',
  },
};

export const WithAction: Story = {
  args: {
    illustrationName: ILLUSTRATION_NONE,
    title: 'No saved messages',
    description: 'Messages you save will appear here.',
    action: { children: 'Browse channels', onClick: fn() },
  },
};
