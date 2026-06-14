<script lang="ts">
		import { CommandLabelState } from "$lib/components/command/primitive/command.svelte";

	import type { WithChildren } from "$lib/vendor/types";
	import { createId } from "$lib/vendor/create-id";
	import { mergeProps } from "$lib/vendor/index";
	import type { BitsPrimitiveLabelAttributes, WithElementRef } from "$lib/shared/index";

	const uid = $props.id();
	let {
		id = createId(uid),
		ref = $bindable(null),
		children,
		...restProps
	}: WithChildren<WithElementRef<BitsPrimitiveLabelAttributes>> = $props();

	const labelState = CommandLabelState.create({
		id: { get current() { return id; } },
		ref: { get current() { return ref; }, set current(v) { (ref = v); } },
	});

	const mergedProps = $derived(mergeProps(restProps, labelState.props));
</script>

<label {...mergedProps}>
	{@render children?.()}
</label>
