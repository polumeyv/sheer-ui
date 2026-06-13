<script lang="ts">
	import { mergeProps } from "$lib/vendor/index.js";
	import { CommandViewportState } from "$lib/components/command/primitive/command.svelte.js";
	import type { CommandViewportProps } from "$lib/components/command/primitive/index.js";
	import { createId } from "$lib/internal/create-id.js";

	const uid = $props.id();

	let {
		id = createId(uid),
		ref = $bindable(null),
		children,
		child,
		...restProps
	}: CommandViewportProps = $props();

	const listViewportState = CommandViewportState.create({
		id: { get current() { return id; } },
		ref: { get current() { return ref; }, set current(v) { (ref = v); } },
	});

	const mergedProps = $derived(mergeProps(restProps, listViewportState.props));
</script>

{#if child}
	{@render child({ props: mergedProps })}
{:else}
	<div {...mergedProps}>
		{@render children?.()}
	</div>
{/if}
