import { describe, expect, it } from 'vitest';
import {
  buildDefaultChannelsSidebarModel,
  createAvatarRegistry,
  cyberDefenseChannels,
  cyberDefensePosts,
  cyberDefenseThreads,
  cyberDefenseUsers,
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
});

describe('cyber defense fixtures', () => {
  const userIds = new Set(cyberDefenseUsers.map((u) => u.id));
  const postIds = new Set(cyberDefensePosts.map((p) => p.id));

  it('has 48 users with unique ids, and no overlap with fixtureUsers', () => {
    expect(cyberDefenseUsers).toHaveLength(48);
    expect(userIds.size).toBe(48);
    const base = new Set<string>(fixtureUsers.map((u) => u.id));
    expect([...userIds].filter((id) => base.has(id))).toEqual([]);
  });

  it('has unique post ids and every reference resolves', () => {
    expect(postIds.size).toBe(cyberDefensePosts.length);
    const channelIds = new Set(cyberDefenseChannels.map((c) => c.id));
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
    }
    for (const c of cyberDefenseChannels) {
      c.memberIds?.forEach((id) => expect(userIds.has(id)).toBe(true));
    }
  });

  it('carries the post features hosts need to render', () => {
    const has = (f: (p: (typeof cyberDefensePosts)[number]) => unknown) =>
      cyberDefensePosts.some((p) => Boolean(f(p)));
    expect(has((p) => p.attachments?.length)).toBe(true);
    expect(has((p) => p.reactions?.length)).toBe(true);
    expect(has((p) => p.priority)).toBe(true);
    expect(has((p) => p.acknowledgements?.length)).toBe(true);
    expect(has((p) => p.edited)).toBe(true);
    expect(has((p) => p.followerIds?.length)).toBe(true);
    expect(has((p) => p.files?.length)).toBe(true);
    expect(has((p) => p.webhook)).toBe(true);
    expect(has((p) => p.permalinkPostId)).toBe(true);
    expect(has((p) => p.runUpdate)).toBe(true);
    expect(has((p) => p.call)).toBe(true);
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
