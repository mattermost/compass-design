import { useState, type CSSProperties, type ReactNode } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import TourPoint from './TourPoint';
import type { TourPointPointerPosition } from './TourPoint';

const POINTER_VARIANTS: TourPointPointerPosition[] = [
  'top-center',
  'top-left',
  'top-right',
  'bottom-center',
  'bottom-left',
  'bottom-right',
  'left-center',
  'right-center',
];

function labelFor(position: TourPointPointerPosition) {
  return position
    .split('-')
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(' ');
}

/** Places the tip origin at the stage center so open ↔ closed stays put. */
function TourStage({
  children,
  style,
}: {
  children: ReactNode;
  style?: CSSProperties;
}) {
  return (
    <div
      style={{
        position: 'relative',
        minHeight: 320,
        padding: 96,
        background:
          'color-mix(in srgb, var(--center-channel-color) 4%, transparent)',
        borderRadius: 'var(--radius-m)',
        ...style,
      }}
    >
      <div
        aria-hidden
        style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          width: 24,
          height: 24,
          margin: '-12px 0 0 -12px',
          border:
            '1px dashed color-mix(in srgb, var(--center-channel-color) 28%, transparent)',
          borderRadius: '50%',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
        }}
      >
        {children}
      </div>
    </div>
  );
}

const meta = {
  title: 'Patterns/Onboarding/Tour Point',
  component: TourPoint,
  tags: ['autodocs'],
  argTypes: {
    pointerPosition: {
      control: 'select',
      options: ['none', ...POINTER_VARIANTS],
    },
  },
} satisfies Meta<typeof TourPoint>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: 'Tour point title',
    pointerPosition: 'top-center',
    onClose: fn(),
    progress: { pages: 3, activePage: 1 },
    primaryAction: { label: 'Next', onClick: fn() },
    children:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer vel orci id urna facilisis luctus.',
  },
  render: (args) => (
    <TourStage>
      <TourPoint {...args} />
    </TourStage>
  ),
};

export const ClosedPulsingDot: Story = {
  parameters: { controls: { disable: true } },
  render: function ClosedPulsingDotStory() {
    return (
      <TourStage>
        <TourPoint
          title="Welcome to channels"
          pointerPosition="top-center"
          defaultOpen={false}
          onClose={() => {}}
          progress={{ pages: 3, activePage: 0 }}
          primaryAction={{ label: 'Next', onClick: () => {} }}
        >
          Starts closed as a pulsing dot. Click the dot to open the tip.
        </TourPoint>
      </TourStage>
    );
  },
};

export const OpenAndClose: Story = {
  parameters: { controls: { disable: true } },
  render: function OpenAndCloseStory() {
    return (
      <TourStage>
        <TourPoint
          title="Collapse stays on the tip"
          pointerPosition="top-center"
          defaultOpen
          onClose={() => {}}
          progress={{ pages: 3, activePage: 0 }}
          primaryAction={{ label: 'Next', onClick: () => {} }}
        >
          Click × to collapse. The pulsing dot stays on the dashed anchor. Click
          the dot to reopen.
        </TourPoint>
      </TourStage>
    );
  },
};

export const MultiStep: Story = {
  parameters: { controls: { disable: true } },
  render: function MultiStepStory() {
    const steps = [
      {
        title: 'Find your team',
        body: 'Jump between channels from the sidebar. Use Next, Previous, or the step dots.',
      },
      {
        title: 'Start a thread',
        body: 'Reply in a thread to keep the main channel readable for everyone else.',
      },
      {
        title: 'You are ready',
        body: 'That is the tour. Finish with Done, or collapse with ×.',
      },
    ];
    const [step, setStep] = useState(0);
    const [open, setOpen] = useState(true);
    const first = step === 0;
    const last = step >= steps.length - 1;

    const goTo = (next: number) => {
      setStep(next);
      setOpen(true);
    };

    return (
      <TourStage>
        <TourPoint
          title={steps[step].title}
          pointerPosition="top-center"
          open={open}
          onOpenChange={setOpen}
          onClose={() => setOpen(false)}
          progress={{
            pages: steps.length,
            activePage: step + 1,
            onPageChange: (page) => goTo(page - 1),
          }}
          secondaryAction={
            first
              ? undefined
              : {
                  label: 'Previous',
                  onClick: () => goTo(step - 1),
                }
          }
          primaryAction={{
            label: last ? 'Done' : 'Next',
            onClick: () => {
              if (last) {
                setOpen(false);
                return;
              }
              goTo(step + 1);
            },
          }}
        >
          {steps[step].body}
        </TourPoint>
      </TourStage>
    );
  },
};

export const NoPointer: Story = {
  args: {
    title: 'Standalone tour copy',
    pointerPosition: 'none',
    onClose: fn(),
    primaryAction: { label: 'Got it', onClick: fn() },
    children:
      'Set pointerPosition to none when the card is shown without an on-canvas anchor.',
  },
  render: (args) => (
    <TourStage>
      <TourPoint {...args} />
    </TourStage>
  ),
};

export const AllVariants: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={{ display: 'grid', gap: 32 }}>
      <section>
        <h3
          style={{
            marginBottom: 12,
            fontSize: 12,
            color: 'var(--center-channel-color)',
          }}
        >
          Pointer placement
        </h3>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: 24,
          }}
        >
          {POINTER_VARIANTS.map((pointerPosition) => (
            <div key={pointerPosition}>
              <p
                style={{
                  marginBottom: 8,
                  fontSize: 12,
                  color: 'var(--center-channel-color)',
                }}
              >
                {labelFor(pointerPosition)}
              </p>
              <TourStage style={{ minHeight: 280, padding: 72 }}>
                <TourPoint
                  title="Tour point title"
                  pointerPosition={pointerPosition}
                  onClose={fn()}
                  progress={{ pages: 3, activePage: 1 }}
                  primaryAction={{ label: 'Next', onClick: fn() }}
                >
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  Integer vel orci id urna facilisis luctus.
                </TourPoint>
              </TourStage>
            </div>
          ))}
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
          No pointer
        </h3>
        <TourStage>
          <TourPoint
            title="Standalone tour copy"
            pointerPosition="none"
            onClose={fn()}
            primaryAction={{ label: 'Got it', onClick: fn() }}
          >
            Set pointerPosition to none when the card is shown without an
            on-canvas anchor.
          </TourPoint>
        </TourStage>
      </section>
    </div>
  ),
};
