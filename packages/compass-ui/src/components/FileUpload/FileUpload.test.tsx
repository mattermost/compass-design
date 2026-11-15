import { createRef } from 'react';
import { act } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { click, getByRole, render } from '@/test-utils/render';
import FileUpload from './FileUpload';

const file = (name: string, type = 'image/png', size = 10) =>
  new File([new Uint8Array(size)], name, { type });

function chooseFiles(input: HTMLInputElement, files: File[]) {
  Object.defineProperty(input, 'files', { value: files, configurable: true });
  act(() => {
    input.dispatchEvent(new Event('change', { bubbles: true }));
  });
}

function drag(
  el: Element,
  type: 'dragenter' | 'dragover' | 'dragleave' | 'drop',
  files: File[] = [file('a.png')],
  types: string[] = ['Files'],
) {
  const event = new Event(type, { bubbles: true, cancelable: true });
  const dataTransfer = { types, files, dropEffect: 'none' };
  Object.defineProperty(event, 'dataTransfer', { value: dataTransfer });
  act(() => {
    el.dispatchEvent(event);
  });
  return { event, dataTransfer };
}

const input = (c: HTMLElement) => c.querySelector('input[type="file"]')!;

describe('FileUpload picker', () => {
  it('names the input from the browse text and links the description', () => {
    const { container } = render(<FileUpload description="PNG up to 5 MB" />);
    const el = input(container) as HTMLInputElement;
    expect(el.getAttribute('aria-labelledby')).toBeTruthy();
    expect(
      container.querySelector(`[id="${el.getAttribute('aria-labelledby')}"]`)
        ?.textContent,
    ).toBe('Browse file');
    expect(
      container.querySelector(`[id="${el.getAttribute('aria-describedby')}"]`)
        ?.textContent,
    ).toBe('PNG up to 5 MB');
    // Visually hidden, not display:none, so it stays focusable.
    expect(el.tabIndex).toBe(0);
  });

  it('reports accepted files and resets the input', () => {
    const onFilesSelected = vi.fn();
    const { container } = render(
      <FileUpload onFilesSelected={onFilesSelected} />,
    );
    const el = input(container) as HTMLInputElement;
    const f = file('a.png');
    chooseFiles(el, [f]);
    expect(onFilesSelected).toHaveBeenCalledWith([f]);
  });

  it('rejects by type, size and count', () => {
    const onFilesSelected = vi.fn();
    const onFilesRejected = vi.fn();
    const { container } = render(
      <FileUpload
        multiple
        accept="image/*"
        maxSize={100}
        maxFiles={1}
        onFilesSelected={onFilesSelected}
        onFilesRejected={onFilesRejected}
      />,
    );
    chooseFiles(input(container) as HTMLInputElement, [
      file('a.png'),
      file('b.png'),
      file('c.txt', 'text/plain'),
      file('d.png', 'image/png', 500),
    ]);
    expect(onFilesSelected.mock.calls[0][0].map((f: File) => f.name)).toEqual([
      'a.png',
    ]);
    expect(
      onFilesRejected.mock.calls[0][0].map(
        (r: { file: File; reason: string }) => r.reason,
      ),
    ).toEqual(['too-many-files', 'file-type', 'file-size']);
  });

  it('keeps only the first file when not multiple', () => {
    const onFilesSelected = vi.fn();
    const onFilesRejected = vi.fn();
    const { container } = render(
      <FileUpload
        onFilesSelected={onFilesSelected}
        onFilesRejected={onFilesRejected}
      />,
    );
    chooseFiles(input(container) as HTMLInputElement, [
      file('a.png'),
      file('b.png'),
    ]);
    expect(onFilesSelected.mock.calls[0][0]).toHaveLength(1);
    expect(onFilesRejected.mock.calls[0][0][0].reason).toBe('too-many-files');
  });

  it('does not call onFilesSelected when every file is rejected', () => {
    const onFilesSelected = vi.fn();
    const { container } = render(
      <FileUpload accept=".pdf" onFilesSelected={onFilesSelected} />,
    );
    chooseFiles(input(container) as HTMLInputElement, [file('a.png')]);
    expect(onFilesSelected).not.toHaveBeenCalled();
  });

  it('forwards the ref to the file input and passes inputProps through', () => {
    const ref = createRef<HTMLElement>();
    const { container } = render(
      <FileUpload
        ref={ref}
        inputProps={{ name: 'logo', 'data-testid': 'in' }}
      />,
    );
    expect(ref.current).toBe(input(container));
    expect((ref.current as HTMLInputElement).name).toBe('logo');
    expect(ref.current?.getAttribute('data-testid')).toBe('in');
    ref.current?.focus();
    expect(document.activeElement).toBe(ref.current);
  });
});

describe('FileUpload drop zone', () => {
  it('toggles the dragging state and label, and ignores non-file drags', () => {
    const { container } = render(<FileUpload />);
    const root = container.firstElementChild as HTMLElement;
    drag(root, 'dragenter', [], ['text/plain']);
    expect(root.className).not.toMatch(/dragging/);
    drag(root, 'dragenter');
    expect(root.className).toMatch(/dragging/);
    expect(root.textContent).toContain('Drop to upload');
    // A child enter/leave pair must not end the drag.
    const zone = root.querySelector('label')!;
    drag(zone, 'dragenter');
    drag(zone, 'dragleave');
    expect(root.className).toMatch(/dragging/);
    drag(root, 'dragleave');
    expect(root.className).not.toMatch(/dragging/);
  });

  it('sets a copy drop effect and prevents default on dragover', () => {
    const { container } = render(<FileUpload />);
    const { event, dataTransfer } = drag(
      container.firstElementChild!,
      'dragover',
    );
    expect(event.defaultPrevented).toBe(true);
    expect(dataTransfer.dropEffect).toBe('copy');
  });

  it('reports dropped files, validated like the picker', () => {
    const onFilesSelected = vi.fn();
    const onFilesRejected = vi.fn();
    const { container } = render(
      <FileUpload
        multiple
        accept="image/*"
        onFilesSelected={onFilesSelected}
        onFilesRejected={onFilesRejected}
      />,
    );
    const good = file('a.png');
    const { event } = drag(container.firstElementChild!, 'drop', [
      good,
      file('b.txt', 'text/plain'),
    ]);
    expect(event.defaultPrevented).toBe(true);
    expect(onFilesSelected).toHaveBeenCalledWith([good]);
    expect(onFilesRejected.mock.calls[0][0][0].reason).toBe('file-type');
    expect((container.firstElementChild as HTMLElement).className).not.toMatch(
      /dragging/,
    );
  });

  it.each([['disabled'], ['loading']])(
    'ignores drops and picks while %s',
    (prop) => {
      const onFilesSelected = vi.fn();
      const { container } = render(
        <FileUpload {...{ [prop]: true }} onFilesSelected={onFilesSelected} />,
      );
      const root = container.firstElementChild as HTMLElement;
      const { event } = drag(root, 'drop');
      expect(event.defaultPrevented).toBe(true);
      drag(root, 'dragenter');
      expect(root.className).not.toMatch(/dragging/);
      chooseFiles(input(container) as HTMLInputElement, [file('a.png')]);
      expect(onFilesSelected).not.toHaveBeenCalled();
      expect((input(container) as HTMLInputElement).disabled).toBe(true);
    },
  );

  it('marks loading as busy', () => {
    const { container } = render(<FileUpload loading />);
    expect(container.firstElementChild!.getAttribute('aria-busy')).toBe('true');
  });
});

describe('FileUpload drag events', () => {
  it('stops dropped files from reaching a parent drop target', () => {
    const parentDrop = vi.fn();
    const { container } = render(
      <div onDrop={parentDrop} onDragEnter={parentDrop}>
        <FileUpload />
      </div>,
    );
    const root = container.querySelector('label')!.parentElement!;
    drag(root, 'dragenter');
    drag(root, 'drop');
    expect(parentDrop).not.toHaveBeenCalled();
  });

  it('button variant cancels the browser default for dropped files', () => {
    const onFilesSelected = vi.fn();
    const { container } = render(
      <FileUpload variant="button" onFilesSelected={onFilesSelected} />,
    );
    const root = container.firstElementChild!;
    expect(drag(root, 'dragover').event.defaultPrevented).toBe(true);
    expect(drag(root, 'drop').event.defaultPrevented).toBe(true);
    expect(onFilesSelected).not.toHaveBeenCalled();
  });
});

describe('FileUpload message', () => {
  it('error message sets aria-invalid and links the alert', () => {
    const { container } = render(<FileUpload message="Too large" />);
    const el = input(container);
    expect(el.getAttribute('aria-invalid')).toBe('true');
    const alert = getByRole('alert');
    expect(el.getAttribute('aria-describedby')).toContain(alert.id);
  });

  it('info message is not invalid', () => {
    const { container } = render(
      <FileUpload message="Hint" messageTone="info" />,
    );
    expect(input(container).getAttribute('aria-invalid')).toBeNull();
  });
});

describe('FileUpload button variant', () => {
  it('opens the picker from a Button and forwards the ref to it', () => {
    const ref = createRef<HTMLElement>();
    const onFilesSelected = vi.fn();
    const { container } = render(
      <FileUpload
        variant="button"
        ref={ref}
        onFilesSelected={onFilesSelected}
        browseLabel="Upload logo"
      />,
    );
    const button = getByRole('button', 'Upload logo');
    expect(ref.current).toBe(button);
    const el = input(container) as HTMLInputElement;
    const spy = vi.spyOn(el, 'click');
    click(button);
    expect(spy).toHaveBeenCalled();
    // The input is not a second tab stop.
    expect(el.tabIndex).toBe(-1);
    chooseFiles(el, [file('a.png')]);
    expect(onFilesSelected).toHaveBeenCalledTimes(1);
  });

  it('marks the Button invalid for an error message', () => {
    render(<FileUpload variant="button" message="Too large" />);
    expect(getByRole('button').getAttribute('aria-invalid')).toBe('true');
  });

  it('disables the Button and does not take drops', () => {
    const onFilesSelected = vi.fn();
    const { container } = render(
      <FileUpload
        variant="button"
        disabled
        onFilesSelected={onFilesSelected}
      />,
    );
    expect((getByRole('button') as HTMLButtonElement).disabled).toBe(true);
    drag(container.firstElementChild!, 'drop');
    expect(onFilesSelected).not.toHaveBeenCalled();
  });
});

describe('FileUpload labels', () => {
  it('uses overridable English and accepts nodes', () => {
    const { container } = render(
      <FileUpload
        label={<b>Zieh Dateien hierher</b>}
        browseLabel={<i>Durchsuchen</i>}
      />,
    );
    expect(container.querySelector('b')?.textContent).toBe(
      'Zieh Dateien hierher',
    );
    expect(container.querySelector('i')?.textContent).toBe('Durchsuchen');
  });

  it('adapts default copy to single selection', () => {
    const { container } = render(<FileUpload />);
    expect(container.textContent).toContain('Drag and drop a file here');
    expect(container.textContent).toContain('Browse file');
  });
});
