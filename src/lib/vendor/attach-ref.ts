import { untrack } from 'svelte';
import { createAttachmentKey } from 'svelte/attachments';
import type { WritableProp } from './utils';

type RefSetter<T> = (v: T) => void;

/**
 * Creates a Svelte Attachment that attaches a DOM element to a ref.
 * The ref can be either a writable `{ current }` accessor or a callback function.
 *
 * @param ref - Either an accessor to store the element in, or a callback that receives the element
 * @param onChange - Optional callback that fires when the ref changes
 * @returns An object with a spreadable attachment key that should be spread onto the element
 *
 * @example
 * // Using with an accessor
 * <div {...attachRef({ get current() { return node }, set current(v) { node = v } })}>Content</div>
 *
 * @example
 * // Using with a callback
 * <div {...attachRef((node) => myNode = node)}>Content</div>
 */
export function attachRef<T extends EventTarget = Element>(
	ref: WritableProp<T | null> | RefSetter<T | null>,
	onChange?: (v: T | null) => void,
) {
	return {
		[createAttachmentKey()]: (node: T) => {
			if (typeof ref !== 'function') {
				ref.current = node;
				untrack(() => onChange?.(node));
				return () => {
					// we don't want to detach the node if it's still connected
					if ('isConnected' in node && node.isConnected) return;
					ref.current = null;
					onChange?.(null);
				};
			}
			ref(node);
			untrack(() => onChange?.(node));
			return () => {
				// we don't want to detach the node if it's still connected
				if ('isConnected' in node && node.isConnected) return;
				ref(null);
				onChange?.(null);
			};
		},
	};
}

export type RefAttachment<T extends HTMLElement = HTMLElement> = ReturnType<typeof attachRef<T>>;
