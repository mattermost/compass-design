import { describe, expect, it } from 'vitest';
import { render } from '@/test-utils/render';
import RightSidebarChannelInfo from './RightSidebarChannelInfo';

describe('RightSidebarChannelInfo', () => {
  it('renders the demo content when given no props', () => {
    const { container } = render(<RightSidebarChannelInfo />);
    expect(container.textContent).toContain('UX Design');
    expect(container.textContent).toContain('Channel Purpose');
    expect(container.textContent).toContain('Channel Header');
    expect(container.textContent).toContain('ID: ggq4jzr8o386bpqytigtswjfr');
    expect(container.textContent).toContain('Add people');
  });

  it('shows the given channel and counts', () => {
    const { container } = render(
      <RightSidebarChannelInfo
        name="Security Alerts"
        purpose="Real-time alerts."
        header="Triage within 15 mins"
        channelId="security-alerts"
        memberCount={12}
        pinnedCount={3}
        fileCount={5}
      />,
    );
    const text = container.textContent ?? '';
    expect(text).toContain('Security Alerts');
    expect(text).toContain('Real-time alerts.');
    expect(text).toContain('Triage within 15 mins');
    expect(text).toContain('ID: security-alerts');
    expect(text).not.toContain('UX Design');
    for (const n of ['12', '3', '5']) expect(text).toContain(n);
    expect(text).not.toMatch(/Files\s*0/);
  });

  it('hides sections passed as null and the Add people tile', () => {
    const { container } = render(
      <RightSidebarChannelInfo
        name="Aiko Tan"
        purpose={null}
        header={null}
        channelId={null}
        showAddPeople={false}
      />,
    );
    const text = container.textContent ?? '';
    expect(text).not.toContain('Channel Purpose');
    expect(text).not.toContain('Channel Header');
    expect(text).not.toContain('ID:');
    expect(text).not.toContain('Add people');
  });

  it('labels the Mute tile Unmute when muted', () => {
    const { container } = render(<RightSidebarChannelInfo muted />);
    expect(container.textContent).toContain('Unmute');
  });

  it('shows a zero count once, on the row, and no count when unknown', () => {
    const { container } = render(<RightSidebarChannelInfo pinnedCount={0} />);
    const rows = Array.from(container.querySelectorAll('[class*="count"]'));
    expect(rows.map((r) => r.textContent)).toEqual(['0']);
  });
});
