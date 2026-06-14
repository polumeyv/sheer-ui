<script lang="ts">
	import { mergeProps } from "$lib/vendor/index";
	import type { CommandGroupItemsProps } from "$lib/components/command/primitive/index";
	import { CommandGroupItemsState } from "$lib/components/command/primitive/command.svelte";
	import { createId } from "$lib/vendor/create-id";

	const uid = $props.id();

	let {
		id = createId(uid),
		ref = $bindable(null),
		children,
		child,
		...restProps
	}: CommandGroupItemsProps = $props();

	const groupItemsState = CommandGroupItemsState.create({
		id: { get current() { return id; } },
		ref: { get current() { return ref; }, set current(v) { (ref = v); } },
	});

	const mergedProps = $derived(mergeProps(restProps, groupItemsState.props));
</script>

<div style="display: contents;">
	{#if child}
		{@render child({ props: mergedProps })}
	{:else}
		<div {...mergedProps}>
			{@render children?.()}
		</div>
	{/if}
</div>
