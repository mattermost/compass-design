# Updating tests

Step 6. Migrated components expose different roles and behavior from react-bootstrap and react-select, so tests must change with them. The Jest and Testing Library snippets come from mattermost-plugin-google-calendar PR 179 (`gcal`). The Playwright snippets and the visual-baseline step are standard Playwright written against the roles in the compass-ui source (`Modal` is `role="dialog"` named by its title, the `Combobox` input is `role="combobox"`, a removable `Chip` has a fixed accessible name); they are not taken from a published reference migration, so run them against your app before relying on them.

## Jest and Testing Library

Query by role and accessible name, the way the reference migrations do.

**Open a Combobox or Select, pick an option** (the menu doesn't open on focus; click first):

```tsx
await userEvent.click(
  screen.getByRole('combobox', { name: 'Guests (optional)' }),
);
await userEvent.click(await screen.findByRole('option', { name: 'User Two' }));
expect(onChange).toHaveBeenLastCalledWith(['u2']);
```

**Type into a creatable Combobox:**

```tsx
await userEvent.type(
  screen.getByRole('combobox', { name: 'Guests (optional)' }),
  'new@example.com',
);
await userEvent.click(
  await screen.findByRole('option', { name: /new@example\.com/ }),
);
```

**Async data.** Render inside `act` so the initial load settles, and mock the dispatch:

```tsx
await act(async () => {
  render(
    <AttendeeSelector inputId="attendees" value={value} onChange={onChange} />,
  );
});
```

**A load error stops the loading state:**

```tsx
mockDispatch.mockRejectedValue(new Error('network down'));
await setup();
expect(screen.getByRole('alert')).toHaveTextContent('network down');
await userEvent.click(
  screen.getByRole('combobox', { name: 'Guests (optional)' }),
);
expect(document.querySelector('[aria-busy="true"]')).not.toBeInTheDocument();
```

**A labelled popup list** (a Select with `listboxLabel`):

```tsx
expect(screen.getByRole('listbox', { name: 'End time' })).toBeInTheDocument();
```

**Required marker doesn't change the name.** The star is `aria-hidden`, so `getByRole('combobox', {name: 'Start Time'})` still matches. Test the star separately:

```tsx
expect(screen.getByText('Subject').parentElement).toHaveTextContent(
  'Subject *',
);
```

**Submit from a modal footer** works through `form={FORM_ID}`, so click the footer button by name:

```tsx
await userEvent.click(screen.getByRole('button', { name: 'Create' }));
```

**Notices.** A `SectionNotice` with `type='danger'` and `role='alert'`:

```tsx
const notice = screen.getByRole('alert');
expect(notice).toHaveTextContent('Calendar unavailable');
expect(notice.className).toMatch(/section-notice--type-danger/);
```

The class name comes from a CSS module, so it is brittle. Prefer the role and the text, and keep the class assertion only when the tone itself is what you are testing.

**Mock what the component doesn't own.** gcal replaced child selectors with `jest.mock('@/components/attendee_selector', () => () => null)` in the form test, and tested each selector in its own file. That keeps a form test from needing a server.

**What to add.** Each migrated selector and modal gets a test file. gcal added tests for the attendee, channel and time selectors and the create form, where there were none before.

**Reported, not reproduced:** jsdom's `getComputedStyle` can throw on pseudo-elements. If a test fails that way, stub `getComputedStyle` in that test file. Don't change the component to avoid it.

## Playwright

Use page objects, and role-based locators with exact names. Stacked dialogs and similar labels ("Save", "Cancel") are why `exact: true` matters:

```ts
this.removeDialog = page.getByRole('dialog', { name: 'Remove item?' });
this.confirmRemoveButton = this.removeDialog.getByRole('button', {
  name: 'Remove',
  exact: true,
});
this.saveButton = page.getByRole('button', { name: 'Save', exact: true });

// a combobox by its field name
this.container.getByRole('combobox', { name: field });

// a removable Chip: its name is `{label}. Press Delete to remove.` unless aria-label is set
this.container.getByRole('button', {
  name: `${value}. Press Delete to remove.`,
  exact: true,
});
```

Rules for the specs:

- Scope a locator to its dialog (`this.removeDialog.getByRole(...)`) instead of searching the whole page.
- Open a Combobox by clicking it or typing, then click an `option`. Don't focus the field and press Enter.
- Match dialogs by title, so give every dialog a specific title.
- Keep the repo's own runner settings (workers, retries, trace and screenshot options); follow the consumer's config rather than changing it.

## Visual baselines

If the consumer keeps screenshot baselines, a migration changes them on purpose. The process:

1. Run the E2E suite and confirm the failures are only screenshot diffs.
2. Regenerate the baselines (`npx playwright test --update-snapshots`, standard Playwright; no reference repo here uses it yet).
3. **Open every changed PNG and look at it.** Check spacing, the stacking order of menus and modals, truncation, and dark and light themes if the consumer tests both. A regenerated baseline you didn't look at has locked in whatever the migration broke.
4. List anything that looks different on purpose in the report, under UX changes.

If the consumer has no visual baselines, don't add them as part of a migration. Offer it in the report.
