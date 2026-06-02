import type { Attachment } from 'svelte/attachments';

/**
 * Focuses the element when it mounts — a reliable replacement for the native `autofocus` attribute, which is flaky
 * for dynamically-mounted content (dialogs/modals) and warns "Autofocus processing was blocked because a document
 * already has a focused element". Spread onto a component (e.g. `<Input {@attach autofocus} />`), the attachment
 * reaches the underlying element via that component's prop spread.
 */
export const autofocus: Attachment<HTMLElement> = (node) => void node.focus();
