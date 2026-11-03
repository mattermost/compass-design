import ProductsIcon from '@mattermost/compass-icons/components/products';
import ProductChannelsIcon from '@mattermost/compass-icons/components/product-channels';
import ProductPlaybooksIcon from '@mattermost/compass-icons/components/product-playbooks';
import ProductBoardsIcon from '@mattermost/compass-icons/components/product-boards';
import ArrowLeftIcon from '@mattermost/compass-icons/components/arrow-left';
import ArrowRightIcon from '@mattermost/compass-icons/components/arrow-right';
import MagnifyIcon from '@mattermost/compass-icons/components/magnify';
import HelpCircleOutlineIcon from '@mattermost/compass-icons/components/help-circle-outline';
import CogOutlineIcon from '@mattermost/compass-icons/components/cog-outline';
import AtIcon from '@mattermost/compass-icons/components/at';
import BookmarkOutlineIcon from '@mattermost/compass-icons/components/bookmark-outline';
import CheckboxMultipleMarkedOutlineIcon from '@mattermost/compass-icons/components/checkbox-multiple-marked-outline';
import { Button } from '@mattermost/compass-ui/components/button';
import { Icon } from '@mattermost/compass-ui/components/icon';
import { IconButton } from '@mattermost/compass-ui/components/icon-button';
import { UserAvatar } from '@mattermost/compass-ui/components/user-avatar';
import type { ComponentType, MouseEvent } from 'react';
import WithTooltip from '../WithTooltip/WithTooltip';
import styles from './GlobalHeader.module.scss';

export type GlobalHeaderProduct = 'channels' | 'playbooks' | 'boards';

/**
 * Click handler for Global Header controls. Receives the click event so hosts can
 * use `event.currentTarget` as the anchor for a menu or popover they own.
 * Handlers that take no arguments remain valid.
 */
export type GlobalHeaderClickHandler = (event: MouseEvent<HTMLElement>) => void;

export interface GlobalHeaderProps {
  /** Optional CSS class name. */
  className?: string;
  /** Product context. Controls branding + right-side controls. Default: Channels. */
  product?: GlobalHeaderProduct;
  /** When true and product is Channels, shows the Channels product icon + label. */
  showChannelsBranding?: boolean;
  /** When true, shows the Upgrade button in the right controls. */
  showUpgradeButton?: boolean;
  /** URL for the signed-in user avatar. Omit for initials fallback. */
  userAvatarSrc?: string;
  /** Alt text for the signed-in user avatar. */
  userAvatarAlt?: string;
  /** When set, Recent mentions (@) calls this on click. Channels product only. */
  onRecentMentionsClick?: GlobalHeaderClickHandler;
  /** When true, Recent mentions shows as toggled/selected. */
  recentMentionsActive?: boolean;
  /** When set, the Product switcher button calls this on click. */
  onProductSwitcherClick?: GlobalHeaderClickHandler;
  /** When true, the Product switcher shows as toggled/selected (e.g. while its menu is open). */
  productSwitcherActive?: boolean;
  /** When set, Back calls this on click. */
  onBackClick?: GlobalHeaderClickHandler;
  /** When set, Forward calls this on click. */
  onForwardClick?: GlobalHeaderClickHandler;
  /** When set, Help calls this on click (center cluster on Channels, right cluster otherwise). */
  onHelpClick?: GlobalHeaderClickHandler;
  /** When true, Help shows as toggled/selected. */
  helpActive?: boolean;
  /** When set, the Search field calls this on click. Channels product only. */
  onSearchClick?: GlobalHeaderClickHandler;
  /** When set, Saved messages calls this on click. Channels product only. */
  onSavedMessagesClick?: GlobalHeaderClickHandler;
  /** When true, Saved messages shows as toggled/selected. */
  savedMessagesActive?: boolean;
  /** When set, Settings (cog) calls this on click. */
  onSettingsClick?: GlobalHeaderClickHandler;
  /** When true, Settings shows as toggled/selected. */
  settingsActive?: boolean;
  /** When set, the Account menu button calls this on click. */
  onAccountClick?: GlobalHeaderClickHandler;
  /** When true, the Account menu button shows as active (`aria-expanded`, selected styling). */
  accountActive?: boolean;
}

const PRODUCT_ICON: Record<
  GlobalHeaderProduct,
  ComponentType<{ size?: number }>
> = {
  channels: ProductChannelsIcon,
  playbooks: ProductPlaybooksIcon,
  boards: ProductBoardsIcon,
};

const PRODUCT_LABEL: Record<GlobalHeaderProduct, string> = {
  channels: 'Channels',
  playbooks: 'Playbooks',
  boards: 'Boards',
};

function InvertedIconButton({
  ariaLabel,
  glyph,
  onClick,
  toggled,
}: {
  ariaLabel: string;
  glyph: React.ReactNode;
  onClick?: GlobalHeaderClickHandler;
  toggled?: boolean;
}) {
  return (
    <WithTooltip label={ariaLabel}>
      <IconButton
        aria-label={ariaLabel}
        size="small"
        padding="compact"
        style="inverted"
        icon={<Icon size="16" glyph={glyph} />}
        onClick={onClick}
        toggled={toggled}
      />
    </WithTooltip>
  );
}

function ProductBrand({ product }: { product: GlobalHeaderProduct }) {
  const ProductIcon = PRODUCT_ICON[product];
  return (
    <div className={styles['global-header__product']}>
      <span className={styles['global-header__product-icon']} aria-hidden>
        <Icon size="20" glyph={<ProductIcon />} />
      </span>
      <span className={styles['global-header__product-name']}>
        {PRODUCT_LABEL[product]}
      </span>
    </div>
  );
}

function Navigator({
  onBackClick,
  onForwardClick,
}: {
  onBackClick?: GlobalHeaderClickHandler;
  onForwardClick?: GlobalHeaderClickHandler;
}) {
  return (
    <div className={styles['global-header__navigator']}>
      <InvertedIconButton
        ariaLabel="Back"
        glyph={<ArrowLeftIcon />}
        onClick={onBackClick}
      />
      <InvertedIconButton
        ariaLabel="Forward"
        glyph={<ArrowRightIcon />}
        onClick={onForwardClick}
      />
    </div>
  );
}

/**
 * Global Header pattern — top bar spanning the full viewport that contains
 * the product switcher, product branding, navigator, and session-level
 * controls (search, mentions, saved, settings, account).
 *
 * Layout uses a three-column CSS grid for Channels (left | centered search + help | session)
 * so session controls stay anchored to the trailing edge. Playbooks/Boards omit the center
 * column and use two tracks (left product block | session).
 *
 * Matches Figma Global Header v1.2.1 (node 613:4135).
 */
export default function GlobalHeader({
  className = '',
  product = 'channels',
  showChannelsBranding = true,
  showUpgradeButton = false,
  userAvatarSrc,
  userAvatarAlt = 'User',
  onRecentMentionsClick,
  recentMentionsActive = false,
  onProductSwitcherClick,
  productSwitcherActive = false,
  onBackClick,
  onForwardClick,
  onHelpClick,
  helpActive = false,
  onSearchClick,
  onSavedMessagesClick,
  savedMessagesActive = false,
  onSettingsClick,
  settingsActive = false,
  onAccountClick,
  accountActive = false,
}: GlobalHeaderProps) {
  const isChannels = product === 'channels';
  const showBrand = isChannels ? showChannelsBranding : true;

  const rootClass = [
    styles['global-header'],
    isChannels
      ? styles['global-header--channels']
      : styles['global-header--product-only'],
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <header className={rootClass}>
      <div className={styles['global-header__left']}>
        <InvertedIconButton
          ariaLabel="Product switcher"
          glyph={<ProductsIcon />}
          onClick={onProductSwitcherClick}
          toggled={productSwitcherActive}
        />
        {showBrand && <ProductBrand product={product} />}
        <Navigator onBackClick={onBackClick} onForwardClick={onForwardClick} />
      </div>

      {isChannels && (
        <div className={styles['global-header__center']}>
          <div className={styles['global-header__search']}>
            <span className={styles['global-header__search-icon']} aria-hidden>
              <Icon size="12" glyph={<MagnifyIcon />} />
            </span>
            <input
              type="search"
              className={styles['global-header__search-input']}
              placeholder="Search"
              aria-label="Search"
              onClick={onSearchClick}
            />
          </div>
          <InvertedIconButton
            ariaLabel="Help"
            glyph={<HelpCircleOutlineIcon />}
            onClick={onHelpClick}
            toggled={helpActive}
          />
        </div>
      )}

      <div className={styles['global-header__right']}>
        {showUpgradeButton && (
          <Button emphasis="primary" size="x-small">
            Upgrade
          </Button>
        )}
        {product === 'playbooks' && (
          <InvertedIconButton
            ariaLabel="Tasks"
            glyph={<CheckboxMultipleMarkedOutlineIcon />}
          />
        )}
        {isChannels && (
          <>
            <InvertedIconButton
              ariaLabel="Recent mentions"
              glyph={<AtIcon />}
              onClick={onRecentMentionsClick}
              toggled={recentMentionsActive}
            />
            <InvertedIconButton
              ariaLabel="Saved messages"
              glyph={<BookmarkOutlineIcon />}
              onClick={onSavedMessagesClick}
              toggled={savedMessagesActive}
            />
          </>
        )}
        {!isChannels && (
          <InvertedIconButton
            ariaLabel="Help"
            glyph={<HelpCircleOutlineIcon />}
            onClick={onHelpClick}
            toggled={helpActive}
          />
        )}
        <InvertedIconButton
          ariaLabel="Settings"
          glyph={<CogOutlineIcon />}
          onClick={onSettingsClick}
          toggled={settingsActive}
        />
        <button
          type="button"
          className={[
            styles['global-header__account'],
            accountActive ? styles['global-header__account--active'] : '',
          ]
            .filter(Boolean)
            .join(' ')}
          aria-label="Account menu"
          aria-expanded={accountActive || undefined}
          onClick={onAccountClick}
        >
          <UserAvatar
            src={userAvatarSrc}
            alt={userAvatarAlt}
            size="24"
            status
          />
        </button>
      </div>
    </header>
  );
}
