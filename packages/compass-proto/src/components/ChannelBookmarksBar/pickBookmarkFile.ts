/**
 * Opens the operating system's file dialog and resolves with the chosen file,
 * or `null` when the dialog is dismissed. Call it synchronously from the click
 * that chose "Attach a file" (browsers only allow the dialog from a user
 * gesture), then open `ChannelBookmarkModal` with the file.
 */
export default function pickBookmarkFile(): Promise<File | null> {
  return new Promise((resolve) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.hidden = true;
    const done = (file: File | null) => {
      input.remove();
      resolve(file);
    };
    input.addEventListener('change', () => done(input.files?.[0] ?? null));
    input.addEventListener('cancel', () => done(null));
    document.body.appendChild(input);
    input.click();
  });
}
