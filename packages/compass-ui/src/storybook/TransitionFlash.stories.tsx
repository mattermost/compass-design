import type { Meta, StoryObj } from '@storybook/react';
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from 'react';
import GlobeIcon from '@mattermost/compass-icons/components/globe';
import BookmarkIcon from '@mattermost/compass-icons/components/bookmark-outline';
import AtIcon from '@mattermost/compass-icons/components/at';
import Button from '../components/Button/Button';
import IconButton from '../components/IconButton/IconButton';
import TileButton from '../components/TileButton/TileButton';
import CardButton from '../components/CardButton/CardButton';
import Chip from '../components/Chip/Chip';
import EmojiButton from '../components/EmojiButton/EmojiButton';
import ReactionButton from '../components/ReactionButton/ReactionButton';
import ReactionsRow from '../components/ReactionsRow/ReactionsRow';
import Dropdown from '../components/Dropdown/Dropdown';
import Tabs from '../components/Tabs/Tabs';
import PaginationDots from '../components/PaginationDots/PaginationDots';
import MoreUnreadsBanner from '../components/MoreUnreadsBanner/MoreUnreadsBanner';
import AttachmentCard from '../components/AttachmentCard/AttachmentCard';
import PasswordInput from '../components/PasswordInput/PasswordInput';
import Combobox from '../components/Combobox/Combobox';
import TextInput from '../components/TextInput/TextInput';
import RightSidebarHeader from '../components/RightSidebarHeader/RightSidebarHeader';
import ChannelInfoMsgHeader from '../components/ChannelInfoMsgHeader/ChannelInfoMsgHeader';
import MenuItem from '../components/MenuItem/MenuItem';
import Icon from '../components/Icon/Icon';

/**
 * Repro for compass-design#184: controls flash when moving between neighbours.
 *
 * Cause 1 — a `background-color` / `color` transition on the base state fades
 * fills when a toggled / selected / active state changes.
 * Cause 2 — a resting 0%-opacity outline plus an `outline-color` transition.
 * A consumer reset loaded after Compass (`*:focus { outline: none }`, as in the
 * Mattermost webapp) turns the outline off while focused, so when focus leaves
 * the ring fades out on the control that lost focus.
 */

const RESET_ID = 'compass-flash-repro-reset';
const WATCHED = [
  'background-color',
  'color',
  'outline-color',
  'outline-offset',
];

type LogEntry = {
  t: number;
  component: string;
  tag: string;
  property: string;
  duration: string;
};

declare global {
  interface Window {
    /** Populated by the transition detector; read by scripted checks. */
    __transitionLog?: LogEntry[];
  }
}

/** Compass CSS-module class → readable component name (`_icon-button_ab12` → `icon-button`). */
function componentName(el: Element): string {
  for (const cls of Array.from(el.classList)) {
    const m =
      /^_?([a-z0-9-]+?)(?:__[a-z0-9-]+)?(?:--[a-z0-9-]+)?_[A-Za-z0-9-]{4,}$/.exec(
        cls,
      );
    if (m) return cls.replace(/^_/, '').replace(/_[A-Za-z0-9-]{4,}$/, '');
  }
  return el.classList[0] ?? '(none)';
}

function useResetToggle(enabled: boolean) {
  useEffect(() => {
    document.getElementById(RESET_ID)?.remove();
    if (!enabled) return undefined;
    // Re-appended on every enable so it is the last stylesheet in <head> and
    // wins on load order, exactly like a host reset loaded after Compass.
    const style = document.createElement('style');
    style.id = RESET_ID;
    style.textContent = '*:focus { outline: none; }';
    document.head.appendChild(style);
    return () => style.remove();
  }, [enabled]);
}

function useTransitionDetector(active: boolean) {
  const [log, setLog] = useState<LogEntry[]>([]);
  const start = useRef(performance.now());

  useEffect(() => {
    window.__transitionLog = [];
    if (!active) return undefined;
    const onRun = (e: Event) => {
      const te = e as TransitionEvent;
      if (!WATCHED.includes(te.propertyName)) return;
      const target = te.target as Element;
      const entry: LogEntry = {
        t: Math.round(performance.now() - start.current),
        component: componentName(target),
        tag: target.tagName.toLowerCase(),
        property: te.propertyName,
        duration: getComputedStyle(target).transitionDuration.split(',')[0],
      };
      window.__transitionLog?.push(entry);
      setLog((prev) => [entry, ...prev].slice(0, 200));
    };
    // The intentional keyboard-ring fade-in is a keyframe animation, logged
    // separately so it is distinguishable from an unwanted fade-out.
    const onAnim = (e: Event) => {
      const ae = e as AnimationEvent;
      if (!ae.animationName.includes('focus-ring-in')) return;
      const target = ae.target as Element;
      const entry: LogEntry = {
        t: Math.round(performance.now() - start.current),
        component: componentName(target),
        tag: target.tagName.toLowerCase(),
        property: 'focus-ring-in (animation, expected on keyboard focus)',
        duration: getComputedStyle(target).animationDuration.split(',')[0],
      };
      window.__transitionLog?.push(entry);
      setLog((prev) => [entry, ...prev].slice(0, 200));
    };
    document.addEventListener('transitionrun', onRun, true);
    document.addEventListener('animationstart', onAnim, true);
    return () => {
      document.removeEventListener('transitionrun', onRun, true);
      document.removeEventListener('animationstart', onAnim, true);
    };
  }, [active]);

  const clear = useCallback(() => {
    window.__transitionLog = [];
    setLog([]);
  }, []);
  return { log, clear };
}

const panel: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 'var(--spacing-l)',
  padding: 'var(--spacing-xl)',
  border: '1px solid rgba(var(--center-channel-color-rgb), 0.16)',
  borderRadius: 'var(--radius-m)',
};
const row: CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  gap: 'var(--spacing-m)',
};

function Section({
  title,
  hint,
  children,
}: {
  title: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <section style={panel}>
      <div>
        <h3 style={{ margin: 0 }}>{title}</h3>
        {hint && (
          <p
            style={{
              margin: 'var(--spacing-xxs) 0 0',
              color: 'rgba(var(--center-channel-color-rgb), 0.72)',
            }}
          >
            {hint}
          </p>
        )}
      </div>
      {children}
    </section>
  );
}

function Labelled({ name, children }: { name: string; children: ReactNode }) {
  return (
    <div
      data-flash-row={name}
      style={{ ...row, gap: 'var(--spacing-l)' }}
      aria-label={name}
    >
      <span
        style={{
          width: 120,
          fontSize: 'var(--font-size-75)',
          color: 'rgba(var(--center-channel-color-rgb), 0.72)',
        }}
      >
        {name}
      </span>
      {children}
    </div>
  );
}

const noop = () => {};

/** Cause 1: a peer group where clicking one toggles it on and its peer off. */
function InvertedPeerGroup() {
  const [on, setOn] = useState<'mentions' | 'saved'>('mentions');
  return (
    <div
      data-flash-row="inverted-peers"
      style={{
        ...row,
        background: 'var(--sidebar-bg, #1e325c)',
        padding: 'var(--spacing-l)',
        borderRadius: 'var(--radius-m)',
      }}
    >
      <IconButton
        style="inverted"
        aria-label="Recent mentions"
        toggled={on === 'mentions'}
        onClick={() => setOn('mentions')}
        icon={<Icon glyph={<AtIcon />} />}
      />
      <IconButton
        style="inverted"
        aria-label="Saved messages"
        toggled={on === 'saved'}
        onClick={() => setOn('saved')}
        icon={<Icon glyph={<BookmarkIcon />} />}
      />
    </div>
  );
}

function StatePeers() {
  const [tile, setTile] = useState(0);
  const [emoji, setEmoji] = useState(0);
  const [card, setCard] = useState(0);
  const [tab, setTab] = useState('a');
  const [page, setPage] = useState(0);
  const [menu, setMenu] = useState(0);
  const [action, setAction] = useState(false);
  const [info, setInfo] = useState(0);
  const [ack, setAck] = useState(false);
  return (
    <>
      <Labelled name="TileButton">
        {[0, 1].map((i) => (
          <TileButton
            key={i}
            label={`Tile ${i + 1}`}
            icon={<Icon glyph={<GlobeIcon />} />}
            toggled={tile === i}
            onClick={() => setTile(i)}
          />
        ))}
      </Labelled>
      <Labelled name="EmojiButton">
        {[0, 1].map((i) => (
          <EmojiButton
            key={i}
            emoji="smile"
            aria-label={`Emoji ${i + 1}`}
            toggled={emoji === i}
            onClick={() => setEmoji(i)}
          />
        ))}
      </Labelled>
      <Labelled name="CardButton">
        {[0, 1].map((i) => (
          <CardButton
            key={i}
            title={`Card ${i + 1}`}
            icon={<Icon glyph={<GlobeIcon />} />}
            selected={card === i}
            onClick={() => setCard(i)}
          />
        ))}
      </Labelled>
      <Labelled name="Tabs">
        <Tabs
          tabs={[
            { key: 'a', label: 'One' },
            { key: 'b', label: 'Two' },
            { key: 'c', label: 'Three' },
          ]}
          activeKey={tab}
          onChange={setTab}
        />
      </Labelled>
      <Labelled name="PaginationDots">
        <PaginationDots pages={4} activePage={page} onPageChange={setPage} />
      </Labelled>
      <Labelled name="MenuItem">
        <div style={{ width: 240 }}>
          {[0, 1].map((i) => (
            <MenuItem
              key={i}
              label={`Item ${i + 1}`}
              active={menu === i}
              onClick={() => setMenu(i)}
            />
          ))}
        </div>
      </Labelled>
      <Labelled name="ReactionsRow">
        <ReactionsRow
          acknowledged
          acknowledgeCount={1}
          currentUserAcknowledged={ack}
          onAcknowledge={() => setAck((v) => !v)}
        />
      </Labelled>
      <Labelled name="RightSidebarHeader">
        <RightSidebarHeader
          title="Saved messages"
          actionLabel="Filters"
          actionActive={action}
          onActionClick={() => setAction((v) => !v)}
          onExpand={noop}
          onClose={noop}
        />
      </Labelled>
      <Labelled name="ChannelInfoMsgHeader">
        <ChannelInfoMsgHeader
          tabs={['Pinned', 'Files', 'About'].map((label, i) => ({
            label,
            active: info === i,
            onClick: () => setInfo(i),
          }))}
        />
      </Labelled>
    </>
  );
}

/** Cause 2: a row of focusable controls — click between neighbours. */
function FocusRow() {
  const [pw, setPw] = useState('');
  const [text, setText] = useState('clear me');
  return (
    <>
      <Labelled name="IconButton">
        {[1, 2, 3].map((i) => (
          <IconButton
            key={i}
            aria-label={`Icon button ${i}`}
            icon={<Icon glyph={<GlobeIcon />} />}
          />
        ))}
      </Labelled>
      <Labelled name="Button">
        <Button emphasis="secondary">One</Button>
        <Button emphasis="tertiary">Two</Button>
        <Button emphasis="quaternary">Three</Button>
      </Labelled>
      <Labelled name="TileButton">
        {[1, 2].map((i) => (
          <TileButton
            key={i}
            label={`Tile ${i}`}
            icon={<Icon glyph={<GlobeIcon />} />}
          />
        ))}
      </Labelled>
      <Labelled name="CardButton">
        {[1, 2].map((i) => (
          <CardButton
            key={i}
            title={`Card ${i}`}
            icon={<Icon glyph={<GlobeIcon />} />}
          />
        ))}
      </Labelled>
      <Labelled name="Chip">
        <Chip onRemove={noop}>Chip one</Chip>
        <Chip onRemove={noop}>Chip two</Chip>
      </Labelled>
      <Labelled name="EmojiButton">
        <EmojiButton emoji="smile" aria-label="Smile" />
        <EmojiButton emoji="heart" aria-label="Heart" />
      </Labelled>
      <Labelled name="ReactionButton">
        <ReactionButton emoji="thumbsup" count={2} />
        <ReactionButton emoji="heart" count={5} />
      </Labelled>
      <Labelled name="ReactionsRow">
        <ReactionsRow
          reactions={[
            { emoji: 'thumbsup', count: 2 },
            { emoji: 'heart', count: 1, byCurrentUser: true },
          ]}
          showAddReaction
          acknowledged
          acknowledgeCount={1}
          onAcknowledge={noop}
          onAddReaction={noop}
        />
      </Labelled>
      <Labelled name="Dropdown">
        <Dropdown>One</Dropdown>
        <Dropdown>Two</Dropdown>
      </Labelled>
      <Labelled name="Tabs">
        <Tabs
          tabs={[
            { key: 'a', label: 'One' },
            { key: 'b', label: 'Two' },
          ]}
          activeKey="a"
          onChange={noop}
        />
      </Labelled>
      <Labelled name="PaginationDots">
        <PaginationDots pages={4} activePage={0} onPageChange={noop} />
      </Labelled>
      <Labelled name="MoreUnreadsBanner">
        <MoreUnreadsBanner onClick={noop} />
        <MoreUnreadsBanner onClick={noop} direction="up" />
      </Labelled>
      <Labelled name="AttachmentCard">
        <AttachmentCard
          fileName="report.pdf"
          fileType="pdf"
          onOpen={noop}
          onRemove={noop}
        />
      </Labelled>
      <Labelled name="PasswordInput">
        <PasswordInput
          label="Password"
          value={pw}
          onChange={(e) => setPw(e.target.value)}
        />
      </Labelled>
      <Labelled name="Combobox">
        <Combobox
          label="Pick"
          options={[
            { value: 'a', label: 'Alpha' },
            { value: 'b', label: 'Beta' },
          ]}
          defaultValue="a"
          clearable
        />
      </Labelled>
      <Labelled name="FieldClearButton">
        <TextInput
          label="Text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          clearable
        />
      </Labelled>
      <Labelled name="RightSidebarHeader">
        <RightSidebarHeader
          title="Header"
          onBack={noop}
          onExpand={noop}
          onPopout={noop}
          onClose={noop}
        />
      </Labelled>
    </>
  );
}

function Repro({ resetOn: initialReset }: { resetOn: boolean }) {
  const [resetOn, setResetOn] = useState(initialReset);
  const [detect, setDetect] = useState(true);
  useResetToggle(resetOn);
  const { log, clear } = useTransitionDetector(detect);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--spacing-xl)',
        maxWidth: 960,
      }}
    >
      <div style={{ ...row, gap: 'var(--spacing-xl)' }}>
        <label>
          <input
            type="checkbox"
            checked={resetOn}
            onChange={(e) => setResetOn(e.target.checked)}
            data-testid="reset-toggle"
          />{' '}
          Load <code>*:focus {'{ outline: none }'}</code> after Compass
        </label>
        <label>
          <input
            type="checkbox"
            checked={detect}
            onChange={(e) => setDetect(e.target.checked)}
          />{' '}
          Transition detector
        </label>
        <button type="button" onClick={clear}>
          Clear log
        </button>
      </div>

      <Section
        title="Cause 1 — state change crossfade"
        hint="Click an inverted IconButton: it should toggle on and its peer off instantly, with no background-color / color transitionrun on state change."
      >
        <InvertedPeerGroup />
        <StatePeers />
      </Section>

      <Section
        title="Cause 2 — ring fades out when focus leaves"
        hint="With the reset on, mouse-click one control then another. Any outline-color / outline-offset transitionrun is the flash. Tabbing in should fade the ring in (one focus-ring-in animation, no outline transitions); focus leaving must not animate."
      >
        <FocusRow />
      </Section>

      <Section
        title="Transition detector"
        hint="Logs transitionrun for background-color, color, outline-color and outline-offset (newest first). Hover fades are expected; none should fire on click-away or on toggling state."
      >
        <output
          data-testid="transition-log"
          style={{
            fontFamily: 'monospace',
            fontSize: 'var(--font-size-75)',
            maxHeight: 240,
            overflow: 'auto',
            display: 'block',
          }}
        >
          {log.length === 0 ? (
            <em>No watched transitions yet.</em>
          ) : (
            log.map((l, i) => (
              <div key={`${l.t}-${i}`}>
                {String(l.t).padStart(6)}ms {l.component} &lt;{l.tag}&gt;{' '}
                {l.property} ({l.duration})
              </div>
            ))
          )}
        </output>
      </Section>
    </div>
  );
}

const meta = {
  title: 'Testing/Transition Flash Repro',
  component: Repro,
  parameters: { layout: 'padded' },
} satisfies Meta<typeof Repro>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Reset loaded: reproduces the webapp conditions (#184). */
export const WithHostReset: Story = { args: { resetOn: true } };

/** No reset: Compass CSS alone. Cause 1 still applies; Cause 2 does not. */
export const CompassOnly: Story = { args: { resetOn: false } };
