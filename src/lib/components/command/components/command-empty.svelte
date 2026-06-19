<script lang="ts">
	import { boxWith, mergeProps } from "$lib/internal/toolbelt.js";
	import type { CommandEmptyProps } from "../types.js";
	import { CommandEmptyState } from "../command.svelte.js";
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
		id: boxWith(() => id),
		ref: boxWith(
			() => ref,
			(v) => (ref = v)
		),
		forceMount: boxWith(() => forceMount),
	});

	const mergedProps = $derived(
		mergeProps(
			{ "data-slot": "command-empty", class: "py-6 text-center text-sm" },
			restProps,
			emptyState.props
		)
	);
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
