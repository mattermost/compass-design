# Patterns to copy

One example each for a modal, a form field, a select, an async select and a confirm dialog. Pick the one that matches and adapt it; don't start from a blank file.

**Provenance.** The modal, form, select and async select examples are trimmed from mattermost-plugin-google-calendar PR 179 (`gcal`, compass-ui alpha.22, with Jest tests). The confirm dialog is composed from the `Modal` API at alpha.28, because gcal has no confirm dialog and the one in mattermost-plugin-dataminr builds its own portal and backdrop from before `ModalOverlay` existed. The examples target compass-ui alpha.29 and later, where the `--z-` tokens give a correct stacking order with no overrides. For alpha.28 and earlier, see the stacking note below.

**Stacking.** From alpha.29 the tokens do the work: `ModalOverlay` defaults to `--z-modal` (1050) and the menus of `Select`, `Combobox` and `DateRangePicker` default to `--z-menu` (1100), above any modal. Pass no `zIndex` to them. The one number you still set is for a confirm dialog opened over another modal (pattern 5).

On **alpha.28 and earlier** the defaults put menus behind modals. Add one constants file and pass the values to `ModalOverlay`, `Select`, `Combobox` and `DateRangePicker`, then delete the file and the props when you upgrade (`gotchas.md`, row 2):

```ts
// utils/styles.ts (alpha.28 and earlier only)
export const Z_INDEX_MODAL = 1050;
export const Z_INDEX_MENU_PORTAL = 1070;
```

```ts
// utils/styles.ts (all versions: the confirm layer)
export const Z_INDEX_CONFIRM_MODAL = 1060;
```

## 1. Modal with a form

`ModalOverlay` owns the scrim, portal, scroll lock and exit motion. `Modal` owns the chrome. The host owns `open`. The submit button sits in the `footer`, outside the `<form>`, so tie it to the form with `form={FORM_ID}`.

```tsx
// create_event_modal.tsx
import {ModalOverlay} from '@mattermost/compass-ui/components/modal';

export default function CreateEventModal() {
    const visible = useSelector(isCreateEventModalVisible);
    const dispatch = useDispatch();
    const close = () => dispatch(closeCreateEventModal());

    // No onClose on the overlay: the backdrop is static, so only Cancel, the
    // close button or Escape dismiss it. Report this as a behavior choice.
    return (
        <ModalOverlay open={visible}>
            <CreateEventForm open={visible} close={close}/>
        </ModalOverlay>
    );
}
```

```tsx
// create_event_form.tsx
import {Button} from '@mattermost/compass-ui/components/button';
import {Modal} from '@mattermost/compass-ui/components/modal';
import {SectionNotice} from '@mattermost/compass-ui/components/section-notice';

const FORM_ID = 'gcal-create-event-form';

const footer = (
    <>
        <Button type='button' emphasis='tertiary' onClick={handleClose}>{'Cancel'}</Button>
        <Button type='submit' form={FORM_ID} loading={submitting} disabled={disableSubmit}>{'Create'}</Button>
    </>
);

return (
    <Modal open={props.open} onClose={handleClose} title='Create Calendar Event' size='medium' footer={footer}>
        <form id={FORM_ID} className='gcal-create-event-form' onSubmit={handleSubmit}>
            {storedError && <SectionNotice role='alert' type='danger' title={storedError}/>}
            {/* fields */}
        </form>
    </Modal>
);
```

Layout inside the form uses tokens only: `display: flex; flex-direction: column; gap: var(--spacing-l);` and a two-column grid for paired fields. Submit errors go in a `SectionNotice` with `role='alert'`, not a toast.

## 2. Form field (text, with a required marker)

Labels are `ReactNode`, so the required star can live in the label. Mark it `aria-hidden` so the field's accessible name stays "Subject" and `getByRole('combobox', {name: 'Start Time'})` still matches.

```tsx
const requiredLabel = (text: string) => (
    <>
        {text}
        <span className='gcal-required-star' aria-hidden={true}>{' *'}</span>
    </>
);

<TextInput id='subject' label={requiredLabel('Subject')} required={true}
    value={formValues.subject} onChange={(e) => setFormValue('subject', e.target.value)}/>
```

```scss
.gcal-required-star { color: var(--error-text); }
```

Optional fields say so in the label (`'Location (optional)'`). There is no `Setting` wrapper any more: the input's own `label` and, on Select and Combobox, `message` and `messageTone` replace it.

## 3. Select (sync)

`Select` takes `{label, value}` options and an `onChange` that receives the selected string. gcal's `TimeSelector` builds the list with `useMemo` from the paired start and end values, and gives the popup list its own accessible name with `listboxLabel`.

```tsx
import {Select} from '@mattermost/compass-ui/components/select';

// A value that is not in `options` is passed as '' so nothing shows as selected.
const value = props.value && options.some((o) => o.value === props.value) ? props.value : '';

const handleChange = (selectedTime: string) => {
    if (!selectedTime) {
        return;
    }
    props.onChange(props.name, selectedTime);
};

<Select
    id={props.inputId}
    label={props.label}
    listboxLabel='Start time'
    value={value}
    onChange={handleChange}
    options={options}
/>
```

If the old react-select kept showing a value that was no longer in its options, the new select shows nothing. That is a behavior difference to report.

## 4. Async select (Combobox)

Agents get this wrong without a recipe. All three parts are required: `filter={false}`, drop stale responses, and cache the selected options. (On alpha.28 and earlier also set `zIndex`.) This is the multi-select with freeform email; for a single select drop `multiple` and `creatable`, add `clearable`, and pass `selectedOptions={resolved ? [resolved] : []}` (see gcal `channel_selector.tsx`).

```tsx
import {Combobox, type ComboboxOption} from '@mattermost/compass-ui/components/combobox';
import {ErrorMessage} from '@mattermost/compass-ui/components/error-message';

const [labelMap, setLabelMap] = useState<Record<string, string>>({});   // cache of every label ever loaded
const [options, setOptions] = useState<ComboboxOption[]>([]);
const [loading, setLoading] = useState(false);
const requestIdRef = useRef(0);

const loadOptions = useCallback(async (input: string) => {
    const requestId = ++requestIdRef.current;          // drop stale responses
    setLoading(true);
    try {
        const response = await dispatch(autocompleteConnectedUsers(input));
        if (requestId !== requestIdRef.current) {
            return;
        }
        // ... handle response.error, then:
        const loaded = (response.data ?? []).map((u) => ({label: u.mm_display_name, value: u.mm_id}));
        setLabelMap((prev) => ({...prev, ...Object.fromEntries(loaded.map((o) => [o.value, o.label]))}));
        setOptions(loaded);
    } finally {
        if (requestId === requestIdRef.current) {
            setLoading(false);
        }
    }
}, [dispatch]);

useEffect(() => { loadOptions(''); }, [loadOptions]);   // initial list

const selectedOptions = props.value.map((v) => ({label: labelMap[v] || v, value: v}));
// Re-selecting a committed value toggles it off, so hide committed values from the list.
const selectable = options.filter((o) => !props.value.includes(o.value));

<Combobox
    id={props.inputId}
    label='Guests (optional)'
    multiple={true}
    creatable={true}
    filter={false}                 // the server filters; Compass must not filter again
    loading={loading}
    value={props.value}
    options={selectable}
    selectedOptions={selectedOptions}   // keeps chips and the label when results no longer include them
    onChange={handleChange}
    onInputChange={loadOptions}
    onCreateOption={handleCreate}
    invalid={Boolean(storedError)}
/>
{storedError && <ErrorMessage message={storedError}/>}
```

Validate freeform input in `onCreateOption` (gcal checks an email pattern and rejects duplicates case-insensitively) and cover it in the tests.

## 5. Confirm dialog

Compass has no confirm component. Compose `ModalOverlay` and `Modal` with two buttons. Turn both dividers off (`headerDivider={false}` and `footerDivider={false}`; they default to `true`), because a confirm is a short message, not a form. Use `destructive` on the confirm `Button` for removals. Give it a higher z-index than the modal it can open over: both overlays default to `--z-modal`, and there is no token between modal and menu, so pass one explicit number for the confirm layer. Both portal to `document.body`, so the later-opened one may already render on top at the same layer, but that has not been verified; check it in the browser and drop `zIndex` if it holds.

```tsx
import {Button} from '@mattermost/compass-ui/components/button';
import {Modal, ModalOverlay} from '@mattermost/compass-ui/components/modal';
import {Z_INDEX_CONFIRM_MODAL} from '@/utils/styles';

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
        <ModalOverlay open={props.open} onClose={props.onCancel} zIndex={Z_INDEX_CONFIRM_MODAL}>
            <Modal
                open={props.open}
                onClose={props.onCancel}
                title={props.title}
                headerDivider={false}
                footerDivider={false}
                footer={
                    <>
                        <Button emphasis='tertiary' onClick={props.onCancel}>{props.cancelLabel ?? 'Cancel'}</Button>
                        <Button destructive={props.destructive} onClick={props.onConfirm}>{props.confirmLabel}</Button>
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

- The title is the dialog's accessible name. E2E tests find it with `getByRole('dialog', {name: 'Remove subscription?'})` (dataminr). Make titles specific.
- `Modal` sets `aria-modal="true"`. It does not set `role="alertdialog"`. If a destructive confirm should be an alert dialog, that is a Compass gap (`not-covered.md`); ask before adding the role yourself.
- Don't hand-roll a portal, backdrop and fade as dataminr's older `ConfirmationDialog` does. `ModalOverlay` ships the scrim, scroll lock, backdrop click and exit motion.
- Opening a confirm over another modal works because compass-ui keeps one modal stack, and Escape closes only the top one (fixed in alpha.19; see `gotchas.md`).
