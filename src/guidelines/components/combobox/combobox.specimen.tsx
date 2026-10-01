import { useEffect, useState } from 'react';
import GlobeIcon from '@mattermost/compass-icons/components/globe';
import avatarEmma from '@/assets/avatars/Emma Novak.png';
import avatarArjun from '@/assets/avatars/Arjun Patel.png';
import avatarSofia from '@/assets/avatars/Sofia Bauer.png';
import { Combobox } from '@mattermost/compass-ui/components/combobox';
import { Icon } from '@mattermost/compass-ui/components/icon';
import { UserAvatar } from '@mattermost/compass-ui/components/user-avatar';
import type { ComboboxOption } from '@mattermost/compass-ui/components/combobox';
import styles from '@/styles/library-demo/components.module.scss';

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

function MultiPeopleCombobox() {
  const [value, setValue] = useState<string[]>(['emma', 'arjun']);
  return (
    <Combobox
      label="Invite people"
      placeholder="Search people…"
      multiple
      options={PEOPLE_OPTIONS}
      value={value}
      onChange={(next: string | string[] | null) =>
        setValue((next as string[]) ?? [])
      }
    />
  );
}

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

function AsyncPeopleCombobox() {
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
  );
}

const MODEL_OPTIONS: ComboboxOption[] = [
  { value: 'gpt-4o', label: 'gpt-4o' },
  { value: 'gpt-4o-mini', label: 'gpt-4o-mini' },
  { value: 'claude-sonnet-4', label: 'claude-sonnet-4' },
];

function CreatableModelCombobox() {
  const [value, setValue] = useState<string | null>('my-fine-tune');
  return (
    <Combobox
      label="Model"
      placeholder="Pick or type a model name…"
      creatable
      options={MODEL_OPTIONS}
      value={value}
      onChange={(next) => setValue(next as string | null)}
    />
  );
}

export default function ComboboxLibrary() {
  return (
    <>
      <div className={styles['components__button-block']}>
        <div className={styles['components__button-row']}>
          <span className={styles['components__instance-label']}>Sizes</span>
          <Combobox size="small" label="small" options={CHANNEL_OPTIONS} />
          <Combobox size="medium" label="medium" options={CHANNEL_OPTIONS} />
          <Combobox size="large" label="large" options={CHANNEL_OPTIONS} />
        </div>
        <div className={styles['components__button-row']}>
          <span className={styles['components__instance-label']}>Single</span>
          <Combobox
            label="Channel"
            placeholder="Search channels…"
            defaultValue="design"
            leadingIcon={<Icon glyph={<GlobeIcon />} size="16" />}
            options={CHANNEL_OPTIONS}
          />
        </div>
        <div className={styles['components__button-row']}>
          <span className={styles['components__instance-label']}>Multi</span>
          <MultiPeopleCombobox />
        </div>
        <div className={styles['components__button-row']}>
          <span className={styles['components__instance-label']}>Async</span>
          <AsyncPeopleCombobox />
        </div>
        <div className={styles['components__button-row']}>
          <span className={styles['components__instance-label']}>
            Creatable
          </span>
          <CreatableModelCombobox />
        </div>
        <div className={styles['components__button-row']}>
          <span className={styles['components__instance-label']}>States</span>
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
          <Combobox label="Loading" loading options={[]} />
        </div>
      </div>
    </>
  );
}
