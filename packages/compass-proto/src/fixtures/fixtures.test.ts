import { describe, expect, it } from 'vitest';
import {
  buildChannelsSidebarModelFromFixtures,
  splitLeadingEmoji,
  buildDefaultChannelsSidebarModel,
  createAvatarRegistry,
  workspaceChannels,
  workspaceCurrentUserId,
  workspacePosts,
  workspaceTeam,
  workspaceTeams,
  workspaceThreads,
  workspaceUsers,
  getWorkspaceChannel,
  getWorkspaceChannelPosts,
  getWorkspaceUser,
  fixtureChannels,
  fixturePosts,
  fixturePresence,
  fixtureTeams,
  fixtureThreads,
  fixtureUsers,
} from './index';

describe('fixtures', () => {
  it('has unique ids and consistent references', () => {
    const userIds = new Set<string>(fixtureUsers.map((u) => u.id));
    expect(userIds.size).toBe(fixtureUsers.length);
    const teamIds = new Set<string>(fixtureTeams.map((t) => t.id));
    const channelIds = new Set(fixtureChannels.map((c) => c.id));
    expect(channelIds.size).toBe(fixtureChannels.length);
    for (const c of fixtureChannels) {
      expect(teamIds.has(c.teamId ?? '')).toBe(true);
      c.memberIds?.forEach((id) => expect(userIds.has(id)).toBe(true));
    }
    for (const p of fixturePosts) {
      expect(userIds.has(p.userId)).toBe(true);
      expect(channelIds.has(p.channelId)).toBe(true);
    }
    for (const t of fixtureThreads) {
      t.replies.forEach((r) => expect(r.rootId).toBe(t.root.id));
    }
  });

  it('derives presence from users', () => {
    expect(fixturePresence['aiko-tan']).toBe('online');
    expect(fixturePresence['david-liang']).toBe('offline');
  });
});

describe('createAvatarRegistry', () => {
  it('matches files by base name regardless of directory and ignores unknown files', () => {
    const reg = createAvatarRegistry({
      '/src/assets/avatars/Aiko Tan.png': 'a.png',
      'Leonard Riley.PNG': 'l.png',
      '/x/Nobody.png': 'n.png',
    });
    expect(reg).toEqual({ 'aiko-tan': 'a.png', 'leonard-riley': 'l.png' });
  });
});

describe('createAvatarRegistry ids and usernames', () => {
  it('also matches a file named after a user id or username', () => {
    const reg = createAvatarRegistry({ '/a/areid.png': 'r.png' });
    expect(reg).toEqual({ areid: 'r.png' });
  });

  it('gives every fixture user that shares a display name the image', () => {
    const shared = new Map<string, string[]>();
    for (const u of [...fixtureUsers, ...workspaceUsers]) {
      const k = u.displayName.toLowerCase();
      shared.set(k, [...(shared.get(k) ?? []), u.id]);
    }
    const [name, ids] = [...shared].find(([, v]) => v.length > 1)!;
    const reg = createAvatarRegistry({ [`/a/${name}.png`]: 'x.png' });
    for (const id of ids) expect(reg[id]).toBe('x.png');
  });
});

describe('cyber defense fixtures', () => {
  // These check structure and references, not counts or particular posts, so
  // they keep passing when the data is refreshed from mattermost-preview.
  const userIds = new Set(workspaceUsers.map((u) => u.id));
  const postIds = new Set(workspacePosts.map((p) => p.id));
  const channelIds = new Set(workspaceChannels.map((c) => c.id));

  it('has users, channels and posts with unique ids, and no overlap with fixtureUsers', () => {
    expect(workspaceUsers.length).toBeGreaterThan(0);
    expect(workspaceChannels.length).toBeGreaterThan(0);
    expect(workspacePosts.length).toBeGreaterThan(0);
    expect(userIds.size).toBe(workspaceUsers.length);
    expect(postIds.size).toBe(workspacePosts.length);
    expect(channelIds.size).toBe(workspaceChannels.length);
    const base = new Set<string>(fixtureUsers.map((u) => u.id));
    expect([...userIds].filter((id) => base.has(id))).toEqual([]);
  });

  it('flags system and calls accounts as bots', () => {
    for (const id of ['callsbot', 'systembot', 'calls', 'system-bot']) {
      expect(workspaceUsers.find((u) => u.id === id)?.isBot).toBe(true);
    }
  });

  it('has a current user, and the channels point at real teams', () => {
    expect(userIds.has(workspaceCurrentUserId)).toBe(true);
    const teamIds = new Set(workspaceTeams.map((t) => t.id));
    for (const c of workspaceChannels) {
      // Team channels name a team; direct and group messages belong to none.
      if (c.type === 'direct' || c.type === 'group') {
        expect(c.teamId).toBeUndefined();
      } else {
        expect(teamIds.has(c.teamId ?? '')).toBe(true);
      }
      c.memberIds?.forEach((id) => expect(userIds.has(id)).toBe(true));
      expect(c.bookmarks === undefined || c.bookmarks.length > 0).toBe(true);
      const ids = c.bookmarks?.map((b) => b.id) ?? [];
      expect(new Set(ids).size).toBe(ids.length);
    }
  });

  it('has teams with unique ids, each with channels, and the first is the default', () => {
    expect(workspaceTeams.length).toBeGreaterThan(0);
    const ids = workspaceTeams.map((t) => t.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(workspaceTeam).toBe(workspaceTeams[0]);
    for (const t of workspaceTeams) {
      expect(t.initials.length).toBeGreaterThan(0);
      expect(workspaceChannels.some((c) => c.teamId === t.id)).toBe(true);
    }
  });

  it('keeps channel ids unique across teams', () => {
    // Every team has its own town-square, so ids carry the team.
    for (const c of workspaceChannels)
      if (c.teamId) expect(c.id.startsWith(`${c.teamId}/`)).toBe(true);
  });

  it('derives each team badge from its channels and threads', () => {
    for (const t of workspaceTeams) {
      const own = workspaceChannels.filter((c) => c.teamId === t.id);
      const ids = new Set(own.map((c) => c.id));
      const mentions =
        own.reduce((n, c) => n + (c.mentionCount ?? 0), 0) +
        workspacePosts
          .filter((p) => ids.has(p.channelId))
          .reduce((n, p) => n + (p.unreadMentions ?? 0), 0);
      expect(t.mentions ?? 0).toBe(mentions);
      expect(Boolean(t.unread)).toBe(own.some((c) => c.unreadCount));
    }
  });

  it('resolves every post reference', () => {
    for (const p of workspacePosts) {
      expect(channelIds.has(p.channelId)).toBe(true);
      expect(userIds.has(p.userId)).toBe(true);
      if (p.rootId) expect(postIds.has(p.rootId)).toBe(true);
      p.reactions?.forEach((r) =>
        r.userIds.forEach((id) => expect(userIds.has(id)).toBe(true)),
      );
      p.acknowledgements?.forEach((a) =>
        expect(userIds.has(a.userId)).toBe(true),
      );
      p.followerIds?.forEach((id) => expect(userIds.has(id)).toBe(true));
      if (p.respondingToId) expect(postIds.has(p.respondingToId)).toBe(true);
      if (p.requestedById) expect(userIds.has(p.requestedById)).toBe(true);
    }
  });

  it('gives each post kind the data a host renders it from', () => {
    for (const p of workspacePosts) {
      if (p.kind === 'slack-attachment')
        expect(p.attachments?.length).toBeGreaterThan(0);
      if (p.kind === 'run-update') expect(p.runUpdate).toBeTruthy();
      if (p.kind === 'call') expect(p.call).toBeTruthy();
      if (p.kind === 'webhook') expect(p.webhook).toBeTruthy();
      // Acknowledgements answer a request. (A request can have no priority label:
      // "standard" priority is not shown.)
      if (p.acknowledgements) expect(p.requestAck).toBe(true);
    }
  });

  it('derives unread state that points at real posts in the same channel', () => {
    for (const c of workspaceChannels) {
      if (c.firstUnreadPostId) {
        const first = workspacePosts.find((p) => p.id === c.firstUnreadPostId);
        expect(first?.channelId).toBe(c.id);
        expect(first?.rootId).toBeUndefined();
        expect(c.unreadCount).toBeGreaterThan(0);
      }
      if (c.mentionCount)
        expect(c.mentionCount).toBeLessThanOrEqual(c.unreadCount ?? 0);
    }
  });

  it('leaves out system posts and groups replies into threads', () => {
    expect(
      workspacePosts.some((p) =>
        /joined the channel|added to the channel/.test(p.text),
      ),
    ).toBe(false);
    for (const t of workspaceThreads) {
      expect(t.replies.length).toBeGreaterThan(0);
      t.replies.forEach((r) => expect(r.rootId).toBe(t.root.id));
    }
  });

  it('gives every post a createdAt that agrees with the order within a channel', () => {
    const lastByChannel = new Map<string, number>();
    for (const p of workspacePosts) {
      expect(p.createdAt).toBeTruthy();
      const at = Date.parse(p.createdAt!);
      expect(Number.isNaN(at)).toBe(false);
      expect(at).toBeGreaterThanOrEqual(
        lastByChannel.get(p.channelId) ?? -Infinity,
      );
      lastByChannel.set(p.channelId, at);
    }
  });

  it('keeps posts chronological within a thread (replies after their root)', () => {
    const order = new Map(workspacePosts.map((p, i) => [p.id, i]));
    for (const p of workspacePosts)
      if (p.rootId)
        expect(order.get(p.id)!).toBeGreaterThan(order.get(p.rootId)!);
  });

  it('looks things up by id', () => {
    const u = workspaceUsers[0]!;
    expect(getWorkspaceUser(u.id)).toBe(u);
    expect(getWorkspaceChannel(workspaceChannels[0]!.id)).toBe(
      workspaceChannels[0],
    );
    // A channel that has posts, so the check can't pass on an empty list.
    const channelId = workspacePosts[0]!.channelId;
    const posts = getWorkspaceChannelPosts(channelId);
    expect(posts.length).toBeGreaterThan(0);
    expect(posts.every((p) => p.channelId === channelId)).toBe(true);
    expect(posts).toEqual(
      workspacePosts.filter((p) => p.channelId === channelId),
    );
  });
});

describe('buildDefaultChannelsSidebarModel', () => {
  const rows = (m: ReturnType<typeof buildDefaultChannelsSidebarModel>) =>
    m.groups.flatMap((g) => g.items);

  it('applies channelNames to name and avatarAlt', () => {
    const m = buildDefaultChannelsSidebarModel({
      showUnreadsCategory: false,
      channelNames: { 'UX Design': 'Brand Design', 'Aiko Tan': 'Aiko T.' },
    });
    const names = rows(m).map((i) => i.name);
    expect(names).toContain('Brand Design');
    expect(names).not.toContain('UX Design');
    expect(rows(m).find((i) => i.name === 'Aiko T.')?.avatarAlt).toBe(
      'Aiko T.',
    );
  });

  it('is unchanged without channelNames', () => {
    const m = buildDefaultChannelsSidebarModel({ showUnreadsCategory: false });
    expect(rows(m).map((i) => i.name)).toContain('UX Design');
  });

  it('fills avatars from a registry; explicit props win', () => {
    const m = buildDefaultChannelsSidebarModel({
      showUnreadsCategory: false,
      avatars: { 'aiko-tan': 'reg.png', 'arjun-patel': 'reg2.png' },
      avatarAikoTan: 'explicit.png',
    });
    expect(rows(m).find((i) => i.name === 'Aiko Tan')?.avatarSrc).toBe(
      'explicit.png',
    );
    expect(rows(m).find((i) => i.name === 'Arjun Patel')?.avatarSrc).toBe(
      'reg2.png',
    );
  });
});

describe('fixture element types', () => {
  it('exposes optional fields on every user and team element', () => {
    const statuses: (string | undefined)[] = fixtureUsers.map(
      (u) => u.customStatusText,
    );
    const mentions: (number | undefined)[] = fixtureTeams.map(
      (t) => t.mentions,
    );
    expect(statuses).toHaveLength(fixtureUsers.length);
    expect(mentions).toHaveLength(fixtureTeams.length);
  });
});

/** The name a channel has in the sidebar: a public or private channel's leading emoji moves to the row's leading visual. */
const sidebarName = (c: (typeof workspaceChannels)[number]) =>
  c.type === 'public' || c.type === 'private'
    ? splitLeadingEmoji(c.name).name
    : c.name;

describe('splitLeadingEmoji', () => {
  it('splits an emoji and the space after it off the start of a name', () => {
    expect(splitLeadingEmoji('🚨 Incident Status')).toEqual({
      emoji: '🚨',
      name: 'Incident Status',
    });
    expect(splitLeadingEmoji('👩🏽‍💻 Dev Team')).toEqual({
      emoji: '👩🏽‍💻',
      name: 'Dev Team',
    });
  });

  it('leaves names without a leading emoji alone', () => {
    for (const plain of ['Town Square', 'Q3 plan 🚀', '', '3546B Coordination'])
      expect(splitLeadingEmoji(plain)).toEqual({ name: plain });
  });

  it('keeps a name that is only an emoji', () => {
    expect(splitLeadingEmoji('🚨')).toEqual({ name: '🚨' });
  });
});

describe('buildChannelsSidebarModelFromFixtures', () => {
  const build = (
    extra: Partial<
      Parameters<typeof buildChannelsSidebarModelFromFixtures>[0]
    > = {},
  ) =>
    buildChannelsSidebarModelFromFixtures({
      channels: workspaceChannels,
      users: workspaceUsers,
      currentUserId: workspaceCurrentUserId,
      ...extra,
    });
  const rows = (m: ReturnType<typeof build>) =>
    m.groups.flatMap((g) => g.items);

  it('lists only channels the current user belongs to, each once', () => {
    const visible = workspaceChannels.filter((c) =>
      c.memberIds?.includes(workspaceCurrentUserId),
    );
    const names = rows(build()).map((r) => r.name);
    expect(names).toHaveLength(visible.length);
    expect(new Set(names)).toEqual(new Set(visible.map(sidebarName)));
  });

  it("moves a channel name's leading emoji to the row's leading visual", () => {
    const withEmoji = workspaceChannels.filter(
      (c) =>
        (c.type === 'public' || c.type === 'private') &&
        c.memberIds?.includes(workspaceCurrentUserId) &&
        splitLeadingEmoji(c.name).emoji,
    );
    expect(withEmoji.length).toBeGreaterThan(0);
    const all = rows(build());
    for (const c of withEmoji) {
      const { emoji, name } = splitLeadingEmoji(c.name);
      const row = all.find((r) => r.name === name && r.leadingEmoji === emoji);
      expect(row).toBeDefined();
    }
    // Other rows (direct messages included) have no leading emoji.
    const emojiRows = all.filter((r) => r.leadingEmoji);
    expect(emojiRows).toHaveLength(withEmoji.length);
  });

  it('hides the presence badge on direct messages with a bot', () => {
    const botIds = new Set(
      workspaceUsers.filter((u) => u.isBot).map((u) => u.id),
    );
    const isBotDm = (c: (typeof workspaceChannels)[number]) =>
      c.type === 'direct' &&
      c.memberIds?.includes(workspaceCurrentUserId) &&
      c.memberIds.some((id) => botIds.has(id) && id !== workspaceCurrentUserId);
    const botDms = workspaceChannels.filter(isBotDm);
    expect(botDms.length).toBeGreaterThan(0);
    const model = rows(build());
    for (const c of botDms) {
      expect(model.find((r) => r.name === c.name)?.showAvatarStatus).toBe(
        false,
      );
    }
  });

  it('groups favorites first, then channels, then direct messages, and omits empty groups', () => {
    const m = build();
    const order = ['favorites', 'channels', 'direct-messages'];
    const keys = m.groups.map((g) => g.key);
    expect(keys).toEqual(order.filter((k) => keys.includes(k)));
    m.groups.forEach((g) => expect(g.items.length).toBeGreaterThan(0));
    const fav = new Set(
      workspaceChannels.filter((c) => c.favorite).map(sidebarName),
    );
    m.groups
      .find((g) => g.key === 'favorites')
      ?.items.forEach((i) => expect(fav.has(i.name)).toBe(true));
  });

  it('marks the active channel and calls back with the channel id', () => {
    const target = workspaceChannels.find((c) =>
      c.memberIds?.includes(workspaceCurrentUserId),
    )!;
    const picked: string[] = [];
    const m = build({
      activeChannelId: target.id,
      onSelectChannel: (id) => picked.push(id),
    });
    const r = rows(m);
    expect(r.filter((i) => i.active).map((i) => i.name)).toEqual([
      sidebarName(target),
    ]);
    r.find((i) => i.name === sidebarName(target))?.onClick?.();
    expect(picked).toEqual([target.id]);
  });

  it('turns unread and mention counts into row status, and thread mentions into the Threads row', () => {
    const channels = [
      {
        id: 'a',
        teamId: 't',
        type: 'public' as const,
        name: 'A',
        unreadCount: 3,
      },
      {
        id: 'b',
        teamId: 't',
        type: 'public' as const,
        name: 'B',
        unreadCount: 2,
        mentionCount: 1,
      },
    ];
    const m = buildChannelsSidebarModelFromFixtures({
      channels,
      users: [],
      currentUserId: 'me',
      threadsMentionCount: 2,
    });
    const byName = Object.fromEntries(rows(m).map((i) => [i.name, i]));
    expect(byName['A']).toMatchObject({ status: 'unread' });
    expect(byName['B']).toMatchObject({ status: 'mention', mentionCount: 1 });
    expect(m.topGroupItems[0]).toMatchObject({
      name: 'Threads',
      status: 'mention',
      mentionCount: 2,
    });
    expect(build().topGroupItems[0]!.status).toBeUndefined();
  });

  it('puts unread channels in an Unreads group when asked, and nowhere else', () => {
    const channels = [
      { id: 'a', type: 'public' as const, name: 'A', unreadCount: 2 },
      { id: 'b', type: 'public' as const, name: 'B', favorite: true },
      {
        id: 'c',
        type: 'public' as const,
        name: 'C',
        mentionCount: 1,
        unreadCount: 1,
        favorite: true,
      },
    ];
    const build2 = (showUnreadsCategory: boolean) =>
      buildChannelsSidebarModelFromFixtures({
        channels,
        users: [],
        currentUserId: 'me',
        showUnreadsCategory,
      });
    expect(build2(false).groups.map((g) => g.key)).toEqual([
      'favorites',
      'channels',
    ]);
    const on = build2(true);
    expect(on.groups.map((g) => g.key)).toEqual(['unreads', 'favorites']);
    expect(on.groups[0]!.items.map((i) => i.name).sort()).toEqual(['A', 'C']);
    expect(on.groups[0]!.category).toMatchObject({
      label: 'Unreads',
      showChevron: false,
    });
    // each channel appears once
    const names = on.groups.flatMap((g) => g.items.map((i) => i.name));
    expect(names.sort()).toEqual(['A', 'B', 'C']);
  });

  it('lists only the chosen team channels, plus direct and group messages', () => {
    const team = workspaceTeams[workspaceTeams.length - 1]!;
    const names = rows(build({ teamId: team.id })).map((r) => r.name);
    const mine = workspaceChannels.filter(
      (c) =>
        c.memberIds?.includes(workspaceCurrentUserId) &&
        (!c.teamId || c.teamId === team.id),
    );
    expect(new Set(names)).toEqual(new Set(mine.map(sidebarName)));
    const other = workspaceChannels.find(
      (c) => c.teamId && c.teamId !== team.id && !mine.includes(c),
    );
    if (other) expect(names).not.toContain(other.name);
    // Direct and group messages show in every team.
    for (const t of workspaceTeams) {
      const direct = workspaceChannels.filter(
        (c) => !c.teamId && c.memberIds?.includes(workspaceCurrentUserId),
      );
      const shown = new Set(rows(build({ teamId: t.id })).map((r) => r.name));
      direct.forEach((c) => expect(shown.has(sidebarName(c))).toBe(true));
    }
  });

  it('gives direct messages the other person and group messages a member count', () => {
    const dm = workspaceChannels.find(
      (c) =>
        c.type === 'direct' && c.memberIds?.includes(workspaceCurrentUserId),
    );
    const gm = workspaceChannels.find(
      (c) =>
        c.type === 'group' && c.memberIds?.includes(workspaceCurrentUserId),
    );
    const r = rows(
      build({
        avatars: {
          [dm?.memberIds?.find((i) => i !== workspaceCurrentUserId) ?? '']:
            'x.png',
        },
      }),
    );
    if (dm)
      expect(r.find((i) => i.name === dm.name)).toMatchObject({
        leadingVisual: 'direct-message',
        avatarSrc: 'x.png',
      });
    if (gm)
      expect(r.find((i) => i.name === gm.name)).toMatchObject({
        leadingVisual: 'group-message',
        memberCount: gm.memberIds!.length - 1,
      });
  });
});
