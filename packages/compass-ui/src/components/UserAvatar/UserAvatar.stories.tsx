import type { Meta, StoryObj } from '@storybook/react';
import type { ReactNode } from 'react';
import avatarAikoTan from '@/assets/avatars/Aiko Tan.png';
import avatarArjunPatel from '@/assets/avatars/Arjun Patel.png';
import avatarDariusCole from '@/assets/avatars/Darius Cole.png';
import avatarDavidLiang from '@/assets/avatars/David Liang.png';
import avatarEmmaNovak from '@/assets/avatars/Emma Novak.png';
import avatarEthanBrooks from '@/assets/avatars/Ethan Brooks.png';
import avatarIsabellaCruz from '@/assets/avatars/Isabella Cruz.png';
import avatarLeilaHaddad from '@/assets/avatars/Leila Haddad.png';
import avatarLeonardRiley from '@/assets/avatars/Leonard Riley.png';
import avatarLukasMeyer from '@/assets/avatars/Lukas Meyer.png';
import avatarMarcoRinaldi from '@/assets/avatars/Marco Rinaldi.png';
import avatarMatty from '@/assets/avatars/Matty.png';
import avatarSofiaBauer from '@/assets/avatars/Sofia Bauer.png';
import UserAvatar from './UserAvatar';
import type { UserAvatarFallbackColor, UserAvatarSize } from './UserAvatar';

/** Sentinel the `src` control maps "Custom URL" to; resolved by `resolveSrc`. */
const CUSTOM_URL = '__custom-url__';

/** Resolves the `src` control, using the `customSrc` text when "Custom URL" is picked. */
function resolveSrc(args: { src?: string }): string | undefined {
  const { customSrc } = args as { customSrc?: string };
  return args.src === CUSTOM_URL ? customSrc || undefined : args.src;
}

/** Image choices for the `src` control; the key is shown in Controls. */
const AVATARS: Record<string, string> = {
  'Aiko Tan': avatarAikoTan,
  'Arjun Patel': avatarArjunPatel,
  'Darius Cole': avatarDariusCole,
  'David Liang': avatarDavidLiang,
  'Emma Novak': avatarEmmaNovak,
  'Ethan Brooks': avatarEthanBrooks,
  'Isabella Cruz': avatarIsabellaCruz,
  'Leila Haddad': avatarLeilaHaddad,
  'Leonard Riley': avatarLeonardRiley,
  'Lukas Meyer': avatarLukasMeyer,
  'Marco Rinaldi': avatarMarcoRinaldi,
  'Matty': avatarMatty,
  'Sofia Bauer': avatarSofiaBauer,
};

/** Every Figma User Avatar size. */
const IMAGE_SIZES: UserAvatarSize[] = [
  '12',
  '16',
  '20',
  '24',
  '28',
  '32',
  '36',
  '40',
  '48',
  '50',
  '56',
  '64',
  '72',
  '80',
  '96',
  '120',
  '128',
];
/** Sizes that can show a badge (the guideline says not to below 20px). */
const STATUS_SIZES: UserAvatarSize[] = [
  '20',
  '24',
  '28',
  '32',
  '36',
  '40',
  '48',
  '50',
  '56',
  '64',
  '72',
  '80',
  '96',
  '120',
  '128',
];
const STATUSES = ['online', 'away', 'do-not-disturb', 'offline'] as const;
const FALLBACK_COLORS: UserAvatarFallbackColor[] = [
  'red',
  'purple',
  'neutral',
  'blue',
  'cyan',
  'yellow',
  'green',
  'orange',
];

const labelStyle = {
  width: '100%',
  fontSize: 12,
  color: 'var(--center-channel-color)',
  marginBottom: 8,
} as const;

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div style={{ display: 'grid', gap: 8 }}>
      <span style={labelStyle}>{label}</span>
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 16,
          alignItems: 'center',
        }}
      >
        {children}
      </div>
    </div>
  );
}

const meta = {
  title: 'Components/Images and Icons/User Avatar',
  component: UserAvatar,
  tags: ['autodocs'],
  argTypes: {
    src: {
      control: 'select',
      options: Object.keys(AVATARS),
      mapping: AVATARS,
      description: 'Avatar image. Pick "Custom URL" to use `customSrc`.',
    },
    customSrc: {
      control: 'text',
      description: 'Image URL or path used when `src` is "Custom URL".',
    },
    size: { control: 'select', options: IMAGE_SIZES },
    status: {
      control: 'select',
      options: [undefined, ...STATUSES],
      description:
        'Status badge. Omit for none. `true` (legacy) also means online.',
    },
    fallbackColor: { control: 'select', options: FALLBACK_COLORS },
  },
  args: { src: 'Sofia Bauer' },
  render: (args) => {
    const { customSrc: _customSrc, ...props } = args as typeof args & {
      customSrc?: string;
    };
    return <UserAvatar {...props} src={resolveSrc(args)} />;
  },
} satisfies Meta<typeof UserAvatar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    alt: 'Marco Rinaldi',
    size: '48',
  },
};

export const WithStatus: Story = {
  parameters: { controls: { include: ['src', 'customSrc'] } },
  render: (args) => (
    <div style={{ display: 'grid', gap: 16 }}>
      {STATUSES.map((status) => (
        <div
          key={status}
          style={{ display: 'flex', gap: 16, alignItems: 'end' }}
        >
          {STATUS_SIZES.map((size) => (
            <div
              key={size}
              style={{
                display: 'grid',
                gap: 8,
                justifyItems: 'center',
                color: 'var(--center-channel-color)',
                fontSize: 12,
              }}
            >
              <UserAvatar
                alt="Sofia Bauer"
                src={resolveSrc(args)}
                size={size}
                status={status}
              />
              <span>{size}</span>
            </div>
          ))}
        </div>
      ))}
    </div>
  ),
};

export const ImageSizes: Story = {
  parameters: { controls: { include: ['src', 'customSrc'] } },
  render: (args) => (
    <div
      style={{ display: 'flex', flexWrap: 'wrap', gap: 16, alignItems: 'end' }}
    >
      {IMAGE_SIZES.map((size) => (
        <div
          key={size}
          style={{
            display: 'grid',
            gap: 8,
            justifyItems: 'center',
            color: 'var(--center-channel-color)',
            fontSize: 12,
          }}
        >
          <UserAvatar alt="Leonard Riley" src={resolveSrc(args)} size={size} />
          <span>{size}</span>
        </div>
      ))}
    </div>
  ),
};

export const Fallback: Story = {
  args: {
    src: undefined,
    alt: 'Danielle Okoro',
    name: 'Danielle Okoro',
  },
  parameters: { controls: { include: ['name', 'fallbackColor'] } },
  render: ({ name, fallbackColor }) => (
    <div
      style={{ display: 'flex', flexWrap: 'wrap', gap: 16, alignItems: 'end' }}
    >
      {IMAGE_SIZES.map((size) => (
        <div
          key={size}
          style={{
            display: 'grid',
            gap: 8,
            justifyItems: 'center',
            color: 'var(--center-channel-color)',
            fontSize: 12,
          }}
        >
          <UserAvatar
            alt={name ?? 'Danielle Okoro'}
            name={name}
            fallbackColor={fallbackColor}
            size={size}
          />
          <span>{size}</span>
        </div>
      ))}
    </div>
  ),
};

export const FallbackColors: Story = {
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
      {FALLBACK_COLORS.map((fallbackColor) => (
        <UserAvatar
          key={fallbackColor}
          alt="Sample User"
          name="Sample User"
          fallbackColor={fallbackColor}
          size="40"
        />
      ))}
    </div>
  ),
};

export const AllVariants: Story = {
  parameters: { controls: { include: ['src', 'customSrc'] } },
  render: (args) => (
    <div style={{ display: 'grid', gap: 24 }}>
      <Row label="Image">
        {IMAGE_SIZES.map((size) => (
          <UserAvatar
            key={size}
            alt="Leonard Riley"
            src={resolveSrc(args)}
            size={size}
          />
        ))}
      </Row>
      <Row label="Image with status">
        {STATUS_SIZES.map((size) => (
          <UserAvatar
            key={size}
            alt="Sofia Bauer"
            src={resolveSrc(args)}
            size={size}
            status="online"
          />
        ))}
      </Row>
      <Row label="Fallback">
        {IMAGE_SIZES.map((size) => (
          <UserAvatar
            key={size}
            alt="Danielle Okoro"
            name="Danielle Okoro"
            size={size}
          />
        ))}
      </Row>
      <Row label="Fallback with status">
        {STATUS_SIZES.map((size) => (
          <UserAvatar
            key={size}
            alt="Danielle Okoro"
            name="Danielle Okoro"
            size={size}
            status="online"
          />
        ))}
      </Row>
      <Row label="Fallback colors">
        {FALLBACK_COLORS.map((fallbackColor) => (
          <UserAvatar
            key={fallbackColor}
            alt="Sample User"
            name="Sample User"
            fallbackColor={fallbackColor}
            size="40"
          />
        ))}
      </Row>
    </div>
  ),
};
