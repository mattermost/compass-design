import { useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  ChannelHeader,
  ChannelsSidebar,
  Message,
  MessageInput,
  ProductRail,
  ProductRailTeamButton,
  ProductRailTeamMenu,
  type ProductRailTeam,
  ProductShell,
  shellStyles,
} from '@mattermost/compass-proto';
import { EmptyState } from '@mattermost/compass-ui/components/empty-state';
import { MessageSeparator } from '@mattermost/compass-ui/components/message-separator';
import { useOutsideClose } from '@mattermost/compass-ui/hooks/use-outside-close';
import { Scrollbar } from '@mattermost/compass-ui/components/scrollbar';
import {
  productRailDemoItems,
  type ProductRailDemoId,
} from '@/fixtures/productRailDemo';
import avatarSofia from '@/assets/avatars/Sofia Bauer.png';
import { defaultChannelsSidebarDemoModel } from '@/fixtures/channelsSidebarDemo';

const TEAMS: ProductRailTeam[] = [
  { id: 'contributors', name: 'Contributors', initials: 'Co' },
  { id: 'design', name: 'Design', initials: 'De', unread: true },
  { id: 'acme', name: 'Acme', initials: 'Ac', mentions: 3 },
];

/** Host-owned wiring: the button opens the team menu beside it. */
function TeamSwitcher() {
  const [activeTeamId, setActiveTeamId] = useState('contributors');
  const [anchor, setAnchor] = useState<DOMRect | null>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  useOutsideClose(wrapRef, anchor != null, () => setAnchor(null), menuRef);

  return (
    <div ref={wrapRef}>
      <ProductRailTeamButton
        teams={TEAMS}
        activeTeamId={activeTeamId}
        open={anchor != null}
        onClick={(e) =>
          setAnchor(anchor ? null : e.currentTarget.getBoundingClientRect())
        }
      />
      {anchor &&
        createPortal(
          <div
            ref={menuRef}
            style={{
              position: 'fixed',
              top: anchor.top,
              left: anchor.right + 4,
              zIndex: 'var(--z-popover, 1000)' as unknown as number,
            }}
          >
            <ProductRailTeamMenu
              teams={TEAMS}
              activeTeamId={activeTeamId}
              onSelectTeam={(id) => {
                setActiveTeamId(id);
                setAnchor(null);
              }}
            />
          </div>,
          document.body,
        )}
    </div>
  );
}

export default function ProductLayout() {
  const [product, setProduct] = useState<ProductRailDemoId>('channels');

  return (
    <ProductShell
      product={product}
      productRail={
        <ProductRail
          header={<TeamSwitcher />}
          activeId={product}
          onSelect={(id) => setProduct(id as ProductRailDemoId)}
          items={productRailDemoItems}
        />
      }
      sidebar={
        product === 'channels' ? (
          <ChannelsSidebar
            teamName="Contributors"
            model={defaultChannelsSidebarDemoModel}
          />
        ) : undefined
      }
    >
      {product === 'channels' ? (
        <>
          <ChannelHeader
            type="channel"
            name="Town Square"
            description="Company-wide announcements and general discussion."
            memberCount={124}
          />
          <div className={shellStyles['channel-shell__messages']}>
            <Scrollbar>
              <div className={shellStyles['channel-shell__messages-list']}>
                <MessageSeparator type="date" label="Today" />
                <Message
                  avatarSrc={avatarSofia}
                  avatarAlt="Sofia Bauer"
                  username="Sofia Bauer"
                  timestamp="9:02 AM"
                >
                  <p className={shellStyles['channel-shell__post-text']}>
                    Morning everyone! Roadmap review is at 10:30 today.
                  </p>
                </Message>
              </div>
            </Scrollbar>
          </div>
          <div className={shellStyles['channel-shell__message-input']}>
            <MessageInput placeholder="Write to Town Square" />
          </div>
        </>
      ) : (
        <EmptyState
          title={productRailDemoItems.find((i) => i.id === product)?.label}
          description="This product has no prototype yet. Its content fills the main area."
        />
      )}
    </ProductShell>
  );
}
