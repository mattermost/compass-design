import { describe, expect, it } from 'vitest';
import {
  buildDefaultChannelsSidebarModel,
  createAvatarRegistry,
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
