import { untrack } from 'svelte';

/** The group's bindable value, as an accessor on the group's options. */
interface GroupValue {
	value: string[];
}

/** The item's `value` and `checked` as accessors over its props. */
interface GroupItem {
	readonly value: string | undefined;
	readonly checked: boolean;
}

/**
 * Writes the item's checked state into the group's value array and returns a reader for
 * the reverse direction: whether the group holds the item's value, or undefined when the
 * item is outside a group or has no value. The component repairs its own `checked` bindable
 * from that reader, so a parent-driven change never fires the item's onCheckedChange.
 */
export function joinGroup(group: GroupValue | null, item: GroupItem): () => boolean | undefined {
	if (!group) return () => undefined;

	$effect(() => {
		const checked = item.checked;
		untrack(() => {
			const value = item.value;
			const values = group.value;
			if (!value || checked === values.includes(value)) return;
			group.value = checked ? [...values, value] : values.filter((v) => v !== value);
		});
	});

	return () => {
		const value = item.value;
		return value ? group.value.includes(value) : undefined;
	};
}
