import { describe, expect, it } from 'vitest';
import type { ReactElement } from 'react';
import {
  click,
  focus,
  getByRole,
  queryAllByRole,
  render,
} from '@/test-utils/render';
import AdminPanel from './AdminPanel/AdminPanel';
import AttachmentCard from './AttachmentCard/AttachmentCard';
import ChannelSidebarItem from './ChannelSidebarItem/ChannelSidebarItem';
import Combobox from './Combobox/Combobox';
import DateRangePicker from './DateRangePicker/DateRangePicker';
import EmojiPopover from './EmojiPopover/EmojiPopover';
import GlobalBanner from './GlobalBanner/GlobalBanner';
import ImagePreview from './ImagePreview/ImagePreview';
import LinkPreview from './LinkPreview/LinkPreview';
import MentionBadge from './MentionBadge/MentionBadge';
import MenuItem from './MenuItem/MenuItem';
import MessageActions from './MessageActions/MessageActions';
import MoreUnreadsBanner from './MoreUnreadsBanner/MoreUnreadsBanner';
import MessageSeparator from './MessageSeparator/MessageSeparator';
import Modal from './Modal/Modal';
import NewMessageBanner from './NewMessageBanner/NewMessageBanner';
import PaginationDots from './PaginationDots/PaginationDots';
import PermalinkPreview from './PermalinkPreview/PermalinkPreview';
import PinnedSavedIndicators from './PinnedSavedIndicators/PinnedSavedIndicators';
import PopoverNotice from './PopoverNotice/PopoverNotice';
import ProfilePopover from './ProfilePopover/ProfilePopover';
import ReactionsRow from './ReactionsRow/ReactionsRow';
import RightSidebarHeader from './RightSidebarHeader/RightSidebarHeader';
import SearchInput from './SearchInput/SearchInput';
import SearchTipBanner from './SearchTipBanner/SearchTipBanner';
import SectionNotice from './SectionNotice/SectionNotice';
import Select from './Select/Select';
import Spinner from './Spinner/Spinner';
import Tabs from './Tabs/Tabs';
import ThreadFooter from './ThreadFooter/ThreadFooter';
import ThreadListItem from './ThreadListItem/ThreadListItem';
import Toast from './Toast/Toast';
import TourPoint from './TourPoint/TourPoint';
import UserAvatarGroup from './UserAvatarGroup/UserAvatarGroup';

const noop = () => {};

/**
 * Each case renders with the default English, then with an override, and
 * expects the accessible name (or text) to follow.
 */
const BUTTON_NAME_CASES: Array<{
  name: string;
  english: string;
  render: (label?: string) => ReactElement;
}> = [
  {
    name: 'Modal closeLabel',
    english: 'Close',
    render: (l) => (
      <Modal title="M" onClose={noop} closeLabel={l}>
        Body
      </Modal>
    ),
  },
  {
    name: 'Modal backLabel',
    english: 'Go back',
    render: (l) => (
      <Modal title="M" showBackButton backLabel={l}>
        Body
      </Modal>
    ),
  },
  {
    name: 'TourPoint closeLabel',
    english: 'Close',
    render: (l) => (
      <TourPoint title="T" onClose={noop} closeLabel={l}>
        Body
      </TourPoint>
    ),
  },
  {
    name: 'PopoverNotice closeLabel',
    english: 'Close',
    render: (l) => (
      <PopoverNotice title="P" onClose={noop} closeLabel={l}>
        Body
      </PopoverNotice>
    ),
  },
  {
    name: 'SearchInput clearLabel',
    english: 'Clear search',
    render: (l) => <SearchInput defaultValue="abc" clearLabel={l} />,
  },
  {
    name: 'SectionNotice dismissLabel',
    english: 'Dismiss',
    render: (l) => (
      <SectionNotice title="S" onDismiss={noop} dismissLabel={l} />
    ),
  },
  {
    name: 'Toast dismissLabel',
    english: 'Dismiss',
    render: (l) => <Toast message="T" onDismiss={noop} dismissLabel={l} />,
  },
  {
    name: 'GlobalBanner dismissLabel',
    english: 'Dismiss',
    render: (l) => (
      <GlobalBanner message="G" onDismiss={noop} dismissLabel={l} />
    ),
  },
  {
    name: 'SearchTipBanner dismissLabel',
    english: 'Dismiss tip',
    render: (l) => <SearchTipBanner onDismiss={noop} dismissLabel={l} />,
  },
  {
    name: 'NewMessageBanner dismissLabel',
    english: 'Dismiss',
    render: (l) => (
      <NewMessageBanner type="new-replies" onDismiss={noop} dismissLabel={l} />
    ),
  },
  {
    name: 'RightSidebarHeader closeLabel',
    english: 'Close',
    render: (l) => (
      <RightSidebarHeader title="R" onClose={noop} closeLabel={l} />
    ),
  },
  {
    name: 'RightSidebarHeader backLabel',
    english: 'Back',
    render: (l) => <RightSidebarHeader title="R" onBack={noop} backLabel={l} />,
  },
  {
    name: 'RightSidebarHeader expandLabel',
    english: 'Expand',
    render: (l) => (
      <RightSidebarHeader title="R" onExpand={noop} expandLabel={l} />
    ),
  },
  {
    name: 'AdminPanel expandLabel',
    english: 'Expand section',
    render: (l) => <AdminPanel title="A" expandable expandLabel={l} />,
  },
  {
    name: 'LinkPreview dismissLabel',
    english: 'Remove link preview',
    render: (l) => <LinkPreview onDismiss={noop} dismissLabel={l} />,
  },
  {
    name: 'PermalinkPreview dismissLabel',
    english: 'Remove permalink preview',
    render: (l) => (
      <PermalinkPreview avatarSrc="a.png" onDismiss={noop} dismissLabel={l} />
    ),
  },
  {
    name: 'ImagePreview copyLinkLabel',
    english: 'Copy link',
    render: (l) => (
      <ImagePreview src="a.png" onCopyLink={noop} copyLinkLabel={l} />
    ),
  },
  {
    name: 'AttachmentCard downloadLabel',
    english: 'Download',
    render: (l) => <AttachmentCard fileName="f.txt" downloadLabel={l} />,
  },
  {
    name: 'ThreadListItem menuLabel',
    english: 'Thread actions',
    render: (l) => <ThreadListItem onMenuClick={noop} menuLabel={l} />,
  },
  {
    name: 'ChannelSidebarItem menuLabel',
    english: 'Channel options',
    render: (l) => <ChannelSidebarItem name="town" menuLabel={l} />,
  },
  {
    name: 'ReactionsRow addReactionLabel',
    english: 'Add reaction',
    render: (l) => <ReactionsRow showAddReaction addReactionLabel={l} />,
  },
  {
    name: 'MessageActions replyLabel',
    english: 'Reply in thread',
    render: (l) => <MessageActions type="search-results" replyLabel={l} />,
  },
  {
    name: 'ProfilePopover mentionLabel',
    english: 'Mention user',
    render: (l) => (
      <ProfilePopover
        avatarSrc="a.png"
        avatarAlt=""
        name="N"
        username="@u"
        mentionLabel={l}
      />
    ),
  },
  {
    name: 'MessageSeparator summarizeAriaLabel',
    english: 'Summarize new messages with AI',
    render: (l) => (
      <MessageSeparator
        type="new-messages"
        showAiSummary
        summarizeAriaLabel={l}
      />
    ),
  },
];

describe('built-in accessible names are overridable', () => {
  for (const { name, english, render: renderCase } of BUTTON_NAME_CASES) {
    it(`${name} defaults to "${english}" and accepts an override`, () => {
      const { rerender } = render(renderCase());
      expect(queryAllByRole('button', english).length).toBeGreaterThan(0);
      rerender(renderCase('Übersetzt'));
      expect(queryAllByRole('button', english)).toHaveLength(0);
      expect(queryAllByRole('button', 'Übersetzt').length).toBeGreaterThan(0);
    });
  }
});

describe('other overridable messages', () => {
  it('Spinner keeps aria-label as its override', () => {
    const { rerender } = render(<Spinner />);
    expect(getByRole('status').getAttribute('aria-label')).toBe('Loading');
    rerender(<Spinner aria-label="Wird geladen" />);
    expect(getByRole('status').getAttribute('aria-label')).toBe('Wird geladen');
  });

  it('Select listboxLabel replaces the "Options" fallback', () => {
    render(
      <Select
        label={<span>Model</span>}
        listboxLabel="Modelle"
        options={[{ value: 'a', label: 'A' }]}
      />,
    );
    click(getByRole('combobox'));
    expect(getByRole('listbox').getAttribute('aria-label')).toBe('Modelle');
  });

  it('Combobox listboxLabel replaces the "Options" fallback', () => {
    render(
      <Combobox
        label={<span>Model</span>}
        listboxLabel="Modelle"
        options={[{ value: 'a', label: 'A' }]}
      />,
    );
    focus(getByRole('combobox'));
    expect(getByRole('listbox').getAttribute('aria-label')).toBe('Modelle');
  });

  it('Combobox selectionsLabel names the chip group', () => {
    const props = {
      multiple: true,
      label: 'Channels',
      options: [{ value: 'a', label: 'A' }],
      value: ['a'],
    };
    const { rerender } = render(<Combobox {...props} />);
    expect(getByRole('toolbar').getAttribute('aria-label')).toBe(
      'Channels selections',
    );
    rerender(<Combobox {...props} selectionsLabel="Ausgewählte Kanäle" />);
    expect(getByRole('toolbar').getAttribute('aria-label')).toBe(
      'Ausgewählte Kanäle',
    );
  });

  it('Tabs unreadLabel replaces the hidden unread text', () => {
    render(
      <Tabs
        tabs={[
          { key: 'a', label: 'A' },
          { key: 'b', label: 'B', unreadBadge: true },
        ]}
        activeKey="a"
        onChange={noop}
        unreadLabel="Ungelesen"
      />,
    );
    expect(getByRole('tab', /^B/).textContent).toBe('BUngelesen');
  });

  it('PaginationDots label and formatPageLabel', () => {
    render(
      <PaginationDots
        pages={2}
        activePage={1}
        label="Seiten"
        formatPageLabel={(page) => `Seite ${page}`}
      />,
    );
    expect(getByRole('tablist').getAttribute('aria-label')).toBe('Seiten');
    expect(getByRole('tab', 'Seite 2')).toBeTruthy();
  });

  it('TourPoint progress forwards dot labels', () => {
    render(
      <TourPoint
        title="T"
        progress={{
          pages: 2,
          activePage: 1,
          label: 'Schritte',
          formatPageLabel: (page) => `Schritt ${page}`,
        }}
      >
        Body
      </TourPoint>,
    );
    expect(getByRole('tablist').getAttribute('aria-label')).toBe('Schritte');
    expect(getByRole('tab', 'Schritt 1')).toBeTruthy();
  });

  it('MentionBadge formatLabel', () => {
    const { container } = render(
      <MentionBadge count={2} formatLabel={(n) => `${n} Erwähnungen`} />,
    );
    expect(container.firstElementChild!.getAttribute('aria-label')).toBe(
      '2 Erwähnungen',
    );
  });

  it('UserAvatarGroup formatGroupLabel', () => {
    render(
      <UserAvatarGroup
        avatars={[{ key: 'a', name: 'A' }]}
        formatGroupLabel={(n) => `${n} Teilnehmer`}
      />,
    );
    expect(getByRole('group').getAttribute('aria-label')).toBe('1 Teilnehmer');
  });

  it('ThreadFooter reply and follow labels', () => {
    render(
      <ThreadFooter
        replyCount={2}
        formatReplyCount={(n) => `${n} Antworten`}
        formatReplyLabel={(n) => `${n} Antworten anzeigen`}
        followLabel="Folgen"
        followAriaLabel="Thread folgen"
      />,
    );
    expect(getByRole('button', '2 Antworten anzeigen').textContent).toBe(
      '2 Antworten',
    );
    expect(getByRole('button', 'Thread folgen').textContent).toBe('Folgen');
  });

  it('NewMessageBanner jump labels compose for strings', () => {
    const { rerender } = render(<NewMessageBanner countLabel="21 new" />);
    expect(getByRole('button', 'Jump to unreads, 21 new')).toBeTruthy();
    rerender(
      <NewMessageBanner
        countLabel={<span>21 neu</span>}
        jumpLabel={<span>Zu Ungelesenen</span>}
        jumpAriaLabel="Zu Ungelesenen, 21 neu"
      />,
    );
    expect(getByRole('button', 'Zu Ungelesenen, 21 neu').textContent).toBe(
      'Zu Ungelesenen',
    );
  });

  it('DateRangePicker labels', () => {
    render(
      <DateRangePicker
        valuePlaceholder="tt.mm.jjjj"
        previousMonthLabel="Vorheriger Monat"
        todayLabel="Heute"
      />,
    );
    const trigger = getByRole('button', 'tt.mm.jjjj');
    click(trigger);
    expect(getByRole('button', 'Vorheriger Monat')).toBeTruthy();
    expect(getByRole('button', 'Heute')).toBeTruthy();
  });

  it('EmojiPopover search and skin tone labels', () => {
    render(
      <EmojiPopover
        categories={[]}
        searchPlaceholder="Emojis suchen"
        skinToneButtonLabel="Hautton wählen"
        previewHintLabel="Emoji wählen"
      />,
    );
    expect(document.querySelector('input')!.getAttribute('placeholder')).toBe(
      'Emojis suchen',
    );
    expect(getByRole('button', 'Hautton wählen')).toBeTruthy();
    expect(document.body.textContent).toContain('Emoji wählen');
  });

  it('AttachmentCard formatUploadingLabel', () => {
    render(
      <AttachmentCard
        fileName="f.txt"
        state="uploading"
        progress={40}
        formatUploadingLabel={(p) => `Wird hochgeladen (${p} %)`}
      />,
    );
    expect(document.body.textContent).toContain('Wird hochgeladen (40 %)');
  });

  it('MenuItem tagLabel', () => {
    render(<MenuItem label="Agents" tag tagLabel="NEU" />);
    expect(getByRole('button').textContent).toBe('AgentsNEU');
  });

  it('MoreUnreadsBanner label', () => {
    render(<MoreUnreadsBanner label="Weitere ungelesene" />);
    expect(getByRole('button').textContent).toBe('Weitere ungelesene');
  });

  it('PinnedSavedIndicators labels', () => {
    const { container } = render(
      <PinnedSavedIndicators
        aria-label="Angeheftet und gespeichert"
        pinnedLabel="Angeheftet"
        savedLabel="Gespeichert"
      />,
    );
    const root = container.firstElementChild!;
    expect(root.getAttribute('aria-label')).toBe('Angeheftet und gespeichert');
    expect(root.textContent).toBe('Angeheftet•Gespeichert');
  });

  it('AttachmentCard formatOpenLabel', () => {
    render(
      <AttachmentCard
        fileName="f.txt"
        onOpen={noop}
        formatOpenLabel={(name) => `${name} öffnen`}
      />,
    );
    expect(getByRole('button', 'f.txt öffnen')).toBeTruthy();
  });
});
