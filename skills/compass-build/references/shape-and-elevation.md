# Shape, radius and elevation

Source: `/foundations/shape`, `/foundations/elevation`.

## Radius

| Shape             | Token                                             | Use                                                                                  |
| ----------------- | ------------------------------------------------- | ------------------------------------------------------------------------------------ |
| Rectangle (sharp) | none                                              | Large global containers at the window edge: sidebar, global header, channel viewport |
| Rounded rectangle | `--radius-s` (4px) default                        | Buttons, inputs, cards, banners, most interactive elements                           |
| Larger rounded    | `--radius-m` 8, `--radius-l` 12, `--radius-xl` 16 | Larger surfaces only (popovers 8px, modals, panels)                                  |
| Pill              | `--radius-pill`                                   | Counts and status only (Mention Badge)                                               |
| Circle            | `--radius-pill`                                   | Avatars, Status Badge, Unread Badge                                                  |

- Start with `--radius-s`. Go larger only when a spec says so, and only on larger surfaces. Bigger surface, bigger radius.
- Nested rounded surfaces: the inner radius is smaller than the outer. **[proposed]**
- Never use `--radius-full` (deprecated). Never use a pill shape for a button.
- A person is never a button or tag shape: users are circles.

## Elevation

Six levels above flat (0). Pick the level by role, not by eye.

| Level | Token           | Role                                                 |
| ----- | --------------- | ---------------------------------------------------- |
| 1     | `--elevation-1` | Subtle: hover lift, small dropdowns                  |
| 2     | `--elevation-2` | Buttons, chips, small cards                          |
| 3     | `--elevation-3` | Cards, menus, tooltips                               |
| 4     | `--elevation-4` | Modals, popovers, floating panels                    |
| 5     | `--elevation-5` | Dialogs, drawers; child menus one level above parent |
| 6     | `--elevation-6` | Full-screen overlays                                 |

- Default is flat. Most surfaces in a layout have no shadow; separate them with space, a divider or a subtle fill first. **[proposed]**
- A child surface (submenu spawned from a menu) sits one level above its parent.
- Stacking: `--z-sidebar` 100, `--z-modal` 200, `--z-tooltip` 300. Don't invent z-index numbers.
