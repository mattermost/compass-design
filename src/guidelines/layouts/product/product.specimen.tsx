import { useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  ChannelsSidebar,
  MessageInput,
  ProductRail,
  ProductRailTeamButton,
  ProductRailTeamMenu,
  ProductShell,
  shellStyles,
  type ProductRailTeam,
} from '@mattermost/compass-proto';
import { EmptyState } from '@mattermost/compass-ui/components/empty-state';
import { useOutsideClose } from '@mattermost/compass-ui/hooks/use-outside-close';
import { Scrollbar } from '@mattermost/compass-ui/components/scrollbar';
import {
  productRailDemoItems,
  type ProductRailDemoId,
} from '@/fixtures/productRailDemo';
import {
  FixtureChannelBanner,
  FixtureChannelHeader,
  FixtureMessageList,
} from '@/guidelines/_components/FixtureChannel';
import { useFixtureWorkspace } from '@/guidelines/_components/useFixtureWorkspace';

interface TeamSwitcherProps {
  teams: ProductRailTeam[];
  activeTeamId?: string;
  onSelectTeam: (id: string) => void;
}

/** Host-owned wiring: the button opens the team menu beside it. */
function TeamSwitcher({
  teams,
  activeTeamId,
  onSelectTeam,
}: TeamSwitcherProps) {
  // `anchor` keeps the menu mounted until its exit animation ends; `open` drives it.
  const [anchor, setAnchor] = useState<DOMRect | null>(null);
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  useOutsideClose(wrapRef, open, () => setOpen(false), menuRef);

  return (
    <div ref={wrapRef}>
      <ProductRailTeamButton
        teams={teams}
        activeTeamId={activeTeamId}
        open={open}
        onClick={(e) => {
          if (open) {
            setOpen(false);
          } else {
            setAnchor(e.currentTarget.getBoundingClientRect());
            setOpen(true);
          }
        }}
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
              teams={teams}
              activeTeamId={activeTeamId}
              open={open}
              onExited={() => setAnchor(null)}
              onClose={() => {
                setOpen(false);
                wrapRef.current?.querySelector('button')?.focus();
              }}
              onSelectTeam={(id) => {
                onSelectTeam(id);
                setOpen(false);
                wrapRef.current?.querySelector('button')?.focus();
              }}
            />
          </div>,
          document.body,
        )}
    </div>
  );
}

/**
 * The product-agnostic shell: a Product Rail with the team switcher, then the
 * Channels product shown from the sample workspace (the rail's team button
 * switches teams, as the Team Sidebar does in the Channel layout).
 */
export default function ProductLayout() {
  const { team, channel, channels, messagesRef, shellProps, selectTeam } =
    useFixtureWorkspace();
  const [product, setProduct] = useState<ProductRailDemoId>('channels');

  return (
    <ProductShell
      product={product}
      productRail={
        <ProductRail
          header={
            <TeamSwitcher
              teams={shellProps.teams}
              activeTeamId={team?.id}
              onSelectTeam={selectTeam}
            />
          }
          activeId={product}
          onSelect={(id) => setProduct(id as ProductRailDemoId)}
          items={productRailDemoItems}
        />
      }
      sidebar={
        product === 'channels' ? (
          <ChannelsSidebar
            teamName={team?.name}
            model={shellProps.channelsSidebarModel}
          />
        ) : undefined
      }
    >
      {product === 'channels' && channel ? (
        <>
          <FixtureChannelHeader channel={channel} />
          <FixtureChannelBanner channel={channel} />
          <div className={shellStyles['channel-shell__messages']}>
            <Scrollbar key={channel.id} ref={messagesRef}>
              <div className={shellStyles['channel-shell__messages-list']}>
                <FixtureMessageList channel={channel} channels={channels} />
              </div>
            </Scrollbar>
          </div>
          <div className={shellStyles['channel-shell__message-input']}>
            <MessageInput placeholder={`Write to ${channel.name}`} />
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
