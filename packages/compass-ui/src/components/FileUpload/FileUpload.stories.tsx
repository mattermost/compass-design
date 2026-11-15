import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import FileUpload from './FileUpload';
import type { FileUploadProps } from './FileUpload';
import type { FileUploadRejection } from './validateFiles';

const meta = {
  title: 'Components/Forms and Input/File Upload',
  component: FileUpload,
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'select', options: ['drop-zone', 'button'] },
    messageTone: {
      control: 'select',
      options: ['error', 'warning', 'info', 'success'],
    },
  },
  decorators: [
    (Story) => (
      <div style={{ width: 420 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof FileUpload>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { description: 'PNG or JPG, up to 5 MB' },
};

export const Multiple: Story = {
  args: { multiple: true, accept: 'image/*', maxFiles: 5 },
};

export const ButtonVariant: Story = {
  args: { variant: 'button', browseLabel: 'Upload logo' },
};

export const Invalid: Story = {
  args: { message: 'Only PDF files are accepted.' },
};

export const Loading: Story = { args: { loading: true } };

export const Disabled: Story = { args: { disabled: true } };

function ReportsSelectionDemo(args: FileUploadProps) {
  const [selected, setSelected] = useState<string[]>([]);
  const [rejected, setRejected] = useState<FileUploadRejection[]>([]);
  return (
    <FileUpload
      {...args}
      multiple
      accept="image/*"
      maxSize={1024 * 1024}
      description="Images up to 1 MB"
      onFilesSelected={(files) => {
        setRejected([]);
        setSelected(files.map((f) => f.name));
      }}
      onFilesRejected={setRejected}
      message={
        rejected.length > 0
          ? rejected.map((r) => `${r.file.name}: ${r.reason}`).join('; ')
          : selected.length > 0
            ? `Selected: ${selected.join(', ')}`
            : undefined
      }
      messageTone={rejected.length > 0 ? 'error' : 'info'}
    />
  );
}

export const ReportsSelection: Story = {
  render: (args) => <ReportsSelectionDemo {...args} />,
};
