<script lang="ts">
	import { mergeProps } from "$lib/vendor/index.js";
	import type { CommandEmptyProps } from "$lib/components/command/primitive/index.js";
	import { CommandEmptyState } from "$lib/components/command/primitive/command.svelte.js";
	import { createId } from "$lib/internal/create-id.js";

	const uid = $props.id();

	let {
		id = createId(uid),
		ref = $bindable(null),
		children,
		child,
		forceMount = false,
		...restProps
	}: CommandEmptyProps = $props();

	const emptyState = CommandEmptyState.create({
		id: { get current() { return id; } },
		ref: { get current() { return ref; }, set current(v) { (ref = v); } },
		forceMount: { get current() { return forceMount; } },
	});

	const mergedProps = $derived(mergeProps(emptyState.props, restProps));
</script>

{#if emptyState.shouldRender}
	{#if child}
		{@render child({ props: mergedProps })}
	{:else}
		<div {...mergedProps}>
			{@render children?.()}
		</div>
	{/if}
{/if}
