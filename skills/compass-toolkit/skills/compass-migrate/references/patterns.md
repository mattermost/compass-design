# Patterns to copy

One example each for a modal, a form field, a select, an async select and a confirm dialog. Pick the one that matches and adapt it; don't start from a blank file.

**Provenance.** The modal, form, select and async select examples are trimmed from mattermost-plugin-google-calendar PR 179 (`gcal`, compass-ui alpha.22, with Jest tests). The confirm dialog is composed from the `Modal` API at alpha.30, because gcal has no confirm dialog, and the hand-rolled confirm dialogs seen in other migrations build their own portal, backdrop and fade from before `ModalOverlay` existed. The examples target compass-ui alpha.30 and later, where the `--z-` tokens give a correct stacking order with no overrides. For alpha.28 and earlier, see the stacking note below.

**Stacking.** From alpha.29 the tokens do the work: `ModalOverlay` defaults to `--z-modal` (1050) and the menus of `Select`, `Combobox` and `DateRangePicker` default to `--z-menu` (1100), above any modal. Pass no `zIndex` to them. The one layer you still set is for a confirm dialog opened over another modal (pattern 5). From alpha.30 that layer is a token: pass `zIndex='var(--z-confirm-modal)'` (1060, between `--z-modal` and `--z-menu`; `ModalOverlay`'s `zIndex` accepts a string from that release). On alpha.29 and earlier there is no token between modal (1050) and menu (1100), so pass the number 1060 from the constant below.

On **alpha.28 and earlier** `--z-modal` is 200 and menus default to 1000, so a modal raised to the webapp's layer (1050) covers its own menus. Add one constants file and pass the values to `ModalOverlay`, `Select`, `Combobox` and `DateRangePicker`, then delete the file and the props when you upgrade (`gotchas.md`, row 2):

```ts
// utils/styles.ts (alpha.28 and earlier only)
export const Z_INDEX_MODAL = 1050;
export const Z_INDEX_MENU_PORTAL = 1070;
```

```ts
// utils/styles.ts (alpha.29 and earlier only; alpha.30 has --z-confirm-modal)
export const Z_INDEX_CONFIRM_MODAL = 1060;
```

## 1. Modal with a form

`ModalOverlay` owns the scrim, portal, scroll lock and exit motion. `Modal` owns the chrome. The host owns `open`. The submit button sits in the `footer`, outside the `<form>`, so tie it to the form with `form={FORM_ID}`.

```tsx
// create_event_modal.tsx
import { ModalOverlay } from '@mattermost/compass-ui/components/modal';

export default function CreateEventModal() {
  const visible = useSelector(isCreateEventModalVisible);
  const dispatch = useDispatch();
  const close = () => dispatch(closeCreateEventModal());

  // Give the overlay an onClose or the backdrop won't dismiss. Pass `open` to
  // the Modal too, or it never animates. Use the same guarded handler as
  // Cancel, so a dirty form asks before it discards.
  return (
    <ModalOverlay open={visible} onClose={close}>
      <CreateEventForm open={visible} close={close} />
    </ModalOverlay>
  );
}
```

```tsx
// create_event_form.tsx
import { Button } from '@mattermost/compass-ui/components/button';
import { Modal } from '@mattermost/compass-ui/components/modal';
import { SectionNotice } from '@mattermost/compass-ui/components/section-notice';

const FORM_ID = 'gcal-create-event-form';

const footer = (
  <>
    <Button type="button" emphasis="tertiary" onClick={handleClose}>
      {'Cancel'}
    </Button>
    <Button
      type="submit"
      form={FORM_ID}
      loading={submitting}
      disabled={disableSubmit}
    >
      {'Create'}
    </Button>
  </>
);

return (
  <Modal
    open={props.open}
    onClose={handleClose}
    title="Create Calendar Event"
    size="medium"
    footer={footer}
  >
    <form
      id={FORM_ID}
      className="gcal-create-event-form"
      onSubmit={handleSubmit}
    >
      {storedError && (
        <SectionNotice role="alert" type="danger" title={storedError} />
      )}
      {/* fields */}
    </form>
  </Modal>
);
```

Checks before you move on: the modal fades in and out like the confirm dialog; Escape and a backdrop click both close it; `size` was chosen on purpose; the title says what it is (`New Jira Subscription`, `Edit Jira Subscription`) with no filler subtitle; icon-only buttons in the header and in rows have tooltips; and Cancel, Back, Escape and the backdrop open a discard confirm only when the form is dirty.

Layout inside the form uses tokens only: `display: flex; flex-direction: column; gap: var(--spacing-l);` and a two-column grid for paired fields. Submit errors go in a `SectionNotice` with `role='alert'`, not a toast.

## 2. Form field (text, with a required marker)

Labels are `ReactNode`, so the required star can live in the label. Mark it `aria-hidden` so the field's accessible name stays "Subject" and `getByRole('combobox', {name: 'Start Time'})` still matches.

```tsx
const requiredLabel = (text: string) => (
  <>
    {text}
    <span className="gcal-required-star" aria-hidden={true}>
      {' *'}
    </span>
  </>
);

<TextInput
  id="subject"
  label={requiredLabel('Subject')}
  required={true}
  value={formValues.subject}
  onChange={(e) => setFormValue('subject', e.target.value)}
/>;
```

```scss
.gcal-required-star {
  color: var(--error-text, var(--color-danger));
}
```

Compass draws no required marker anywhere. On `TextInput` and `TextArea`, `required` is the native attribute (the browser may run its own validation when the form submits). On `Select` and `Combobox` it only sets `aria-required`. The visible star is yours to add, as above.

On `Select` and `Combobox`, a node label (like the starred one) does not name the options list. The list is named from `label` only when `label` is a string; otherwise it uses `aria-label`, then `listboxLabel`, then the default "Options". So when a `Select` or `Combobox` gets a starred label, also pass a plain string for the list, or assistive tech hears "Options" instead of the field name:

```tsx
<Select
  id="start_time"
  label={requiredLabel('Start Time')}
  listboxLabel="Start time"
  options={options}
  value={value}
  onChange={handleChange}
/>
```

(`Combobox` takes `listboxLabel` too; a plain `aria-label` also works.) The combobox itself is still named "Start Time", because the star is `aria-hidden`. Only the popup list needs the extra string.

Optional fields say so in the label (`'Location (optional)'`). There is no `Setting` wrapper any more: the input's own `label` and, on Select and Combobox, `message` and `messageTone` replace it.

## 3. Select (sync)

`Select` takes `{label, value}` options and an `onChange` that receives the selected string. gcal's `TimeSelector` builds the list with `useMemo` from the paired start and end values, and gives the popup list its own accessible name with `listboxLabel`.

```tsx
import { Select } from '@mattermost/compass-ui/components/select';

// A value that is not in `options` is passed as '' so nothing shows as selected.
const value =
  props.value && options.some((o) => o.value === props.value)
    ? props.value
    : '';

const handleChange = (selectedTime: string) => {
  if (!selectedTime) {
    return;
  }
  props.onChange(props.name, selectedTime);
};

<Select
  id={props.inputId}
  label={props.label}
  listboxLabel="Start time"
  value={value}
  onChange={handleChange}
  options={options}
/>;
```

If the old react-select kept showing a value that was no longer in its options, the new select shows nothing. That is a behavior difference to report. The host still holds the old value, so a form that submits host state submits it too: validate the value against the current options, and clear it when it is no longer valid.

## 4. Async select (Combobox)

Agents get this wrong without a recipe. All three parts are required: `filter={false}`, drop stale responses, and cache the selected options. (On alpha.28 and earlier also set `zIndex`.) This is the multi-select with freeform email; for a single select drop `multiple` and `creatable`, add `clearable`, and pass `selectedOptions={resolved ? [resolved] : []}` (see gcal `channel_selector.tsx`).

```tsx
import {
  Combobox,
  type ComboboxOption,
} from '@mattermost/compass-ui/components/combobox';

const [labelMap, setLabelMap] = useState<Record<string, string>>({}); // cache of every label ever loaded
const [options, setOptions] = useState<ComboboxOption[]>([]);
const [loading, setLoading] = useState(false);
const [storedError, setStoredError] = useState('');
const requestIdRef = useRef(0);

const loadOptions = useCallback(
  async (input: string) => {
    const requestId = ++requestIdRef.current; // drop stale responses
    setLoading(true);
    try {
      const response = await dispatch(autocompleteConnectedUsers(input));
      if (requestId !== requestIdRef.current) {
        return;
      }
      if (response.error) {
        setStoredError(response.error); // must be a string: gcal's thunk returns `e.message`; if yours returns an Error object, store its `message`
        setOptions([]);
        return;
      }
      setStoredError('');
      const loaded = (response.data ?? []).map((u) => ({
        label: u.mm_display_name,
        value: u.mm_id,
      }));
      setLabelMap((prev) => ({
        ...prev,
        ...Object.fromEntries(loaded.map((o) => [o.value, o.label])),
      }));
      setOptions(loaded);
    } catch (err) {
      if (requestId === requestIdRef.current) {
        setStoredError(String(err)); // shown through the field's `message`
      }
    } finally {
      if (requestId === requestIdRef.current) {
        setLoading(false);
      }
    }
  },
  [dispatch],
);

useEffect(() => {
  loadOptions('');
}, [loadOptions]); // initial list

const selectedOptions = props.value.map((v) => ({
  label: labelMap[v] || v,
  value: v,
}));
// Re-selecting a committed value toggles it off, so hide committed values from the list.
const selectable = options.filter((o) => !props.value.includes(o.value));

<Combobox
  id={props.inputId}
  label="Guests (optional)"
  multiple={true}
  creatable={true}
  filter={false} // the server filters; Compass must not filter again
  loading={loading}
  value={props.value}
  options={selectable}
  selectedOptions={selectedOptions} // keeps chips and the label when results no longer include them
  onChange={handleChange}
  onInputChange={loadOptions}
  onCreateOption={handleCreate}
  message={storedError || undefined} // error tone by default: sets the invalid state and aria-describedby
/>;
```

A field error goes in the field's own `message` prop (`Select`, `Combobox`, `TextInput`, `TextArea`; error tone is the default), as the rule in `../../compass-build/references/components.md` says. gcal rendered a separate `ErrorMessage` under the field; `ErrorMessage` is `FieldMessage` in the error tone, kept for existing imports, and is only needed where the input has no `message` prop (`DateRangePicker` today).

While a request is pending the previous rows stay visible and selectable: the `loading` row only takes the place of the empty message. That matches the gcal migration; if stale rows would be wrong for your data, decide how to hide them and check it in the browser.

Validate freeform input in `onCreateOption` (gcal checks an email pattern and rejects duplicates case-insensitively) and cover it in the tests.

## 5. Confirm dialog

Compass has no confirm component. Compose `ModalOverlay` and `Modal` with two buttons. Turn both dividers off (`headerDivider={false}` and `footerDivider={false}`; they default to `true`), because a confirm is a short message, not a form. Use `destructive` on the confirm `Button` for removals. Give it the confirm layer so it opens above the modal it was launched from: both overlays default to `--z-modal`, so pass `zIndex='var(--z-confirm-modal)'` (alpha.30 and later; on alpha.29 and earlier pass 1060). A menu opened inside the confirm still sits above it (`--z-menu`, 1100).

```tsx
import { Button } from '@mattermost/compass-ui/components/button';
import { Modal, ModalOverlay } from '@mattermost/compass-ui/components/modal';

type Props = {
  open: boolean;
  title: React.ReactNode;
  message: React.ReactNode;
  confirmLabel: React.ReactNode;
  cancelLabel?: React.ReactNode;
  destructive?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

export default function ConfirmDialog(props: Props) {
  return (
    <ModalOverlay
      open={props.open}
      onClose={props.onCancel}
      zIndex="var(--z-confirm-modal)"
    >
      {' '}
      {/* alpha.29 and earlier: zIndex={1060} */}
      <Modal
        open={props.open}
        onClose={props.onCancel}
        title={props.title}
        headerDivider={false}
        footerDivider={false}
        footer={
          <>
            <Button emphasis="tertiary" onClick={props.onCancel}>
              {props.cancelLabel ?? 'Cancel'}
            </Button>
            <Button destructive={props.destructive} onClick={props.onConfirm}>
              {props.confirmLabel}
            </Button>
          </>
        }
      >
        {props.message}
      </Modal>
    </ModalOverlay>
  );
}
```

Notes:

- The title is the dialog's accessible name. E2E tests find it with `getByRole('dialog', {name: 'Remove item?'})`. Make titles specific.
- `Modal` sets `aria-modal="true"`. It does not set `role="alertdialog"`. If a destructive confirm should be an alert dialog, that is a Compass gap (`not-covered.md`); ask before adding the role yourself.
- Don't hand-roll a portal, backdrop and fade, as older confirm dialogs do. `ModalOverlay` ships the scrim, scroll lock, backdrop click and exit motion.
- Opening a confirm over another modal works because compass-ui keeps one modal stack, and Escape closes only the top one (fixed in alpha.19; see `gotchas.md`).
