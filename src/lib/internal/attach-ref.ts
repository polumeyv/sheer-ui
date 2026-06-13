import { untrack } from "svelte";
import { createAttachmentKey } from "svelte/attachments";

type RefSetter<T> = (v: T | null) => void;

/**
 * A Svelte attachment that stores the attached element via a setter callback and
 * clears it on teardown — but only once the node is actually disconnected, so a
 * move within the DOM doesn't null the ref. Callback-only; no Box. Spread the
 * result onto the element: `<div {...attachRef((v) => (node = v))}>`.
 */
export function attachRef<T extends EventTarget = Element>(
	set: RefSetter<T>,
	onChange?: (v: T | null) => void
) {
	return {
		[createAttachmentKey()]: (node: T) => {
			set(node);
			untrack(() => onChange?.(node));
			return () => {
				if ("isConnected" in node && (node as unknown as { isConnected: boolean }).isConnected) {
					return;
				}
				set(null);
				onChange?.(null);
			};
		},
	};
}

export type RefAttachment<T extends HTMLElement = HTMLElement> = ReturnType<typeof attachRef<T>>;
