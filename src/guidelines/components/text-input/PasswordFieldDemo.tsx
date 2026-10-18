import { useState } from 'react';
import EyeOffOutlineIcon from '@mattermost/compass-icons/components/eye-off-outline';
import EyeOutlineIcon from '@mattermost/compass-icons/components/eye-outline';
import { Icon } from '@mattermost/compass-ui/components/icon';
import { TextInput } from '@mattermost/compass-ui/components/text-input';
import type { ComponentProps } from 'react';

type TextInputSize = NonNullable<ComponentProps<typeof TextInput>['size']>;

/**
 * Demo: TextInput `type="password"` with in-field show/hide via `trailingIcon`.
 * Icon size comes from Text Input; wrap Icon in a transparent button for the toggle.
 */
export default function PasswordFieldDemo({
  size = 'medium',
  label = 'Password',
}: {
  size?: TextInputSize;
  label?: string;
}) {
  const [visible, setVisible] = useState(false);
  const [value, setValue] = useState('secret-value');

  return (
    <TextInput
      size={size}
      label={label}
      type={visible ? 'text' : 'password'}
      value={value}
      onChange={(e) => setValue(e.target.value)}
      trailingIcon={
        <button
          type="button"
          aria-label={visible ? 'Hide password' : 'Show password'}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setVisible((v) => !v);
          }}
          onMouseDown={(e) => e.preventDefault()}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: 0,
            padding: 0,
            border: 0,
            background: 'transparent',
            cursor: 'pointer',
            color: 'inherit',
          }}
        >
          <Icon glyph={visible ? <EyeOffOutlineIcon /> : <EyeOutlineIcon />} />
        </button>
      }
    />
  );
}
