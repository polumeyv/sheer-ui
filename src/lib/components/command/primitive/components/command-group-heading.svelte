<script lang="ts">
	import { mergeProps } from "$lib/vendor/index.js";
	import { CommandGroupHeadingState } from "$lib/components/command/primitive/command.svelte.js";
	import type { CommandGroupHeadingProps } from "$lib/components/command/primitive/index.js";
	import { createId } from "$lib/internal/create-id.js";

	const uid = $props.id();

	let {
		id = createId(uid),
		ref = $bindable(null),
		children,
		child,
		...restProps
	}: CommandGroupHeadingProps = $props();

	const headingState = CommandGroupHeadingState.create({
		id: { get current() { return id; } },
		ref: { get current() { return ref; }, set current(v) { (ref = v); } },
	});

	const mergedProps = $derived(mergeProps(restProps, headingState.props));
</script>

{#if child}
	{@render child({ props: mergedProps })}
{:else}
	<div {...mergedProps}>
		{@render children?.()}
	</div>
{/if}
