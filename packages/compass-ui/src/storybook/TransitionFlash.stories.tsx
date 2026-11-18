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

const WEBAPP_CSS_ID = 'compass-flash-repro-webapp-css';
const WORKAROUND_CSS_ID = 'compass-flash-repro-webapp-workaround';

/**
 * Global CSS the Mattermost webapp loads after Compass, copied verbatim from
 * `mattermost/mattermost` master (comments trimmed):
 * - `webapp/channels/src/sass/base/_structure.scss`: the global focus reset.
 * - `webapp/channels/src/sass/utils/_modifiers.scss`: `.a11y--focused` (the
 *   webapp's own keyboard-focus class) and the rules that suppress it on
 *   Compass controls and re-add outline style and width under `#root`
 *   (`.sass` `:is()` nesting expanded by hand).
 */
const WEBAPP_GLOBAL_CSS = `
*:focus {
  outline: none;
}

.a11y--focused {
  border-radius: 4px;
  box-shadow: 0 0 1px 3px rgba(var(--link-color-rgb), 0.5), 0 0 0 1px var(--link-color);
}

/* Theme rule: webapp/channels/src/utils/utils.tsx applies this via changeCss()
   from the user's theme link colour, under body.app__body (higher specificity
   than the plain class above). */
.app__body .a11y--focused {
  box-shadow: 0 0 1px 3px rgba(var(--link-color-rgb), 0.5), 0 0 0 1px var(--link-color);
}

:is(#root, #root-portal) [class*="_text-input__wrapper"] .a11y--focused,
:is(#root, #root-portal) [class*="_text-area__wrapper"] .a11y--focused,
:is(#root, #root-portal) [class*="_search-input__wrapper"] .a11y--focused,
:is(#root, #root-portal) [class*="_select__wrapper"] .a11y--focused,
:is(#root, #root-portal) [class*="_combobox__wrapper"] .a11y--focused,
:is(#root, #root-portal) [class*="_date-range-picker__trigger"].a11y--focused,
:is(#root, #root-portal) button[class*="_button--emphasis-"].a11y--focused,
:is(#root, #root-portal) button[class*="_icon-button"].a11y--focused,
:is(#root, #root-portal) button[class*="_action-button"].a11y--focused {
  box-shadow: none;
}

#root [class*="_text-input__wrapper"]:focus-visible,
#root [class*="_text-area__wrapper"]:focus-visible,
#root [class*="_search-input__wrapper"]:focus-visible,
#root [class*="_select__wrapper"]:focus-visible,
#root [class*="_combobox__wrapper"]:focus-visible,
#root [class*="_date-range-picker__trigger"]:focus-visible,
#root button[class*="_button--emphasis-"]:focus-visible,
#root button[class*="_icon-button"]:focus-visible,
#root button[class*="_action-button"]:focus-visible {
  outline-style: solid;
  outline-width: 2px;
}
`;

/**
 * The temporary IconButton workaround currently on webapp master
 * (`_modifiers.scss`, mattermost/mattermost#39029). It hides the bug on the
 * webapp, which is why the bug can't be seen there until it is removed.
 */
const WEBAPP_WORKAROUND_CSS = `
button[class*="_icon-button_"],
a[class*="_icon-button_"] {
  transition: none;
}

button[class*="_icon-button_"]:focus-visible,
a[class*="_icon-button_"]:focus-visible {
  transition:
    outline-color var(--duration-quick) var(--ease-transition),
    outline-offset var(--duration-quick) var(--ease-transition);
}
`;
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

/** Appends `css` as the last stylesheet in <head>, like a host loaded after Compass. */
function useInjectedCss(id: string, css: string, enabled: boolean) {
  useEffect(() => {
    document.getElementById(id)?.remove();
    if (!enabled) return undefined;
    const style = document.createElement('style');
    style.id = id;
    style.textContent = css;
    document.head.appendChild(style);
    return () => style.remove();
  }, [id, css, enabled]);
}

/**
 * Emulates the webapp's a11y controller (`webapp/channels/src/utils/a11y_controller.ts`),
 * read from source rather than guessed:
 * - It listens for keydown/keyup on the document and for `focus` (capture).
 * - While an a11y key is down (plain Tab included), a `focus` on ANY element
 *   clears every `.a11y--focused` and adds it to the new target. It does not
 *   look at what the element is, so Compass controls get it too.
 * - The class is not tied to `:focus-visible` and is not removed on blur; it is
 *   cleared on the next a11y focus. (F6 / arrow / manual-focus paths are not
 *   emulated.)
 * It also puts `app__body` on <body>, which the theme rule is scoped to.
 */
function useA11yFocusedClass(enabled: boolean) {
  useEffect(() => {
    if (!enabled) return undefined;
    document.body.classList.add('app__body');
    let tabDown = false;
    const clear = () =>
      document
        .querySelectorAll('.a11y--focused')
        .forEach((el) => el.classList.remove('a11y--focused'));
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Tab' && !e.ctrlKey && !e.metaKey && !e.altKey) {
        tabDown = true;
      }
    };
    const onKeyUp = () => {
      tabDown = false;
    };
    const onFocus = (e: FocusEvent) => {
      if (!tabDown) return;
      clear();
      (e.target as HTMLElement).classList?.add('a11y--focused');
    };
    document.addEventListener('keydown', onKeyDown, true);
    document.addEventListener('keyup', onKeyUp, true);
    document.addEventListener('focus', onFocus, true);
    return () => {
      document.removeEventListener('keydown', onKeyDown, true);
      document.removeEventListener('keyup', onKeyUp, true);
      document.removeEventListener('focus', onFocus, true);
      document.body.classList.remove('app__body');
      clear();
    };
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
  const [toggle, setToggle] = useState(false);
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
      <Labelled name="IconButton toggle">
        <IconButton
          aria-label="Toggle"
          toggled={toggle}
          onClick={() => setToggle((v) => !v)}
          icon={<Icon glyph={<GlobeIcon />} />}
        />
      </Labelled>
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
            emoji="😀"
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
        <EmojiButton emoji="😀" aria-label="Smile" />
        <EmojiButton emoji="❤️" aria-label="Heart" />
      </Labelled>
      <Labelled name="ReactionButton">
        <ReactionButton emoji="👍" count={2} />
        <ReactionButton emoji="❤️" count={5} />
      </Labelled>
      <Labelled name="ReactionsRow">
        <ReactionsRow
          reactions={[
            { emoji: '👍', count: 2 },
            { emoji: '❤️', count: 1, byCurrentUser: true },
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

/**
 * The global header + right panel from the issue. The webapp moves focus to the
 * first control in the panel on every Saved / Recent mentions switch, so the
 * previously focused panel control loses focus on the next click. With a
 * resting ring + outline transition that control flashes a fading ring even
 * though `:focus-visible` is false throughout.
 */
function WebappPanelScenario() {
  const [view, setView] = useState<'mentions' | 'saved'>('mentions');
  const panelRef = useRef<HTMLDivElement>(null);
  const first = useRef(true);

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    panelRef.current?.querySelector<HTMLElement>('button')?.focus();
  }, [view]);

  return (
    <div
      data-flash-row="webapp-scenario"
      style={{ ...row, alignItems: 'stretch', gap: 0 }}
    >
      <div
        style={{
          ...row,
          background: 'var(--sidebar-header-bg)',
          padding: 'var(--spacing-l)',
          borderRadius: 'var(--radius-m) 0 0 var(--radius-m)',
          alignItems: 'flex-start',
        }}
      >
        <IconButton
          style="inverted"
          aria-label="Recent mentions"
          toggled={view === 'mentions'}
          onClick={() => setView('mentions')}
          icon={<Icon glyph={<AtIcon />} />}
        />
        <IconButton
          style="inverted"
          aria-label="Saved messages"
          toggled={view === 'saved'}
          onClick={() => setView('saved')}
          icon={<Icon glyph={<BookmarkIcon />} />}
        />
      </div>
      <div
        ref={panelRef}
        style={{
          flex: 1,
          border: '1px solid rgba(var(--center-channel-color-rgb), 0.16)',
          borderRadius: '0 var(--radius-m) var(--radius-m) 0',
          background: 'var(--center-channel-bg)',
        }}
      >
        <RightSidebarHeader
          title={view === 'mentions' ? 'Recent mentions' : 'Saved messages'}
          onExpand={noop}
          onClose={noop}
        />
      </div>
    </div>
  );
}

function Repro({
  resetOn: initialReset,
  workaround: initialWorkaround = false,
}: {
  resetOn: boolean;
  workaround?: boolean;
}) {
  const [resetOn, setResetOn] = useState(initialReset);
  const [workaroundOn, setWorkaroundOn] = useState(initialWorkaround);
  const [detect, setDetect] = useState(true);
  useInjectedCss(WEBAPP_CSS_ID, WEBAPP_GLOBAL_CSS, resetOn);
  useInjectedCss(WORKAROUND_CSS_ID, WEBAPP_WORKAROUND_CSS, workaroundOn);
  useA11yFocusedClass(resetOn);
  const { log, clear } = useTransitionDetector(detect);

  return (
    <div
      id="root"
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
          Load the webapp&apos;s global CSS (focus reset, <code>#root</code> and{' '}
          <code>.a11y--focused</code> rules) after Compass
        </label>
        <label>
          <input
            type="checkbox"
            checked={workaroundOn}
            onChange={(e) => setWorkaroundOn(e.target.checked)}
            data-testid="workaround-toggle"
          />{' '}
          Webapp IconButton <code>transition: none</code> workaround
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
        title="Webapp scenario — header + right panel, focus moves on switch"
        hint="Click Saved messages, then Recent mentions. Focus moves to the panel's first button each time, so that button loses focus on the next click. No outline-* transition should run on it."
      >
        <WebappPanelScenario />
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

/**
 * The webapp's real global CSS loaded after Compass (focus reset, `#root`
 * rules, `.a11y--focused`): reproduces the webapp conditions (#184).
 */
export const WithHostReset: Story = { args: { resetOn: true } };

/**
 * Same, plus the temporary `transition: none` workaround that is on webapp
 * master today. The bug is hidden here; the fix must hold with it on or off.
 */
export const WithHostResetAndWorkaround: Story = {
  args: { resetOn: true, workaround: true },
};

/** No reset: Compass CSS alone. Cause 1 still applies; Cause 2 does not. */
export const CompassOnly: Story = { args: { resetOn: false } };
