import { fixtureCallParticipants } from '@/guidelines/_components/fixtureCallParticipants';
import {
  DIAL_IN_NUMBER,
  DIAL_IN_PIN,
  EXTERNAL_LINK,
  INTERNAL_LINK,
} from '@/fixtures/calls/callConstants';
import { callChannel } from './workspaceCall';

/** "Aiko T." for the widget's speaker line. */
const shortName = (name: string) => {
  const [first = name, ...rest] = name.split(' ');
  const last = rest[rest.length - 1];
  return last ? `${first} ${last[0]}.` : first;
};

/** Who is on the call: the signed-in user (host, talking) and a few people from a channel. */
export const callWidgetParticipants = fixtureCallParticipants(callChannel, 4);
const host = callWidgetParticipants[0];

/** The `CallWidget` props the widget demos share (call state and handlers are the demo's own). */
export const callWidgetDemoProps = {
  participants: callWidgetParticipants,
  currentUserId: host?.id ?? '',
  talkerName: host ? shortName(host.name) : '',
  talkerAvatarSrc: host?.avatarSrc,
  channelName: callChannel?.name ?? '',
  internalLink: INTERNAL_LINK,
  externalLink: EXTERNAL_LINK,
  dialInNumber: DIAL_IN_NUMBER,
  dialInPin: DIAL_IN_PIN,
};
