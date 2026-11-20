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

const TIP_INSET = 48;

/** Tip placement so the open panel stays inside the stage for each pointer. */
function tipStyle(
  pointerPosition: TourPointPointerPosition | 'none' = 'top-center',
): CSSProperties {
  switch (pointerPosition) {
    case 'top-left':
      return { left: TIP_INSET, top: TIP_INSET };
    case 'top-right':
      return { left: `calc(100% - ${TIP_INSET}px)`, top: TIP_INSET };
    case 'bottom-center':
      return { left: '50%', top: `calc(100% - ${TIP_INSET}px)` };
    case 'bottom-left':
      return { left: TIP_INSET, top: `calc(100% - ${TIP_INSET}px)` };
    case 'bottom-right':
      return {
        left: `calc(100% - ${TIP_INSET}px)`,
        top: `calc(100% - ${TIP_INSET}px)`,
      };
    case 'left-center':
      return { left: TIP_INSET, top: '50%' };
    case 'right-center':
      return { left: `calc(100% - ${TIP_INSET}px)`, top: '50%' };
    case 'none':
      return { left: 'calc(50% - 176px)', top: 'calc(50% - 120px)' };
    case 'top-center':
    default:
      return { left: '50%', top: TIP_INSET };
  }
}

/** Per-example stage; tip origin placed so the open card stays in bounds. */
function TourStage({
  children,
  style,
  pointerPosition = 'top-center',
}: {
  children: ReactNode;
  style?: CSSProperties;
  pointerPosition?: TourPointPointerPosition | 'none';
}) {
  return (
    <div
      style={{
        position: 'relative',
        minHeight: 420,
        background:
          'color-mix(in srgb, var(--center-channel-color) 4%, transparent)',
        borderRadius: 'var(--radius-m)',
        ...style,
      }}
    >
      <div style={{ position: 'absolute', ...tipStyle(pointerPosition) }}>
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
    <TourStage pointerPosition={args.pointerPosition ?? 'top-center'}>
      <TourPoint {...args} />
    </TourStage>
  ),
};

export const ClosedPulsingDot: Story = {
  parameters: { controls: { disable: true } },
  render: function ClosedPulsingDotStory() {
    return (
      <TourStage pointerPosition="top-center">
        <TourPoint
          title="Welcome to channels"
          pointerPosition="top-center"
          defaultOpen={false}
          onClose={() => {}}
          primaryAction={{ label: 'Got it', onClick: () => {} }}
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
      <TourStage pointerPosition="top-center">
        <TourPoint
          title="Collapse stays on the tip"
          pointerPosition="top-center"
          defaultOpen
          onClose={() => {}}
          primaryAction={{ label: 'Got it', onClick: () => {} }}
        >
          Click × to collapse. The pulsing dot stays put. Click the dot to
          reopen.
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
      <TourStage pointerPosition="top-center">
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
    <TourStage pointerPosition="none">
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
            gridTemplateColumns: 'repeat(auto-fill, minmax(440px, 1fr))',
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
              <TourStage pointerPosition={pointerPosition}>
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
        <TourStage pointerPosition="none" style={{ maxWidth: 480 }}>
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
