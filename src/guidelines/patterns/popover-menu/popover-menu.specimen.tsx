import type { CSSProperties } from 'react';
import avatarEmma from '@/assets/avatars/Emma Novak.png';
import ChevronRightIcon from '@mattermost/compass-icons/components/chevron-right';
import CreationOutlineIcon from '@mattermost/compass-icons/components/creation-outline';
import GlobeIcon from '@mattermost/compass-icons/components/globe';
import LockOutlineIcon from '@mattermost/compass-icons/components/lock-outline';
import SlashForwardIcon from '@mattermost/compass-icons/components/slash-forward';
import { Emoji } from '@mattermost/compass-ui/components/emoji';
import { Icon } from '@mattermost/compass-ui/components/icon';
import { MenuItem } from '@mattermost/compass-ui/components/menu-item';
import {
  PopoverMenu,
  PopoverMenuDivider,
  PopoverMenuGroup,
  PopoverMenuGroupTitle,
  PopoverMenuScroll,
} from '@mattermost/compass-ui/components/popover-menu';
import { UserAvatar } from '@mattermost/compass-ui/components/user-avatar';
import { ChannelCategoryMenu } from '@mattermost/compass-proto';
import { ChannelHeaderMenu } from '@mattermost/compass-proto';
import { ChannelMenu } from '@mattermost/compass-proto';
import { HelpMenu } from '@mattermost/compass-proto';
import { MessageMoreOptionsMenu } from '@mattermost/compass-proto';
import { PlusMenu } from '@mattermost/compass-proto';
import { ProductSwitcherMenu } from '@mattermost/compass-proto';
import { TeamMenu } from '@mattermost/compass-proto';
import { ThreadActionsMenu } from '@mattermost/compass-proto';
import styles from '@/styles/library-demo/patterns.module.scss';

// Autocomplete menus are plain Popover Menus: 480px wide, 304px tall at most (minus the 1px
// border on each side). The scroll region owns the vertical padding.
const AUTOCOMPLETE_WIDTH = 480;
const AUTOCOMPLETE_MAX_HEIGHT = 'calc(304px - 2px)';

// Slash command rows tighten the label / description gap by one spacing step.
const SLASH_COMMAND_ROW_STYLE = {
  '--menu-item-label-gap': 'var(--spacing-xxxxs)',
} as CSSProperties;

const APP_ICON_SRC = `data:image/svg+xml;utf8,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" fill="#E0622F"/><path d="M16 6l8 10-8 10-8-10z" fill="#fff"/></svg>',
)}`;

function SlashCommandTile() {
  return (
    <span
      aria-hidden
      style={{
        display: 'flex',
        padding: 'var(--spacing-xs)',
        margin: 'var(--spacing-xxs) 0',
        borderRadius: 'var(--radius-s)',
        background: 'rgba(var(--center-channel-color-rgb), 0.08)',
      }}
    >
      <Icon glyph={<SlashForwardIcon />} />
    </span>
  );
}

function SlashCommandAppIcon() {
  return (
    <img
      src={APP_ICON_SRC}
      alt=""
      style={{
        display: 'block',
        width: 32,
        height: 32,
        margin: 'var(--spacing-xxs) 0',
        borderRadius: 'var(--radius-pill)',
        objectFit: 'cover',
      }}
    />
  );
}

export default function PopoverMenuLibrary() {
  return (
    <div className={styles['patterns']}>
      <header className={styles['patterns__header']}>
        <h1 className={styles['patterns__heading']}>Popover Menu</h1>
        <p className={styles['patterns__subheading']}>
          Container, grouping, and elevation composed with Menu Item rows.
        </p>
      </header>

      <section className={styles['patterns__section']}>
        <h2 className={styles['patterns__section-title']}>
          Channel header menu
        </h2>
        <p className={styles['patterns__variant-label']}>
          Header overflow pattern: settings, members, more actions, archive
        </p>
        <div className={styles['patterns__popover-menu-demo']}>
          <ChannelHeaderMenu />
        </div>
      </section>

      <section className={styles['patterns__section']}>
        <h2 className={styles['patterns__section-title']}>
          Product switcher menu
        </h2>
        <p className={styles['patterns__variant-label']}>
          Built-in products plus Agents via additionalProducts; trailing check
          on the active product
        </p>
        <div className={styles['patterns__popover-menu-demo']}>
          <ProductSwitcherMenu
            selectedProduct="agents"
            additionalProducts={[
              {
                id: 'agents',
                label: 'Agents',
                icon: <CreationOutlineIcon />,
              },
            ]}
          />
        </div>
      </section>

      <section className={styles['patterns__section']}>
        <h2 className={styles['patterns__section-title']}>Channel menu</h2>
        <p className={styles['patterns__variant-label']}>
          Narrow width (174px): read/favorite/mute, move submenu, link and
          members, destructive leave
        </p>
        <div className={styles['patterns__popover-menu-demo']}>
          <ChannelMenu />
        </div>
      </section>

      <section className={styles['patterns__section']}>
        <h2 className={styles['patterns__section-title']}>Help menu</h2>
        <p className={styles['patterns__variant-label']}>
          Compact width, single group, Menu Item rows with leading icons
        </p>
        <div className={styles['patterns__popover-menu-demo']}>
          <HelpMenu />
        </div>
      </section>

      <section className={styles['patterns__section']}>
        <h2 className={styles['patterns__section-title']}>Team menu</h2>
        <p className={styles['patterns__variant-label']}>
          Default: secondary label on Invite, join team permission, link-style
          footer row
        </p>
        <div className={styles['patterns__popover-menu-demo']}>
          <TeamMenu />
        </div>
        <p
          className={styles['patterns__variant-label']}
          style={{ marginTop: 'var(--spacing-l)' }}
        >
          With admin and create team (Manage members, Manage groups, Create a
          team)
        </p>
        <div className={styles['patterns__popover-menu-demo']}>
          <TeamMenu adminOptions createTeamPermission joinTeamPermission />
        </div>
      </section>

      <section className={styles['patterns__section']}>
        <h2 className={styles['patterns__section-title']}>Plus menu</h2>
        <p className={styles['patterns__variant-label']}>
          Channel actions, category creation, invite row with secondary label
        </p>
        <div className={styles['patterns__popover-menu-demo']}>
          <PlusMenu />
        </div>
      </section>

      <section className={styles['patterns__section']}>
        <h2 className={styles['patterns__section-title']}>
          Channel category menu
        </h2>
        <p className={styles['patterns__variant-label']}>
          Category actions, sort row with trailing detail and chevron, browse /
          create channels, create new category
        </p>
        <div className={styles['patterns__popover-menu-demo']}>
          <ChannelCategoryMenu />
        </div>
      </section>

      <section className={styles['patterns__section']}>
        <h2 className={styles['patterns__section-title']}>
          Message more options menu
        </h2>
        <p className={styles['patterns__variant-label']}>
          Keyboard hints, remind submenu chevron, copy actions, optional edit
          and flag rows
        </p>
        <div className={styles['patterns__popover-menu-demo']}>
          <MessageMoreOptionsMenu />
        </div>
        <p
          className={styles['patterns__variant-label']}
          style={{ marginTop: 'var(--spacing-l)' }}
        >
          Without edit or flag (view-only permissions)
        </p>
        <div className={styles['patterns__popover-menu-demo']}>
          <MessageMoreOptionsMenu
            permissionToEdit={false}
            showFlagOption={false}
          />
        </div>
      </section>

      <section className={styles['patterns__section']}>
        <h2 className={styles['patterns__section-title']}>
          Thread actions menu
        </h2>
        <p className={styles['patterns__variant-label']}>
          Thread follow and open actions, shortcuts on unread/save, copy link
          group
        </p>
        <div className={styles['patterns__popover-menu-demo']}>
          <ThreadActionsMenu />
        </div>
      </section>

      <section className={styles['patterns__section']}>
        <h2 className={styles['patterns__section-title']}>Child menu</h2>
        <p className={styles['patterns__variant-label']}>Elevation 5</p>
        <div className={styles['patterns__popover-menu-demo']}>
          <div className={styles['patterns__popover-nested-demo']}>
            <PopoverMenu>
              <MenuItem
                label="Channel settings"
                trailingElement
                trailingVisual={<Icon glyph={<ChevronRightIcon />} size="16" />}
              />
            </PopoverMenu>
            <PopoverMenu variant="child">
              <MenuItem label="Rename channel" />
              <MenuItem label="Convert to private" />
            </PopoverMenu>
          </div>
        </div>
      </section>

      <section className={styles['patterns__section']}>
        <h2 className={styles['patterns__section-title']}>User autocomplete</h2>
        <p className={styles['patterns__variant-label']}>
          Typing @ in the message box: 24px User Avatar, username, and full name
          inline. 480px wide, 304px max height
        </p>
        <div className={styles['patterns__popover-menu-demo']}>
          <PopoverMenu style={{ width: AUTOCOMPLETE_WIDTH }} aria-label="Users">
            <PopoverMenuScroll maxHeight={AUTOCOMPLETE_MAX_HEIGHT}>
              <PopoverMenuGroup>
                <PopoverMenuGroupTitle>Channel members</PopoverMenuGroupTitle>
                <MenuItem
                  active
                  label="@emma"
                  secondaryLabel="Emma Novak"
                  secondaryLabelPosition="inline"
                  leadingVisual={
                    <UserAvatar
                      src={avatarEmma}
                      alt="Emma Novak"
                      size="24"
                      status
                    />
                  }
                />
                <MenuItem
                  label="@emily"
                  secondaryLabel="Emily Chen"
                  secondaryLabelPosition="inline"
                  leadingVisual={
                    <UserAvatar alt="Emily Chen" name="Emily Chen" size="24" />
                  }
                />
              </PopoverMenuGroup>
              <PopoverMenuDivider />
              <PopoverMenuGroup>
                <PopoverMenuGroupTitle>Other members</PopoverMenuGroupTitle>
                <MenuItem
                  label="@emil"
                  secondaryLabel="Emil Jansen"
                  secondaryLabelPosition="inline"
                  leadingVisual={
                    <UserAvatar
                      alt="Emil Jansen"
                      name="Emil Jansen"
                      size="24"
                    />
                  }
                />
              </PopoverMenuGroup>
            </PopoverMenuScroll>
          </PopoverMenu>
        </div>
      </section>

      <section className={styles['patterns__section']}>
        <h2 className={styles['patterns__section-title']}>
          Slash command autocomplete
        </h2>
        <p className={styles['patterns__variant-label']}>
          Typing / in the message box: 32px slash tile or the integration&apos;s
          own image, command with hint, and a description below that can wrap
        </p>
        <div className={styles['patterns__popover-menu-demo']}>
          <PopoverMenu
            style={{ width: AUTOCOMPLETE_WIDTH }}
            aria-label="Commands"
          >
            <PopoverMenuScroll maxHeight={AUTOCOMPLETE_MAX_HEIGHT}>
              <PopoverMenuGroup>
                <PopoverMenuGroupTitle>Commands</PopoverMenuGroupTitle>
                <MenuItem
                  active
                  style={SLASH_COMMAND_ROW_STYLE}
                  label="agenda [command]"
                  secondaryLabel="Available commands: list, queue, setting, help"
                  leadingVisual={<SlashCommandTile />}
                />
                <MenuItem
                  style={SLASH_COMMAND_ROW_STYLE}
                  label="deploy [command]"
                  secondaryLabel="Available commands: status, releases, rollbacks, expire_freeze, help, about"
                  leadingVisual={<SlashCommandAppIcon />}
                />
                <MenuItem
                  style={SLASH_COMMAND_ROW_STYLE}
                  label="away"
                  secondaryLabel="Set your status to away"
                  leadingVisual={<SlashCommandTile />}
                />
                <MenuItem
                  style={SLASH_COMMAND_ROW_STYLE}
                  label="call [subcommand]"
                  secondaryLabel="Start or join a call in the current channel"
                  leadingVisual={<SlashCommandTile />}
                />
                <MenuItem
                  style={SLASH_COMMAND_ROW_STYLE}
                  label="code"
                  secondaryLabel="Display text as a code block"
                  leadingVisual={<SlashCommandTile />}
                />
              </PopoverMenuGroup>
            </PopoverMenuScroll>
          </PopoverMenu>
        </div>
      </section>

      <section className={styles['patterns__section']}>
        <h2 className={styles['patterns__section-title']}>
          Channel link autocomplete
        </h2>
        <p className={styles['patterns__variant-label']}>
          Typing ~ in the message box: globe or lock icon, channel name, and
          handle inline, grouped by public and private
        </p>
        <div className={styles['patterns__popover-menu-demo']}>
          <PopoverMenu
            style={{ width: AUTOCOMPLETE_WIDTH }}
            aria-label="Channels"
          >
            <PopoverMenuScroll maxHeight={AUTOCOMPLETE_MAX_HEIGHT}>
              <PopoverMenuGroup>
                <PopoverMenuGroupTitle>Public channels</PopoverMenuGroupTitle>
                <MenuItem
                  active
                  label="Design"
                  secondaryLabel="~design"
                  secondaryLabelPosition="inline"
                  leadingVisual={<Icon glyph={<GlobeIcon />} />}
                />
                <MenuItem
                  label="Design Systems"
                  secondaryLabel="~design-systems"
                  secondaryLabelPosition="inline"
                  leadingVisual={<Icon glyph={<GlobeIcon />} />}
                />
              </PopoverMenuGroup>
              <PopoverMenuDivider />
              <PopoverMenuGroup>
                <PopoverMenuGroupTitle>Private channels</PopoverMenuGroupTitle>
                <MenuItem
                  label="Design Leads"
                  secondaryLabel="~design-leads"
                  secondaryLabelPosition="inline"
                  leadingVisual={<Icon glyph={<LockOutlineIcon />} />}
                />
              </PopoverMenuGroup>
            </PopoverMenuScroll>
          </PopoverMenu>
        </div>
      </section>

      <section className={styles['patterns__section']}>
        <h2 className={styles['patterns__section-title']}>
          Emoji autocomplete
        </h2>
        <p className={styles['patterns__variant-label']}>
          Typing : plus two characters: 16px emoji and its shortcode
        </p>
        <div className={styles['patterns__popover-menu-demo']}>
          <PopoverMenu style={{ width: AUTOCOMPLETE_WIDTH }} aria-label="Emoji">
            <PopoverMenuScroll maxHeight={AUTOCOMPLETE_MAX_HEIGHT}>
              <PopoverMenuGroup>
                <MenuItem
                  active
                  label=":smile:"
                  leadingVisual={<Emoji emoji="😄" size="16" />}
                />
                <MenuItem
                  label=":smiley:"
                  leadingVisual={<Emoji emoji="😃" size="16" />}
                />
                <MenuItem
                  label=":smirk:"
                  leadingVisual={<Emoji emoji="😏" size="16" />}
                />
                <MenuItem
                  label=":smile_cat:"
                  leadingVisual={<Emoji emoji="😸" size="16" />}
                />
              </PopoverMenuGroup>
            </PopoverMenuScroll>
          </PopoverMenu>
        </div>
      </section>
    </div>
  );
}
