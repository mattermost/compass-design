import type { Meta, StoryObj } from '@storybook/react';
import { useEffect, useState, type ReactNode } from 'react';
import GlobeIcon from '@mattermost/compass-icons/components/globe';
import avatarEmma from '@/assets/avatars/Emma Novak.png';
import avatarArjun from '@/assets/avatars/Arjun Patel.png';
import avatarSofia from '@/assets/avatars/Sofia Bauer.png';
import Combobox from './Combobox';
import type { ComboboxOption, ComboboxProps, ComboboxSize } from './Combobox';
import Icon from '../Icon/Icon';
import UserAvatar from '../UserAvatar/UserAvatar';
import {
  ICON_NONE,
  iconSelectArgType,
  resolveStoryIcon,
} from '../../storybook/icons';

const SIZES: ComboboxSize[] = ['small', 'medium', 'large'];

const CHANNEL_OPTIONS: ComboboxOption[] = [
  { value: 'town-square', label: 'Town Square' },
  { value: 'off-topic', label: 'Off-Topic' },
  { value: 'design', label: 'Design' },
  { value: 'engineering', label: 'Engineering' },
  { value: 'releases', label: 'Releases' },
];

const PEOPLE_OPTIONS: ComboboxOption[] = [
  {
    value: 'emma',
    label: 'Emma Novak',
    secondaryLabel: '@emma',
    leadingAvatar: { src: avatarEmma, alt: 'Emma Novak' },
    leadingVisual: <UserAvatar src={avatarEmma} alt="Emma Novak" size="24" />,
  },
  {
    value: 'arjun',
    label: 'Arjun Patel',
    secondaryLabel: '@arjun',
    leadingAvatar: { src: avatarArjun, alt: 'Arjun Patel' },
    leadingVisual: <UserAvatar src={avatarArjun} alt="Arjun Patel" size="24" />,
  },
  {
    value: 'sofia',
    label: 'Sofia Bauer',
    secondaryLabel: '@sofia',
    leadingAvatar: { src: avatarSofia, alt: 'Sofia Bauer' },
    leadingVisual: <UserAvatar src={avatarSofia} alt="Sofia Bauer" size="24" />,
  },
];

type ComboboxStoryArgs = Omit<ComboboxProps, 'leadingIcon'> & {
  leadingIcon?: string;
};

const meta = {
  title: 'Components/Forms and Input/Combobox',
  component: Combobox,
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'select', options: SIZES },
    leadingIcon: iconSelectArgType({ optional: true }),
  },
  args: {
    leadingIcon: ICON_NONE,
  },
  render: ({ leadingIcon: leadingIcon, ...rest }) => (
    <Combobox
      {...rest}
      leadingIcon={
        resolveStoryIcon(leadingIcon, { wrapSize: '16' }) as ReactNode
      }
    />
  ),
} satisfies Meta<ComboboxStoryArgs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: 'Channel',
    placeholder: 'Search channels…',
    options: CHANNEL_OPTIONS,
    size: 'medium',
  },
};

export const WithValue: Story = {
  args: {
    label: 'Channel',
    defaultValue: 'design',
    options: CHANNEL_OPTIONS,
  },
};

export const WithLeadingIcon: Story = {
  args: {
    label: 'Channel',
    leadingIcon: 'globe',
    options: CHANNEL_OPTIONS,
  },
};

export const MultiSelect: Story = {
  render: function MultiSelectStory() {
    const [value, setValue] = useState<string[]>(['emma']);
    return (
      <div style={{ maxWidth: 360 }}>
        <Combobox
          label="Invite people"
          placeholder="Search people…"
          multiple
          options={PEOPLE_OPTIONS}
          value={value}
          onChange={(next) => setValue((next as string[]) ?? [])}
        />
      </div>
    );
  },
};

function searchPeople(query: string): Promise<ComboboxOption[]> {
  const q = query.trim().toLowerCase();
  return new Promise((resolve) => {
    setTimeout(
      () =>
        resolve(
          PEOPLE_OPTIONS.filter(
            (person) =>
              q === '' ||
              person.label.toLowerCase().includes(q) ||
              person.secondaryLabel?.includes(q),
          ),
        ),
      600,
    );
  });
}

/** Server-side search: the host fetches on input, owns `selectedOptions`, and turns off client filtering. */
export const AsyncMultiSelect: Story = {
  render: function AsyncMultiSelectStory() {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<ComboboxOption[]>([]);
    const [loading, setLoading] = useState(false);
    const [selected, setSelected] = useState<ComboboxOption[]>([
      PEOPLE_OPTIONS[0],
    ]);

    useEffect(() => {
      let cancelled = false;
      setLoading(true);
      searchPeople(query).then((next) => {
        if (cancelled) return;
        setResults(next);
        setLoading(false);
      });
      return () => {
        cancelled = true;
      };
    }, [query]);

    return (
      <div style={{ maxWidth: 360 }}>
        <Combobox
          label="Allowed users"
          placeholder="Search people…"
          multiple
          filter={false}
          loading={loading}
          options={results}
          inputValue={query}
          onInputChange={setQuery}
          value={selected.map((option) => option.value)}
          selectedOptions={selected}
          onChange={(next) => {
            const values = (next as string[]) ?? [];
            const known = [...selected, ...results];
            setSelected(
              values
                .map((value) => known.find((option) => option.value === value))
                .filter((option): option is ComboboxOption => option != null),
            );
          }}
        />
      </div>
    );
  },
};

export const Loading: Story = {
  args: {
    label: 'Allowed users',
    placeholder: 'Search people…',
    options: [],
    loading: true,
  },
};

const MODEL_OPTIONS: ComboboxOption[] = [
  { value: 'gpt-4o', label: 'gpt-4o' },
  { value: 'gpt-4o-mini', label: 'gpt-4o-mini' },
  { value: 'claude-sonnet-4', label: 'claude-sonnet-4' },
];

/** Type a name that isn't listed and pick the create row (or press Enter) to use it. */
export const Creatable: Story = {
  render: function CreatableStory() {
    const [value, setValue] = useState<string | null>('my-fine-tune');
    return (
      <div style={{ maxWidth: 320 }}>
        <Combobox
          label="Model"
          placeholder="Pick or type a model name…"
          creatable
          options={MODEL_OPTIONS}
          value={value}
          onChange={(next) => setValue(next as string | null)}
        />
      </div>
    );
  },
};

/** An empty value means "use the service default"; the clear button resets to it. */
export const Clearable: Story = {
  render: function ClearableStory() {
    const [value, setValue] = useState<string | null>('claude-sonnet-4');
    return (
      <div style={{ maxWidth: 320 }}>
        <Combobox
          label="Default model"
          placeholder="Use the service default"
          clearable
          options={MODEL_OPTIONS}
          value={value}
          onChange={(next) => setValue(next as string | null)}
        />
      </div>
    );
  },
};

export const CreatableMultiSelect: Story = {
  render: function CreatableMultiSelectStory() {
    const [value, setValue] = useState<string[]>(['gpt-4o', 'my-fine-tune']);
    return (
      <div style={{ maxWidth: 360 }}>
        <Combobox
          label="Allowed models"
          placeholder="Add models…"
          multiple
          creatable
          formatCreateLabel={(input) => `Add "${input}"`}
          options={MODEL_OPTIONS}
          value={value}
          onChange={(next) => setValue((next as string[]) ?? [])}
        />
      </div>
    );
  },
};

export const Invalid: Story = {
  args: {
    label: 'Channel',
    invalid: true,
    defaultValue: 'design',
    options: CHANNEL_OPTIONS,
  },
};

export const Disabled: Story = {
  args: {
    label: 'Channel',
    disabled: true,
    defaultValue: 'design',
    options: CHANNEL_OPTIONS,
  },
};

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 20, maxWidth: 360 }}>
      {SIZES.map((size) => (
        <Combobox
          key={size}
          size={size}
          label={size}
          options={CHANNEL_OPTIONS}
        />
      ))}
      <Combobox
        label="Invalid"
        invalid
        defaultValue="design"
        options={CHANNEL_OPTIONS}
      />
      <Combobox
        label="Disabled"
        disabled
        defaultValue="design"
        options={CHANNEL_OPTIONS}
      />
      <Combobox
        label="With icon"
        leadingIcon={<Icon glyph={<GlobeIcon />} />}
        options={CHANNEL_OPTIONS}
      />
    </div>
  ),
};

const MANY_CHANNELS: ComboboxOption[] = Array.from({ length: 20 }, (_, i) => ({
  value: `ch-${i}`,
  label: `Channel ${i + 1}`,
}));

export const PlacementNearBottom: Story = {
  render: () => (
    <div
      style={{
        minHeight: '120vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        padding: 24,
        boxSizing: 'border-box',
      }}
    >
      <div style={{ maxWidth: 320 }}>
        <Combobox
          label="Near bottom of viewport"
          options={MANY_CHANNELS}
          placeholder="Opens above…"
        />
      </div>
    </div>
  ),
};

export const InsideOverflowClip: Story = {
  render: () => (
    <div
      style={{
        height: 180,
        overflow: 'hidden',
        border: '1px solid rgba(var(--center-channel-color-rgb), 0.16)',
        borderRadius: 8,
        padding: 16,
        maxWidth: 360,
      }}
    >
      <p
        style={{
          margin: '0 0 12px',
          fontSize: 12,
          color: 'var(--center-channel-color)',
        }}
      >
        Overflow hidden — menu portals out and stays visible.
      </p>
      <Combobox
        label="Clipped container"
        options={MANY_CHANNELS}
        placeholder="Search…"
      />
    </div>
  ),
};
