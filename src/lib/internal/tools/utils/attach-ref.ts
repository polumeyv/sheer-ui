import { untrack } from 'svelte';
import { createAttachmentKey, type Attachment } from 'svelte/attachments';

export type RefSetter<T> = (value: T) => void;
export type WritableRef<T> = { current: T };
export type RefAttachment<T extends EventTarget = Element> = {
	[key: symbol]: Attachment<T>;
};

const shouldClearRef = (node: EventTarget) => !('isConnected' in node && node.isConnected === true);

/**
 * Creates a Svelte Attachment that attaches a DOM element to a ref.
 * The ref can be either a writable ref object or a callback function.
 *
 * @param ref - Either a writable ref object to store the element in, or a callback function that receives the element
 * @param onChange - Optional callback that fires when the ref changes
 * @returns An object with a spreadable attachment key that should be spread onto the element
 *
 * @example
 * // Using with a writable ref object
 * const ref = box<HTMLDivElement | null>(null);
 * <div {...attachRef(ref)}>Content</div>
 *
 * @example
 * // Using with callback
 * <div {...attachRef((node) => myNode = node)}>Content</div>
 *
 * @example
 * // Using with onChange
 * <div {...attachRef(ref, (node) => console.log(node))}>Content</div>
 */
export function attachRef<T extends EventTarget = Element>(
	ref: WritableRef<T | null> | RefSetter<T | null>,
	onChange?: (value: T | null) => void,
): RefAttachment<T> {
	return {
		[createAttachmentKey()]: (node) => {
			if (typeof ref === 'function') {
				ref(node);
				untrack(() => onChange?.(node));

				return () => {
					if (!shouldClearRef(node)) return;

					ref(null);
					onChange?.(null);
				};
			}

			ref.current = node;
			untrack(() => onChange?.(node));

			return () => {
				if (!shouldClearRef(node)) return;

				ref.current = null;
				onChange?.(null);
			};
		},
	};
}

export function mountedAttachment<T extends EventTarget = Element>(setMounted: (mounted: boolean) => void): RefAttachment<T> {
	return {
		[createAttachmentKey()]: () => {
			setMounted(true);

			return () => {
				setMounted(false);
			};
		},
	};
}
