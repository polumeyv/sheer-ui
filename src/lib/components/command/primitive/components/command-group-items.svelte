<script lang="ts">
	import { boxWith, mergeProps } from "$lib/vendor/toolbelt/index.js";
	import type { CommandGroupItemsProps } from "$lib/components/command/primitive/types.js";
	import { CommandGroupItemsState } from "$lib/components/command/primitive/command.svelte.js";
	import { createId } from "$lib/internal/create-id.js";

	const uid = $props.id();

	let {
		id = createId(uid),
		ref = $bindable(null),
		children,
		child,
		...restProps
	}: CommandGroupItemsProps = $props();

	const groupItemsState = CommandGroupItemsState.create({
		id: boxWith(() => id),
		ref: boxWith(
			() => ref,
			(v) => (ref = v)
		),
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
