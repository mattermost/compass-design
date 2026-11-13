import { DraftsPage, type DraftsPageItem } from '@mattermost/compass-proto';

const PREVIEW =
  'Here is the draft of the release notes for 10.4. Can someone double-check the migration section before I post it?';
const noop = () => undefined;

const DRAFTS: DraftsPageItem[] = [
  {
    id: 'd1',
    destination: 'Town Square',
    previewText: PREVIEW,
    timestamp: 'Edited 5 mins ago',
    onClick: noop,
    onEdit: noop,
    onSend: noop,
    onDelete: noop,
  },
  {
    id: 'd2',
    destination: 'Leonard Riley',
    previewText: 'Thanks for the review. I’ll update the spacing and push.',
    timestamp: 'Edited yesterday',
    onClick: noop,
    onEdit: noop,
    onSend: noop,
    onDelete: noop,
  },
  {
    id: 'd3',
    destination: 'Design',
    threadLabel: 'Thread',
    previewText: 'One more option: keep the tabs but move the counts inline.',
    timestamp: 'Edited Nov 10',
    onClick: noop,
    onDelete: noop,
  },
];

const SCHEDULED: DraftsPageItem[] = [
  {
    id: 's1',
    status: 'scheduled',
    destination: 'Town Square',
    previewText: 'Reminder: the all-hands starts in ten minutes.',
    timestamp: 'Send on Mon, Nov 16 at 9:00 AM',
    onClick: noop,
    onEdit: noop,
    onSend: noop,
    onDelete: noop,
  },
  {
    id: 's2',
    status: 'failed',
    destination: 'Old Project',
    previewText: 'Wrapping up the retro notes here.',
    timestamp: 'Was due Fri, Nov 13 at 5:00 PM',
    errorMessage: 'This channel was archived before the message could send.',
    onClick: noop,
    onEdit: noop,
    onDelete: noop,
  },
];

const frame = {
  height: 480,
  maxWidth: 720,
  border: '1px solid rgba(var(--center-channel-color-rgb), 0.12)',
} as const;

export default function DraftsPageLibrary() {
  return (
    <>
      <div style={frame}>
        <DraftsPage drafts={DRAFTS} scheduled={SCHEDULED} />
      </div>
      <div style={{ ...frame, marginTop: 24 }}>
        <DraftsPage drafts={[]} scheduled={[]} defaultTab="scheduled" />
      </div>
    </>
  );
}
