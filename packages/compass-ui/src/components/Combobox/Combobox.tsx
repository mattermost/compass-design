import type {
  ChangeEvent,
  FocusEvent,
  KeyboardEvent,
  MouseEvent,
  ReactNode,
} from 'react';
import {
  forwardRef,
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from 'react';
import ChevronDownIcon from '@mattermost/compass-icons/components/chevron-down';
import PlusIcon from '@mattermost/compass-icons/components/plus';
import Chip from '@/components/Chip/Chip';
import ChipGroup from '@/components/Chip/ChipGroup';
import type { ChipSize } from '@/components/Chip/Chip';
import Icon from '@/components/Icon/Icon';
import { IconSlotContext } from '@/components/Icon/Icon';
import MenuItem from '@/components/MenuItem/MenuItem';
import PopoverMenu, {
  PopoverMenuScroll,
} from '@/components/PopoverMenu/PopoverMenu';
import Spinner from '@/components/Spinner/Spinner';
import UserAvatar from '@/components/UserAvatar/UserAvatar';
import { useAnchoredPopupPortal } from '@/hooks/useAnchoredPopupPortal';
import { useOutsideClose } from '@/hooks/useOutsideClose';
import { usePopoverTransition } from '@/hooks/usePopoverTransition';
import { toKebab } from '@/utils/string';
import styles from './Combobox.module.scss';

export type ComboboxSize = 'small' | 'medium' | 'large';

export type ComboboxOption = {
  value: string;
  label: string;
  disabled?: boolean;
  /** Leading content for the list row (icon or avatar node). */
  leadingVisual?: ReactNode;
  /** Avatar for chips / list when a photo is preferred over `leadingVisual`. */
  leadingAvatar?: { src: string; alt: string };
  secondaryLabel?: string;
};

export interface ComboboxProps {
  options: ComboboxOption[];
  /** When true, selected values render as removable chips. Default: false. */
  multiple?: boolean;
  value?: string | string[] | null;
  defaultValue?: string | string[] | null;
  onChange?: (value: string | string[] | null) => void;
  inputValue?: string;
  defaultInputValue?: string;
  onInputChange?: (value: string) => void;
  label?: ReactNode;
  placeholder?: string;
  leadingIcon?: ReactNode;
  size?: ComboboxSize;
  invalid?: boolean;
  disabled?: boolean;
  /**
   * Client-side filter. `true` (default) matches labels case-insensitively.
   * `false` shows all options (caller filters via `inputValue` / `onInputChange`).
   */
  filter?: boolean | ((option: ComboboxOption, query: string) => boolean);
  /** Shown when there are no rows to pick from. Default: "No results". */
  emptyMessage?: ReactNode;
  /**
   * When true, the menu shows a loading row (with Spinner) in place of the
   * empty message. Set while async results are in flight.
   */
  loading?: boolean;
  /** Loading row text. Default: "Loading…". */
  loadingMessage?: ReactNode;
  /**
   * Option objects for the current value(s), used for chips and the
   * single-select label when a value is missing from `options` (e.g. an async
   * search that no longer returns it, or values preselected on load). Values
   * found in `options` resolve from there first.
   */
  selectedOptions?: ComboboxOption[];
  /**
   * When true, typed text that matches no option offers a create row. Created
   * values not found in `options` or `selectedOptions` display their raw value
   * as the label.
   */
  creatable?: boolean;
  /**
   * Called with the trimmed input when the create row is chosen. When set, the
   * host owns adding the value (`onChange` is not called). When omitted, the
   * input is committed as the value through `onChange`.
   */
  onCreateOption?: (inputValue: string) => void;
  /** Create row label. Default: `Create "{inputValue}"`. */
  formatCreateLabel?: (inputValue: string) => ReactNode;
  className?: string;
  id?: string;
  'aria-label'?: string;
  /** Portal mount node for the menu; defaults to `document.body`. */
  portalContainer?: HTMLElement | null;
  /** Stacking order for the portaled menu. */
  zIndex?: number;
}

const POPUP_MAX_HEIGHT = 280;

const CHIP_SIZE_BY_COMBOBOX: Record<ComboboxSize, ChipSize> = {
  small: 'small',
  medium: 'medium',
  large: 'large',
};

type ComboboxRow =
  | { kind: 'option'; option: ComboboxOption }
  | { kind: 'create'; inputValue: string };

function defaultFormatCreateLabel(inputValue: string): ReactNode {
  return `Create "${inputValue}"`;
}

function isRowDisabled(row: ComboboxRow): boolean {
  return row.kind === 'option' && row.option.disabled === true;
}

function defaultFilter(option: ComboboxOption, query: string): boolean {
  if (!query) return true;
  return option.label.toLowerCase().includes(query.toLowerCase());
}

function toSingleValue(
  value: string | string[] | null | undefined,
): string | null {
  if (value == null) return null;
  if (Array.isArray(value)) return value[0] ?? null;
  return value === '' ? null : value;
}

function toMultiValue(value: string | string[] | null | undefined): string[] {
  if (value == null) return [];
  if (Array.isArray(value)) return value;
  return value === '' ? [] : [value];
}

function optionLeadingVisual(option: ComboboxOption): ReactNode | undefined {
  if (option.leadingVisual != null) return option.leadingVisual;
  if (option.leadingAvatar != null) {
    return (
      <UserAvatar
        src={option.leadingAvatar.src}
        alt={option.leadingAvatar.alt}
        size="24"
      />
    );
  }
  return undefined;
}

/**
 * { value: 'town-square', label: 'Town Square' }, { value: 'off-topic', label: 'Off-Topic'
 * }, { value: 'design', label: 'Design' }, { value: 'engineering', label: 'Engineering' }, {
 * value: 'releases', label: 'Releases' }, ];
 */
const Combobox = forwardRef<HTMLInputElement, ComboboxProps>(function Combobox(
  {
    options,
    multiple = false,
    value: valueProp,
    defaultValue,
    onChange,
    inputValue: inputValueProp,
    defaultInputValue = '',
    onInputChange,
    label,
    placeholder,
    leadingIcon,
    size = 'medium',
    invalid = false,
    disabled = false,
    filter = true,
    emptyMessage = 'No results',
    loading = false,
    loadingMessage = 'Loading…',
    selectedOptions,
    creatable = false,
    onCreateOption,
    formatCreateLabel = defaultFormatCreateLabel,
    className = '',
    id: idProp,
    'aria-label': ariaLabel,
    portalContainer = null,
    zIndex,
  },
  ref,
) {
  const generatedId = useId();
  const id = idProp ?? generatedId;
  const listboxId = `${id}-listbox`;

  const rootRef = useRef<HTMLDivElement>(null);
  const anchorRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const setInputRef = useCallback(
    (node: HTMLInputElement | null) => {
      inputRef.current = node;
      if (typeof ref === 'function') ref(node);
      else if (ref) ref.current = node;
    },
    [ref],
  );

  const isValueControlled = valueProp !== undefined;
  const [uncontrolledValue, setUncontrolledValue] = useState<
    string | string[] | null
  >(() => {
    if (defaultValue !== undefined) return defaultValue;
    return multiple ? [] : null;
  });

  const rawValue = isValueControlled ? valueProp! : uncontrolledValue;
  const singleValue = multiple ? null : toSingleValue(rawValue);
  const multiValue = useMemo(
    () => (multiple ? toMultiValue(rawValue) : []),
    [multiple, rawValue],
  );

  const isInputControlled = inputValueProp !== undefined;
  const [uncontrolledInput, setUncontrolledInput] = useState(defaultInputValue);
  const [isOpen, setIsOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [queryOverride, setQueryOverride] = useState<string | null>(null);

  const resolveOption = useCallback(
    (optionValue: string): ComboboxOption | undefined =>
      options.find((o) => o.value === optionValue) ??
      selectedOptions?.find((o) => o.value === optionValue) ??
      (creatable ? { value: optionValue, label: optionValue } : undefined),
    [options, selectedOptions, creatable],
  );

  const selectedOption = useMemo(
    () => (singleValue == null ? undefined : resolveOption(singleValue)),
    [resolveOption, singleValue],
  );

  // Single-select: show the selected label until the user starts typing a filter.
  // `queryOverride !== null` means the field is in filter-edit mode.
  const displayInput = (() => {
    if (isInputControlled) return inputValueProp!;
    if (multiple) return uncontrolledInput;
    if (queryOverride !== null) return queryOverride;
    return selectedOption?.label ?? uncontrolledInput;
  })();

  const filterQuery = (() => {
    if (isInputControlled) return inputValueProp!;
    if (multiple) return uncontrolledInput;
    if (queryOverride !== null) return queryOverride;
    return '';
  })();

  const setInputDisplay = useCallback(
    (next: string) => {
      if (!isInputControlled) {
        setUncontrolledInput(next);
        if (!multiple) setQueryOverride(next);
      }
      onInputChange?.(next);
    },
    [isInputControlled, multiple, onInputChange],
  );

  const commitValue = useCallback(
    (next: string | string[] | null) => {
      if (!isValueControlled) setUncontrolledValue(next);
      onChange?.(next);
    },
    [isValueControlled, onChange],
  );

  const filteredOptions = useMemo(() => {
    if (filter === false) return options;
    const fn = typeof filter === 'function' ? filter : defaultFilter;
    return options.filter((o) => fn(o, filterQuery));
  }, [options, filter, filterQuery]);

  const createInput = creatable ? filterQuery.trim() : '';
  const showCreateRow = useMemo(() => {
    if (createInput === '') return false;
    const needle = createInput.toLowerCase();
    const matches = (text: string) => text.toLowerCase() === needle;
    const knownOptions = [...options, ...(selectedOptions ?? [])];
    if (knownOptions.some((o) => matches(o.label) || matches(o.value))) {
      return false;
    }
    const current = multiple
      ? multiValue
      : singleValue != null
        ? [singleValue]
        : [];
    return !current.some(matches);
  }, [
    createInput,
    options,
    selectedOptions,
    multiple,
    multiValue,
    singleValue,
  ]);

  const rows = useMemo<ComboboxRow[]>(
    () => [
      ...filteredOptions.map((option) => ({ kind: 'option' as const, option })),
      ...(showCreateRow
        ? [{ kind: 'create' as const, inputValue: createInput }]
        : []),
    ],
    [filteredOptions, showCreateRow, createInput],
  );

  const rowId = useCallback(
    (row: ComboboxRow) =>
      row.kind === 'option'
        ? `${listboxId}-option-${row.option.value}`
        : `${listboxId}-create`,
    [listboxId],
  );

  const { mounted: popupMounted, visible: popupVisible } =
    usePopoverTransition(isOpen);

  const {
    placement,
    maxHeight,
    style: popupStyle,
    portalRef,
    renderPortal,
  } = useAnchoredPopupPortal(anchorRef, popupMounted, {
    preferredHeight: POPUP_MAX_HEIGHT,
    maxHeightCap: POPUP_MAX_HEIGHT,
    portalContainer,
    zIndex,
  });

  const close = useCallback(() => {
    setIsOpen(false);
    setActiveIndex(-1);
    if (!multiple && !isInputControlled) {
      setQueryOverride(null);
      setUncontrolledInput('');
    }
  }, [multiple, isInputControlled]);

  const open = useCallback(() => {
    if (disabled) return;
    setIsOpen(true);
  }, [disabled]);

  useOutsideClose(rootRef, isOpen, close, portalRef);

  useEffect(() => {
    if (!isOpen) return;
    setActiveIndex((prev) => {
      if (rows.length === 0) return -1;
      if (prev >= 0 && prev < rows.length) return prev;
      const selectedIdx = rows.findIndex(
        (row) =>
          row.kind === 'option' &&
          (multiple
            ? multiValue.includes(row.option.value)
            : row.option.value === singleValue),
      );
      return selectedIdx >= 0 ? selectedIdx : 0;
    });
  }, [isOpen, rows, multiple, multiValue, singleValue]);

  const isSelected = useCallback(
    (optionValue: string) =>
      multiple ? multiValue.includes(optionValue) : singleValue === optionValue,
    [multiple, multiValue, singleValue],
  );

  const selectOption = useCallback(
    (option: ComboboxOption) => {
      if (option.disabled) return;

      if (multiple) {
        const next = multiValue.includes(option.value)
          ? multiValue.filter((v) => v !== option.value)
          : [...multiValue, option.value];
        commitValue(next);
        setInputDisplay('');
        close();
        inputRef.current?.focus();
        return;
      }

      commitValue(option.value);
      if (!isInputControlled) {
        setUncontrolledInput('');
        setQueryOverride(null);
      } else {
        onInputChange?.(option.label);
      }
      close();
    },
    [
      multiple,
      multiValue,
      commitValue,
      setInputDisplay,
      isInputControlled,
      onInputChange,
      close,
    ],
  );

  const createValue = useCallback(
    (inputValue: string) => {
      if (onCreateOption) {
        onCreateOption(inputValue);
      } else if (multiple) {
        commitValue([...multiValue, inputValue]);
      } else {
        commitValue(inputValue);
      }

      if (multiple) {
        setInputDisplay('');
        close();
        inputRef.current?.focus();
        return;
      }
      if (!isInputControlled) {
        setUncontrolledInput('');
        setQueryOverride(null);
      } else {
        onInputChange?.(inputValue);
      }
      close();
    },
    [
      onCreateOption,
      multiple,
      multiValue,
      commitValue,
      setInputDisplay,
      isInputControlled,
      onInputChange,
      close,
    ],
  );

  const selectRow = useCallback(
    (row: ComboboxRow) => {
      if (row.kind === 'create') createValue(row.inputValue);
      else selectOption(row.option);
    },
    [createValue, selectOption],
  );

  const removeValue = useCallback(
    (optionValue: string) => {
      if (!multiple) return;
      commitValue(multiValue.filter((v) => v !== optionValue));
    },
    [multiple, multiValue, commitValue],
  );

  const moveActive = useCallback(
    (delta: number) => {
      const enabled = rows
        .map((row, i) => ({ row, i }))
        .filter(({ row }) => !isRowDisabled(row));
      if (enabled.length === 0) {
        setActiveIndex(-1);
        return;
      }
      setActiveIndex((prev) => {
        const currentPos = enabled.findIndex(({ i }) => i === prev);
        const nextPos =
          currentPos < 0
            ? delta > 0
              ? 0
              : enabled.length - 1
            : (currentPos + delta + enabled.length) % enabled.length;
        return enabled[nextPos].i;
      });
    },
    [rows],
  );

  useEffect(() => {
    if (!isOpen || activeIndex < 0) return;
    const row = rows[activeIndex];
    if (!row) return;
    document.getElementById(rowId(row))?.scrollIntoView({ block: 'nearest' });
  }, [isOpen, activeIndex, rows, rowId]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const next = e.target.value;
    setInputDisplay(next);
    if (!isOpen) open();
    setActiveIndex(0);
  };

  const handleFocus = () => {
    setIsFocused(true);
    open();
    // Select-all so the next keystroke replaces the selected label (filter mode).
    if (!multiple && !isInputControlled && selectedOption) {
      requestAnimationFrame(() => {
        inputRef.current?.select();
      });
    }
  };

  const handleBlur = (e: FocusEvent<HTMLInputElement>) => {
    // Delay so option mousedown can run first
    const related = e.relatedTarget as Node | null;
    if (related && rootRef.current?.contains(related)) return;
    setIsFocused(false);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (disabled) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        if (!isOpen) open();
        else moveActive(1);
        break;
      case 'ArrowUp':
        e.preventDefault();
        if (!isOpen) open();
        else moveActive(-1);
        break;
      case 'Home':
        if (isOpen && rows.length > 0) {
          e.preventDefault();
          setActiveIndex(
            Math.max(
              0,
              rows.findIndex((row) => !isRowDisabled(row)),
            ),
          );
        }
        break;
      case 'End':
        if (isOpen && rows.length > 0) {
          e.preventDefault();
          for (let i = rows.length - 1; i >= 0; i--) {
            if (!isRowDisabled(rows[i])) {
              setActiveIndex(i);
              break;
            }
          }
        }
        break;
      case 'Enter':
        if (isOpen && activeIndex >= 0 && rows[activeIndex]) {
          e.preventDefault();
          selectRow(rows[activeIndex]);
        }
        break;
      case 'Escape':
        if (isOpen) {
          e.preventDefault();
          close();
        }
        break;
      case 'Backspace':
        if (multiple && displayInput === '' && multiValue.length > 0) {
          e.preventDefault();
          removeValue(multiValue[multiValue.length - 1]);
        }
        break;
      case 'Tab':
        close();
        break;
      default:
        break;
    }
  };

  const handleWrapperMouseDown = (e: MouseEvent<HTMLDivElement>) => {
    if (disabled) return;
    // Don't steal focus from chips or their remove buttons
    if ((e.target as HTMLElement).closest('[data-chip]')) return;
    if (e.target !== inputRef.current) {
      e.preventDefault();
      inputRef.current?.focus();
    }
    if (!isOpen) open();
  };

  const hasSelection = multiple
    ? multiValue.length > 0
    : singleValue != null && singleValue !== '';
  const hasInputText = displayInput.length > 0;
  const labelFloated = isFocused || isOpen || hasSelection || hasInputText;

  const activeRow = activeIndex >= 0 ? rows[activeIndex] : undefined;
  const activeDescendant = activeRow != null ? rowId(activeRow) : undefined;

  // Without `selectedOptions`, values in `options` keep their list order (the
  // original behavior); with it, chips follow value order so they don't jump
  // around as async results change.
  const chipOptions = useMemo<ComboboxOption[]>(() => {
    if (!multiple) return [];
    if (selectedOptions == null) {
      const fromOptions = options.filter((o) => multiValue.includes(o.value));
      if (!creatable) return fromOptions;
      const listed = new Set(fromOptions.map((o) => o.value));
      return [
        ...fromOptions,
        ...multiValue
          .filter((v) => !listed.has(v))
          .map((v) => ({ value: v, label: v })),
      ];
    }
    return multiValue
      .map(resolveOption)
      .filter((o): o is ComboboxOption => o != null);
  }, [
    multiple,
    selectedOptions,
    options,
    multiValue,
    creatable,
    resolveOption,
  ]);

  const sizeClass = styles[`combobox--size-${toKebab(size)}`];
  const hasChips = multiple && chipOptions.length > 0;
  const rootClass = [
    styles.combobox,
    sizeClass,
    invalid ? styles['combobox--invalid'] : '',
    label != null && labelFloated ? styles['combobox--label-floated'] : '',
    leadingIcon != null ? styles['combobox--has-leading-icon'] : '',
    hasChips ? styles['combobox--has-chips'] : '',
    isOpen ? styles['combobox--open'] : '',
    disabled ? styles['combobox--disabled'] : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={rootClass} ref={rootRef}>
      <div className={styles.combobox__wrapper} ref={anchorRef}>
        {label != null && (
          <label className={styles.combobox__label} htmlFor={id}>
            {label}
          </label>
        )}
        {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions -- pointer convenience; the input owns keyboard interaction */}
        <div
          className={styles.combobox__inner}
          onMouseDown={handleWrapperMouseDown}
        >
          {leadingIcon != null && (
            <span className={styles['combobox__leading-icon']} aria-hidden>
              <IconSlotContext.Provider value={{ size: '16' }}>
                {leadingIcon}
              </IconSlotContext.Provider>
            </span>
          )}
          <div className={styles.combobox__value}>
            {multiple && chipOptions.length > 0 && (
              <ChipGroup
                aria-label={
                  typeof label === 'string' ? `${label} selections` : 'Selected'
                }
                disabled={disabled}
              >
                {chipOptions.map((option) => (
                  <Chip
                    key={option.value}
                    size={CHIP_SIZE_BY_COMBOBOX[size]}
                    leadingAvatar={option.leadingAvatar}
                    leadingIcon={
                      option.leadingAvatar == null
                        ? option.leadingVisual
                        : undefined
                    }
                    onRemove={
                      disabled
                        ? undefined
                        : (ev) => {
                            ev.stopPropagation();
                            removeValue(option.value);
                          }
                    }
                  >
                    {option.label}
                  </Chip>
                ))}
              </ChipGroup>
            )}
            <input
              ref={setInputRef}
              id={id}
              className={styles.combobox__control}
              type="text"
              role="combobox"
              autoComplete="off"
              spellCheck={false}
              disabled={disabled}
              placeholder={
                multiple && chipOptions.length > 0 ? undefined : placeholder
              }
              value={displayInput}
              aria-label={ariaLabel}
              aria-invalid={invalid ? true : undefined}
              aria-expanded={isOpen}
              aria-controls={listboxId}
              aria-autocomplete="list"
              aria-activedescendant={activeDescendant}
              aria-busy={loading || undefined}
              onChange={handleInputChange}
              onFocus={handleFocus}
              onBlur={handleBlur}
              onKeyDown={handleKeyDown}
            />
          </div>
          <span className={styles['combobox__trailing-icon']} aria-hidden>
            <Icon size="12" glyph={<ChevronDownIcon />} />
          </span>
        </div>
      </div>

      {popupMounted &&
        renderPortal(
          <div
            ref={portalRef}
            className={[
              styles.combobox__popup,
              placement === 'above' ? styles['combobox__popup--above'] : '',
              popupVisible ? styles['combobox__popup--visible'] : '',
            ]
              .filter(Boolean)
              .join(' ')}
            style={popupStyle}
          >
            <PopoverMenu className={styles.combobox__menu}>
              <PopoverMenuScroll maxHeight={maxHeight}>
                {rows.length > 0 && (
                  <ul
                    id={listboxId}
                    className={styles.combobox__list}
                    role="listbox"
                    aria-multiselectable={multiple || undefined}
                    aria-label={
                      typeof label === 'string'
                        ? label
                        : (ariaLabel ?? 'Options')
                    }
                  >
                    {rows.map((row, index) => {
                      const active = index === activeIndex;
                      const preventBlur = (ev: MouseEvent) => {
                        // Prevent input blur before click handler
                        ev.preventDefault();
                      };
                      if (row.kind === 'create') {
                        return (
                          <li
                            key={rowId(row)}
                            className={styles.combobox__option}
                            role="presentation"
                          >
                            <MenuItem
                              id={rowId(row)}
                              role="option"
                              label={formatCreateLabel(row.inputValue)}
                              leadingVisual={<Icon glyph={<PlusIcon />} />}
                              active={active}
                              aria-selected={false}
                              onMouseDown={preventBlur}
                              onMouseEnter={() => setActiveIndex(index)}
                              onClick={() => createValue(row.inputValue)}
                            />
                          </li>
                        );
                      }
                      const { option } = row;
                      const selected = isSelected(option.value);
                      const leading = optionLeadingVisual(option);
                      return (
                        <li
                          key={option.value}
                          className={styles.combobox__option}
                          role="presentation"
                        >
                          <MenuItem
                            id={rowId(row)}
                            role="option"
                            label={option.label}
                            secondaryLabel={option.secondaryLabel}
                            leadingElement={leading != null}
                            leadingVisual={leading}
                            trailingElement={selected}
                            active={active}
                            disabled={option.disabled}
                            aria-selected={selected}
                            onMouseDown={preventBlur}
                            onMouseEnter={() => setActiveIndex(index)}
                            onClick={() => selectOption(option)}
                          />
                        </li>
                      );
                    })}
                  </ul>
                )}
                {loading ? (
                  <div className={styles.combobox__loading} role="status">
                    <Spinner size="16" aria-hidden />
                    <span>{loadingMessage}</span>
                  </div>
                ) : (
                  rows.length === 0 && (
                    <p className={styles.combobox__empty}>{emptyMessage}</p>
                  )
                )}
              </PopoverMenuScroll>
            </PopoverMenu>
          </div>,
        )}
    </div>
  );
});

export default Combobox;
