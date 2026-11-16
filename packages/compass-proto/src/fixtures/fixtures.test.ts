import { describe, expect, it } from 'vitest';
import {
  buildDefaultChannelsSidebarModel,
  createAvatarRegistry,
  cyberDefenseChannels,
  cyberDefenseCurrentUserId,
  cyberDefensePosts,
  cyberDefenseTeam,
  cyberDefenseThreads,
  cyberDefenseUsers,
  getCyberDefenseChannel,
  getCyberDefenseChannelPosts,
  getCyberDefenseUser,
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
      expect(teamIds.has(c.teamId)).toBe(true);
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
    for (const u of [...fixtureUsers, ...cyberDefenseUsers]) {
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
  const userIds = new Set(cyberDefenseUsers.map((u) => u.id));
  const postIds = new Set(cyberDefensePosts.map((p) => p.id));
  const channelIds = new Set(cyberDefenseChannels.map((c) => c.id));

  it('has users, channels and posts with unique ids, and no overlap with fixtureUsers', () => {
    expect(cyberDefenseUsers.length).toBeGreaterThan(0);
    expect(cyberDefenseChannels.length).toBeGreaterThan(0);
    expect(cyberDefensePosts.length).toBeGreaterThan(0);
    expect(userIds.size).toBe(cyberDefenseUsers.length);
    expect(postIds.size).toBe(cyberDefensePosts.length);
    expect(channelIds.size).toBe(cyberDefenseChannels.length);
    const base = new Set<string>(fixtureUsers.map((u) => u.id));
    expect([...userIds].filter((id) => base.has(id))).toEqual([]);
  });

  it('has a current user, and the team and channels point at each other', () => {
    expect(userIds.has(cyberDefenseCurrentUserId)).toBe(true);
    for (const c of cyberDefenseChannels) {
      expect(c.teamId).toBe(cyberDefenseTeam.id);
      c.memberIds?.forEach((id) => expect(userIds.has(id)).toBe(true));
      expect(c.bookmarks === undefined || c.bookmarks.length > 0).toBe(true);
      const ids = c.bookmarks?.map((b) => b.id) ?? [];
      expect(new Set(ids).size).toBe(ids.length);
    }
  });

  it('resolves every post reference', () => {
    for (const p of cyberDefensePosts) {
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
    for (const p of cyberDefensePosts) {
      if (p.kind === 'slack-attachment')
        expect(p.attachments?.length).toBeGreaterThan(0);
      if (p.kind === 'run-update') expect(p.runUpdate).toBeTruthy();
      if (p.kind === 'call') expect(p.call).toBeTruthy();
      if (p.kind === 'webhook') expect(p.webhook).toBeTruthy();
      if (p.requestAck || p.acknowledgements) expect(p.priority).toBeTruthy();
    }
  });

  it('derives unread state that points at real posts in the same channel', () => {
    for (const c of cyberDefenseChannels) {
      if (c.firstUnreadPostId) {
        const first = cyberDefensePosts.find(
          (p) => p.id === c.firstUnreadPostId,
        );
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
      cyberDefensePosts.some((p) =>
        /joined the channel|added to the channel/.test(p.text),
      ),
    ).toBe(false);
    for (const t of cyberDefenseThreads) {
      expect(t.replies.length).toBeGreaterThan(0);
      t.replies.forEach((r) => expect(r.rootId).toBe(t.root.id));
    }
  });

  it('keeps posts chronological within a thread (replies after their root)', () => {
    const order = new Map(cyberDefensePosts.map((p, i) => [p.id, i]));
    for (const p of cyberDefensePosts)
      if (p.rootId)
        expect(order.get(p.id)!).toBeGreaterThan(order.get(p.rootId)!);
  });

  it('looks things up by id', () => {
    const u = cyberDefenseUsers[0]!;
    expect(getCyberDefenseUser(u.id)).toBe(u);
    expect(getCyberDefenseChannel(cyberDefenseChannels[0]!.id)).toBe(
      cyberDefenseChannels[0],
    );
    expect(
      getCyberDefenseChannelPosts(cyberDefenseChannels[0]!.id).every(
        (p) => p.channelId === cyberDefenseChannels[0]!.id,
      ),
    ).toBe(true);
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
