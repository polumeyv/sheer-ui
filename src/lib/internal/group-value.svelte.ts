import { untrack } from 'svelte';
import type { ReadableBox, WritableBox } from './tools/index.js';

interface GroupValue {
	opts: { value: WritableBox<string[]> };
}

interface GroupItem {
	value: ReadableBox<string | undefined>;
	checked: WritableBox<boolean>;
}

/**
 * Writes the item's checked state into the group's value array and returns a reader for
 * the reverse direction: whether the group holds the item's value, or undefined when the
 * item is outside a group or has no value. The component repairs its own `checked` bindable
 * from that reader, so a parent-driven change never fires the item's onCheckedChange.
 */
export function joinGroup(group: GroupValue | null, item: GroupItem): () => boolean | undefined {
	if (!group) return () => undefined;

	// $effect.pre runs synchronously on creation, before the component has repaired
	// `checked` from the group, so the first run only subscribes: at mount the group wins.
	let mounted = false;
	$effect.pre(() => {
		const checked = item.checked.current;
		if (!mounted) {
			mounted = true;
			return;
		}
		untrack(() => {
			const value = item.value.current;
			const values = group.opts.value.current;
			if (!value || checked === values.includes(value)) return;
			group.opts.value.current = checked ? [...values, value] : values.filter((v) => v !== value);
		});
	});

	return () => {
		const value = item.value.current;
		return value ? group.opts.value.current.includes(value) : undefined;
	};
}
