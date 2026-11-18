import { render } from '@/test-utils/render';
import { describe, expect, it } from 'vitest';
import CallWidget, { type CallWidgetProps } from './CallWidget';

const noop = () => {};
const props: CallWidgetProps = {
  participants: [],
  talkerName: 'Alex T.',
  talkerAvatarSrc: '',
  channelName: 'Town Square',
  muted: false,
  onToggleMute: noop,
  handRaised: false,
  onToggleHand: noop,
  sharing: false,
  onToggleShare: noop,
  onExpand: noop,
  onLeave: noop,
  overlay: null,
  onToggleMenu: noop,
  onToggleParticipants: noop,
  onOpenCallInfo: noop,
  onCloseCallInfo: noop,
  externalEnabled: false,
  onExternalEnabledChange: noop,
  internalLink: '',
  externalLink: '',
  dialInNumber: '',
  dialInPin: '',
};

/** The icon that sits before the channel name in the sub line. */
const channelIcon = (container: HTMLElement) =>
  container.querySelector('[class*="widget__channel"] svg');

describe('CallWidget channel name', () => {
  it('shows a globe before a plain channel name', () => {
    const { container } = render(<CallWidget {...props} />);
    expect(channelIcon(container)).not.toBeNull();
  });

  it('leaves the globe out when the name starts with an emoji', () => {
    const { container } = render(
      <CallWidget {...props} channelName="🚨 Incident Status Updates" />,
    );
    expect(channelIcon(container)).toBeNull();
    expect(container.textContent).toContain('🚨 Incident Status Updates');
  });
});
