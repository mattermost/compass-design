import type { ReactNode } from 'react';
import { GlobalHeader } from '../GlobalHeader';
import type { GlobalHeaderProduct, GlobalHeaderProps } from '../GlobalHeader';
import shellStyles from '../ChannelShell/ChannelShell.module.scss';

export interface ProductShellProps {
  /** Product shown in the Global Header branding. Default: channels. */
  product?: GlobalHeaderProduct;
  /**
   * The Product Rail (`<ProductRail />`). It takes the leftmost column where
   * `ChannelShell` puts the Team Sidebar.
   */
  productRail: ReactNode;
  /** The product's left sidebar (e.g. `ChannelsSidebar` for Channels). Omit for products without one. */
  sidebar?: ReactNode;
  /** Main area of the product. Fills the inner panel. */
  children?: ReactNode;
  /** Optional right column (thread, info) beside `children`. */
  trailing?: ReactNode;
  userAvatarSrc?: string;
  userAvatarAlt?: string;
  /** Floating UI over the shell (e.g. call widget). */
  floating?: ReactNode;
  /** Layered surface over the shell (e.g. call popout). */
  overlay?: ReactNode;
  /** Global Header click handlers and `*Active` flags, forwarded as-is. */
  globalHeaderProps?: Omit<
    GlobalHeaderProps,
    'product' | 'userAvatarSrc' | 'userAvatarAlt' | 'className'
  >;
  className?: string;
}

/**
 * Product layout: the desktop shell with the Product Rail in place of the Team
 * Sidebar. Product-agnostic — pass the rail, the product's own sidebar, and its
 * main content. The Global Header hides its product name (the rail shows it);
 * pass `globalHeaderProps={{ showProductBranding: true }}` to bring it back.
 * Shares its frame styling with `ChannelShell`.
 */
export default function ProductShell({
  product = 'channels',
  productRail,
  sidebar,
  children,
  trailing,
  userAvatarSrc,
  userAvatarAlt = 'User',
  floating,
  overlay,
  globalHeaderProps,
  className = '',
}: ProductShellProps) {
  const rootClass = [shellStyles['channel-shell'], className]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={rootClass}>
      <div className={shellStyles['channel-shell__global-header']}>
        <GlobalHeader
          product={product}
          userAvatarSrc={userAvatarSrc}
          userAvatarAlt={userAvatarAlt}
          // The Product Rail already shows the active product, so the header drops its name.
          showProductBranding={false}
          {...globalHeaderProps}
        />
      </div>

      <div className={shellStyles['channel-shell__body']}>
        <div className={shellStyles['channel-shell__team-sidebar']}>
          {productRail}
        </div>

        <div className={shellStyles['channel-shell__outer-panel']}>
          {sidebar != null && (
            <div className={shellStyles['channel-shell__channels-sidebar']}>
              {sidebar}
            </div>
          )}
          <div className={shellStyles['channel-shell__inner-panel']}>
            <div className={shellStyles['channel-shell__center']}>
              {children}
            </div>
            {trailing}
          </div>
        </div>
      </div>

      {overlay}
      {floating != null && (
        <div className={shellStyles['channel-shell__floating']}>{floating}</div>
      )}
    </div>
  );
}
