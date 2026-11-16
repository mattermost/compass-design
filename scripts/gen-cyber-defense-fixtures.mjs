#!/usr/bin/env node
/**
 * Generates the Cyber Defense HQ fixtures (`packages/compass-proto/src/fixtures/
 * cyber-defense/generated.ts`) from a `mattermost/mattermost-preview` dataset
 * checkout, and copies the avatars the fixtures use into `src/assets/avatars/`.
 *
 *   node scripts/gen-cyber-defense-fixtures.mjs --source <path to datasets/trial-journey>
 *   npm run generate:cyber-defense-fixtures -- --source <path>
 *
 * Options:
 *   --source <dir>        Dataset folder (contains people.yaml, world.yaml, script/). Required;
 *                         `MATTERMOST_PREVIEW_DATASET` is used when the flag is omitted.
 *   --team <name>         Team whose channels become the fixtures. Default: cyber-defense-hq.
 *   --download-icons      Download missing integration icons (needs network).
 *
 * The script is strict on purpose. It fails, naming what to add, when the data
 * holds something it does not know how to map (a new post type, an unmapped
 * emoji, an unknown integration icon, a missing user), so a refresh never
 * drops content silently. See `packages/compass-proto/src/fixtures/cyber-defense/README.md`.
 */
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import YAML from 'yaml';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT_DIR = path.join(
  ROOT,
  'packages/compass-proto/src/fixtures/cyber-defense',
);
const AVATAR_DIR = path.join(ROOT, 'src/assets/avatars');
const ICON_DIR = path.join(ROOT, 'src/assets/integrations');

/**
 * "Day zero". Source times are relative (`D-12 09:30` is 12 days before day
 * zero), so this one date turns them into the fixed display strings the
 * fixtures hold. Changing it shifts every date; leave it alone on a refresh so
 * diffs only show real content changes.
 */
const ANCHOR = Date.UTC(2026, 10, 14);

/**
 * Emoji used by the data -> glyph. Fixtures hold glyphs because that is what
 * `Emoji` and `ReactionButton` render. A name missing here fails the run: add
 * it. `REPLACEMENTS` maps names with no standard emoji to the closest one.
 */
const EMOJI = {
  '+1': '👍',
  eye: '👁️',
  eyes: '👀',
  green_circle: '🟢',
  yellow_circle: '🟡',
  partying_face: '🥳',
  pray: '🙏',
  white_check_mark: '✅',
  building_construction: '🏗️',
  chart_with_upwards_trend: '📈',
  desktop_computer: '🖥️',
  keyboard: '⌨️',
  mag_right: '🔎',
  microscope: '🔬',
  palm_tree: '🌴',
  spiral_calendar_pad: '🗓️',
  toolbox: '🧰',
  clipboard: '📋',
};
const REPLACEMENTS = {
  'thank-you': 'pray',
  large_yellow_circle: 'yellow_circle',
  large_green_circle: 'green_circle',
};

/**
 * Integration icon file name in the source URL -> `FixtureIntegrationIconId`
 * (and the file name under `src/assets/integrations/`). A new icon needs an
 * entry here, the id added to `FixtureIntegrationIconId` in `types.ts`, and
 * the image mapped in `src/fixtures/integrationIcons.ts`.
 */
const INTEGRATION_ICONS = {
  'pagerduty.jpg': 'pagerduty',
  'sentinel.jpg': 'sentinel',
  'MSdefender.jpg': 'ms-defender',
  'intune.jpg': 'intune',
  'splunk.jpg': 'splunk',
};

/** Post `type`s the script maps. `system_*` posts are dropped. */
const KNOWN_TYPES = new Set([
  'custom_run_update',
  'custom_llmbot',
  'custom_calls',
  'slack_attachment',
]);

const MONTHS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];
const ROTATION = ['away', 'do-not-disturb', 'offline'];

function fail(message) {
  console.error(`\ngen-cyber-defense-fixtures: ${message}\n`);
  process.exit(1);
}

function args() {
  const out = { team: 'cyber-defense-hq', downloadIcons: false };
  const argv = process.argv.slice(2);
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--source') out.source = argv[++i];
    else if (a === '--team') out.team = argv[++i];
    else if (a === '--download-icons') out.downloadIcons = true;
    else fail(`unknown option ${a}`);
  }
  out.source ??= process.env.MATTERMOST_PREVIEW_DATASET;
  if (!out.source)
    fail(
      'pass --source <path to mattermost-preview/datasets/trial-journey> (or set MATTERMOST_PREVIEW_DATASET)',
    );
  out.source = path.resolve(out.source);
  for (const f of ['people.yaml', 'world.yaml', 'dataset.yaml', 'script'])
    if (!fs.existsSync(path.join(out.source, f)))
      fail(
        `${out.source} has no ${f}; is it a mattermost-preview dataset folder?`,
      );
  return out;
}

// ---------------------------------------------------------------- time ----

function parseOffset(s) {
  const m = /^\+(?:(\d+)d)?(?:(\d+)h)?(?:(\d+)m)?(?:(\d+)s)?$/.exec(s);
  if (!m) fail(`cannot parse duration "${s}"`);
  const [d, h, mi, se] = [1, 2, 3, 4].map((i) => Number(m[i] ?? 0));
  return ((d * 24 + h) * 60 + mi) * 60000 + se * 1000;
}

/** `D-12 09:30[:15]` -> epoch ms (UTC). */
function parseRootTime(s) {
  const m = /^D-(\d+) (\d+):(\d+)(?::(\d+))?$/.exec(s);
  if (!m) fail(`cannot parse time "${s}"`);
  const [n, h, mi, se] = [1, 2, 3, 4].map((i) => Number(m[i] ?? 0));
  return ANCHOR - n * 86400000 + ((h * 60 + mi) * 60 + se) * 1000;
}

function display(ms) {
  const d = new Date(ms);
  const days = Math.round(
    (ANCHOR - Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate())) /
      86400000,
  );
  const h = d.getUTCHours() % 12 || 12;
  const t = `${h}:${String(d.getUTCMinutes()).padStart(2, '0')} ${d.getUTCHours() < 12 ? 'AM' : 'PM'}`;
  if (days === 0) return `Today at ${t}`;
  if (days === 1) return `Yesterday at ${t}`;
  return `${MONTHS[d.getUTCMonth()]} ${d.getUTCDate()} at ${t}`;
}

function formatDuration(ms) {
  return Math.round(ms / 1000);
}

// ------------------------------------------------------------- helpers ----

function glyph(name) {
  const n = REPLACEMENTS[name] ?? name;
  const g = EMOJI[n];
  if (!g)
    fail(
      `no glyph for emoji "${name}". Add it to EMOJI (or REPLACEMENTS) in scripts/gen-cyber-defense-fixtures.mjs.`,
    );
  return g;
}

/** Resolve `${site_url}` and `{{kind:key}}` tokens to plain text. */
function tok(s) {
  if (typeof s !== 'string') return s;
  return s
    .replaceAll('${site_url}', '')
    .replace(/\{\{(\w+):([^}]*)\}\}/g, (all, kind, key) =>
      kind === 'time' ? all : key.split('/').pop(),
    );
}

const isEmpty = (v) =>
  v === '' ||
  v === null ||
  v === undefined ||
  (Array.isArray(v) && v.length === 0) ||
  (typeof v === 'object' && !Array.isArray(v) && Object.keys(v).length === 0);

function clean(v) {
  if (Array.isArray(v)) return v.map(clean);
  if (v && typeof v === 'object') {
    const out = {};
    for (const [k, x] of Object.entries(v)) {
      const c = clean(x);
      if (!isEmpty(c)) out[k] = c;
    }
    return out;
  }
  return tok(v);
}

function slug(s) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

// --------------------------------------------------------------- parse ----

const HEADER = /^(↳ )?\[([^\]]+)\] @(\S+)(?: (\{.*\}))?\s*$/;

function parseTranscript(file) {
  const raw = fs.readFileSync(file, 'utf8');
  if (!raw.startsWith('---\n')) fail(`${file} has no frontmatter`);
  const rest = raw.slice(4);
  const at = rest.indexOf('\n---\n');
  const fmText = at === -1 ? rest.replace(/\n?---\n?$/, '') : rest.slice(0, at);
  const body = at === -1 ? '' : rest.slice(at + 5);
  const fm = YAML.parse(fmText) ?? {};

  const raws = [];
  let cur = null;
  for (const line of body.split('\n')) {
    const m = HEADER.exec(line);
    if (m) {
      cur = {
        reply: Boolean(m[1]),
        time: m[2],
        user: m[3],
        attrs: m[4] ? YAML.parse(m[4]) : {},
        lines: [],
      };
      raws.push(cur);
    } else if (cur) cur.lines.push(line);
  }

  const posts = [];
  let root = null;
  let last = 0;
  for (const p of raws) {
    let text = p.lines.join('\n').replace(/^\n+|\n+$/g, '');
    let props = {};
    const pm = /^```post\n([\s\S]*?)\n```\n?([\s\S]*)$/.exec(text);
    if (pm) {
      props = YAML.parse(pm[1]) ?? {};
      text = pm[2];
    }
    const when = p.reply ? last + parseOffset(p.time) : parseRootTime(p.time);
    last = when;
    const post = {
      user: p.user,
      when,
      attrs: p.attrs,
      type: props.type,
      props: props.props ?? {},
      text: text.replace(/^\n+|\n+$/g, ''),
      reply: p.reply,
    };
    if (!p.reply) root = post;
    else {
      if (!root) fail(`${file}: reply before any root message`);
      post.root = root;
    }
    posts.push(post);
  }
  return { fm, posts };
}

// ---------------------------------------------------------------- main ----

const opts = args();
const read = (f) =>
  YAML.parse(fs.readFileSync(path.join(opts.source, f), 'utf8'));
const people = read('people.yaml');
const world = read('world.yaml');
const dataset = read('dataset.yaml');
const persona = dataset.persona?.login;
if (!persona) fail('dataset.yaml has no persona.login');

const team = world.teams.find((t) => t.name === opts.team);
if (!team) fail(`world.yaml has no team "${opts.team}"`);

// users ---------------------------------------------------------------------
const users = [];
const userIds = new Set();
for (const u of people.people) {
  const displayName =
    `${u.first_name ?? ''} ${u.last_name ?? ''}`.trim() || u.username;
  const user = {
    id: u.username,
    username: u.username,
    displayName,
    presence: 'online',
  };
  if (u.position) user.position = u.position;
  if (u.custom_status?.emoji)
    user.customStatusEmoji = glyph(u.custom_status.emoji);
  if (u.custom_status?.text) user.customStatusText = u.custom_status.text;
  users.push(user);
  userIds.add(user.id);
}
for (const b of people.bots ?? []) {
  users.push({
    id: b.username,
    username: b.username,
    displayName: b.display_name ?? b.username,
    presence: 'online',
    isBot: true,
  });
  userIds.add(b.username);
}
const userById = new Map(users.map((u) => [u.id, u]));
if (!userIds.has(persona)) fail(`persona ${persona} is not in people.yaml`);

// sources -------------------------------------------------------------------
const scriptDir = path.join(opts.source, 'script');
const mdFiles = (dir) =>
  fs.existsSync(dir)
    ? fs
        .readdirSync(dir)
        .filter((f) => f.endsWith('.md'))
        .sort()
        .map((f) => path.join(dir, f))
    : [];
const sources = [];
for (const f of mdFiles(path.join(scriptDir, opts.team)))
  sources.push({ kind: 'channel', file: f });
for (const kind of ['dm', 'gm'])
  for (const f of mdFiles(path.join(scriptDir, kind))) {
    const { fm } = parseTranscript(f);
    const members = fm[kind];
    if (!Array.isArray(members) || !members.includes(persona)) continue;
    if (Array.isArray(fm.shown_by) && !fm.shown_by.includes(persona)) continue;
    sources.push({ kind, file: f });
  }

const channels = [];
const posts = [];
const unknownTypes = new Set();
const iconUrls = new Map();

for (const [index, src] of sources.entries()) {
  const { fm, posts: parsed } = parseTranscript(src.file);
  let channel;
  if (src.kind === 'channel') {
    const id = String(fm.channel).split('/')[1];
    channel = {
      id,
      teamId: opts.team,
      type:
        { O: 'public', P: 'private' }[fm.type] ??
        fail(`${src.file}: unknown channel type ${fm.type}`),
      name: fm.display_name,
    };
    if (fm.purpose) channel.purpose = fm.purpose;
    if (fm.header) channel.header = tok(fm.header);
    if (fm.banner)
      channel.banner = {
        text: fm.banner.text,
        backgroundColor: fm.banner.background_color,
      };
    channel.memberIds = fm.members ?? [];
  } else {
    const members = fm[src.kind];
    const others = members.filter((m) => m !== persona);
    const label = (ids) =>
      ids
        .map(
          (i) =>
            userById.get(i)?.displayName ??
            fail(`${src.file}: unknown user ${i}`),
        )
        .join(', ');
    channel = {
      id: `${src.kind}-${members.join('-')}`,
      teamId: opts.team,
      type: src.kind === 'dm' ? 'direct' : 'group',
      name: label(src.kind === 'dm' ? others.slice(0, 1) : others),
      memberIds: members,
    };
  }
  if (Array.isArray(fm.favorites) && fm.favorites.includes(persona))
    channel.favorite = true;
  if (fm.bookmarks?.length)
    channel.bookmarks = fm.bookmarks.map((b) => {
      const bm = { id: slug(b.title), label: b.title, href: tok(b.url) };
      if (b.emoji) bm.emoji = glyph(b.emoji);
      return bm;
    });

  // posts ------------------------------------------------------------------
  const handles = new Map();
  let n = 0;
  const kept = [];
  for (const p of parsed) {
    if (p.type?.startsWith('system_')) continue;
    if (p.type && !KNOWN_TYPES.has(p.type))
      unknownTypes.add(`${p.type} (${path.basename(src.file)})`);
    n += 1;
    p.id = p.attrs.id ?? `${channel.id}-${n}`;
    handles.set(p, p.id);
    kept.push(p);
  }
  const byHandle = new Map(
    kept.filter((p) => p.attrs.id).map((p) => [p.attrs.id, p.id]),
  );

  const out = [];
  for (const p of kept) {
    const pp = p.props;
    const post = {
      id: p.id,
      channelId: channel.id,
      userId: p.user,
      text: tok(p.text),
      timestamp: display(p.when),
    };
    if (p.reply) post.rootId = p.root.id;
    if (p.type === 'custom_run_update') {
      post.kind = 'run-update';
      post.runUpdate = {
        runName: pp.runName,
        authorId: pp.authorUsername,
        numTasks: pp.numTasks,
        numTasksChecked: pp.numTasksChecked,
        participantIds: (pp.participantIds ?? []).map(tok),
      };
    } else if (p.type === 'custom_llmbot') {
      post.kind = 'bot-reply';
      post.requestedById = tok(pp.llm_requester_user_id);
      const resp = tok(pp.responding_to);
      post.respondingToId = byHandle.get(resp) ?? resp;
    } else if (p.type === 'custom_calls') {
      post.kind = 'call';
      const time = (s) => parseRootTime(/time:([^}]*)/.exec(s)[1]);
      const start = time(pp.start_at);
      const end = time(pp.end_at);
      post.call = {
        startedAt: display(start),
        endedAt: display(end),
        durationSeconds: formatDuration(end - start),
      };
    } else if (p.type === 'slack_attachment') {
      post.kind = 'slack-attachment';
    }
    if (pp.from_webhook) {
      post.kind ??= 'webhook';
      const file = String(pp.override_icon_url).split('/').pop();
      const iconId = INTEGRATION_ICONS[file];
      if (!iconId)
        fail(
          `unknown integration icon "${file}" (${pp.override_icon_url}). Add it to INTEGRATION_ICONS in this script, to FixtureIntegrationIconId in types.ts, and to src/fixtures/integrationIcons.ts.`,
        );
      iconUrls.set(iconId, pp.override_icon_url);
      post.webhook = { displayName: pp.override_username, iconId };
    }
    if (p.type === 'slack_attachment' && pp.attachments) {
      post.attachments = pp.attachments.map((x) =>
        clean({
          color: x.color,
          authorName: x.author_name,
          authorIcon: x.author_icon,
          authorLink: x.author_link,
          pretext: x.pretext,
          title: x.title,
          titleLink: x.title_link,
          text: x.text,
          fields: x.fields,
          actions: (x.actions ?? []).map((a) => ({
            name: a.name,
            url: a.integration?.url,
          })),
          footer: x.footer,
          footerIcon: x.footer_icon,
          imageUrl: x.image_url,
          thumbUrl: x.thumb_url,
        }),
      );
    }
    if (pp.previewed_post) {
      const k = tok(pp.previewed_post);
      post.permalinkPostId = byHandle.get(k) ?? k;
    }
    const a = p.attrs;
    if ('edited' in a) post.edited = true;
    if (a.pinned) post.pinned = true;
    if (a.priority === 'urgent' || a.priority === 'important')
      post.priority = a.priority;
    if (a.ack) post.requestAck = true;
    if (a.acks)
      post.acknowledgements = a.acks.map((x) => ({
        userId: x.split('@')[0],
        after: x.split('@')[1],
      }));
    if (a.react) {
      const groups = new Map();
      for (const r of a.react) {
        const i = r.indexOf(':');
        const g = glyph(r.slice(i + 1));
        groups.set(g, [...(groups.get(g) ?? []), r.slice(0, i)]);
      }
      post.reactions = [...groups].map(([emoji, userIds]) => ({
        emoji,
        userIds,
      }));
    }
    if (a.followers) post.followerIds = Object.keys(a.followers);
    if (a.unread_mentions?.[persona])
      post.unreadMentions = a.unread_mentions[persona];
    if (a.files)
      post.files = a.files.map((f) => {
        const abs = path.join(opts.source, 'assets/files', f);
        const file = {
          name: path.basename(f),
          extension: path.extname(f).slice(1).toLowerCase(),
        };
        if (fs.existsSync(abs)) file.sizeBytes = fs.statSync(abs).size;
        return file;
      });
    post._when = p.when;
    post._order = index;
    out.push(post);
  }

  // persona-relative state ---------------------------------------------------
  const pinned = out.filter((x) => x.pinned).length;
  if (pinned) channel.pinnedCount = pinned;
  const readAt = fm.read?.[persona];
  if (readAt) {
    const since = parseRootTime(readAt);
    const direct = channel.type === 'direct' || channel.type === 'group';
    const unread = out.filter(
      (x) => !x.rootId && x.userId !== persona && x._when > since,
    );
    if (unread.length) {
      channel.unreadCount = unread.length;
      channel.firstUnreadPostId = unread[0].id;
      const mentions = direct
        ? unread.length
        : unread.filter((x) =>
            new RegExp(`@(${persona}|channel|all|here)\\b`).test(x.text),
          ).length;
      if (mentions) channel.mentionCount = mentions;
    }
  }
  channels.push(channel);
  posts.push(...out);
}

if (unknownTypes.size)
  fail(
    `post types the script does not map:\n  ${[...unknownTypes].join('\n  ')}\nAdd handling (and a FixturePost field if needed) before refreshing.`,
  );

// chronological within each channel (stable); replies take their time from the post before them
posts.sort((a, b) => a._order - b._order || a._when - b._when);
for (const p of posts) {
  delete p._when;
  delete p._order;
}

// references must resolve ---------------------------------------------------
const postIds = new Set(posts.map((p) => p.id));
const missing = new Set();
const need = (id, where) => {
  if (!userIds.has(id)) missing.add(`${id} (${where})`);
};
for (const c of channels)
  c.memberIds?.forEach((m) => need(m, `members of ${c.id}`));
for (const p of posts) {
  need(p.userId, `author of ${p.id}`);
  p.reactions?.forEach((r) =>
    r.userIds.forEach((u) => need(u, `reaction on ${p.id}`)),
  );
  p.acknowledgements?.forEach((x) =>
    need(x.userId, `acknowledgement on ${p.id}`),
  );
  p.followerIds?.forEach((u) => need(u, `follower of ${p.id}`));
}
if (missing.size)
  fail(
    `users used in the transcripts but missing from people.yaml:\n  ${[...missing].join('\n  ')}`,
  );
for (const p of posts)
  for (const ref of [p.rootId, p.respondingToId, p.permalinkPostId])
    if (ref && !postIds.has(ref))
      console.warn(
        `warning: ${p.id} points at ${ref}, which is not in the fixtures`,
      );

// presence: people who post are online, the rest rotate -----------------------
const posters = new Set(posts.map((p) => p.userId));
let rotate = 0;
for (const u of users)
  u.presence = posters.has(u.id)
    ? 'online'
    : ROTATION[rotate++ % ROTATION.length];

// assets ---------------------------------------------------------------------
fs.mkdirSync(AVATAR_DIR, { recursive: true });
const noAvatar = [];
for (const u of people.people.concat(people.bots ?? [])) {
  const src = path.join(
    opts.source,
    'assets',
    u.avatar ?? `avatars/${u.username}.png`,
  );
  const dest = path.join(AVATAR_DIR, `${u.username}.png`);
  if (!fs.existsSync(src)) {
    noAvatar.push(u.username);
    continue;
  }
  if (
    !fs.existsSync(dest) ||
    !fs.readFileSync(src).equals(fs.readFileSync(dest))
  )
    fs.copyFileSync(src, dest);
}
fs.mkdirSync(ICON_DIR, { recursive: true });
const missingIcons = [];
for (const [id, url] of iconUrls) {
  const dest = path.join(ICON_DIR, `${id}.png`);
  if (fs.existsSync(dest)) continue;
  if (opts.downloadIcons) {
    const res = await fetch(url);
    if (!res.ok) fail(`could not download ${url} (${res.status})`);
    fs.writeFileSync(dest, Buffer.from(await res.arrayBuffer()));
  } else missingIcons.push(`${id}: ${url}`);
}

// output ---------------------------------------------------------------------
let sha = 'unknown';
try {
  sha = execFileSync('git', ['-C', opts.source, 'rev-parse', 'HEAD'], {
    encoding: 'utf8',
  }).trim();
} catch {
  /* not a git checkout */
}
const initials = team.display_name
  .split(/\s+/)
  .slice(0, 2)
  .map((w) => w[0])
  .join('')
  .toUpperCase();
const ts = (v) => JSON.stringify(v, null, 2);
const file = `// Generated by scripts/gen-cyber-defense-fixtures.mjs. Do not edit by hand.
// Source: mattermost/mattermost-preview datasets/${path.basename(opts.source)} @ ${sha}
// Refresh: see README.md in this folder.
import type {
  FixtureChannel,
  FixturePost,
  FixtureTeam,
  FixtureUser,
} from '../types';

export const cyberDefenseTeam: FixtureTeam = ${ts({ id: team.name, name: team.display_name, initials })};

/** The signed-in user in the sample workspace (the dataset's login persona). */
export const cyberDefenseCurrentUserId = ${JSON.stringify(persona)};

/**
 * People and bots in the sample workspace. Ids are Mattermost usernames.
 * Sample data only: names, titles and custom statuses are fictional. The source
 * has no presence: people who post are \`online\`, everyone else rotates through
 * away, do-not-disturb and offline.
 */
export const cyberDefenseUsers: readonly FixtureUser[] = ${ts(users)};

/**
 * The team's channels plus the direct and group messages the persona has open,
 * with the persona's favorites and unread state.
 */
export const cyberDefenseChannels: readonly FixtureChannel[] = ${ts(channels)};

/**
 * Posts in channel order, chronological within each channel. Join, leave and
 * add system posts are left out. Timestamps are fixed display strings (UTC) so
 * stories stay deterministic.
 */
export const cyberDefensePosts: readonly FixturePost[] = ${ts(posts)};
`;
fs.mkdirSync(OUT_DIR, { recursive: true });
const target = path.join(OUT_DIR, 'generated.ts');
fs.writeFileSync(target, file);
execFileSync('npx', ['prettier', '--write', target], {
  cwd: ROOT,
  stdio: 'ignore',
});

console.log(
  `Wrote ${path.relative(ROOT, target)}: ${users.length} users, ${channels.length} channels, ${posts.length} posts (source @ ${sha.slice(0, 9)}).`,
);
if (noAvatar.length)
  console.log(
    `No avatar in the source for: ${noAvatar.join(', ')} (they use the default avatar).`,
  );
if (missingIcons.length)
  console.log(
    `Missing integration icons (rerun with --download-icons):\n  ${missingIcons.join('\n  ')}`,
  );
