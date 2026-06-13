<script lang="ts">
	import { mergeProps } from "$lib/vendor/index.js";
	import type { CommandGroupProps } from "$lib/components/command/primitive/index.js";
	import { CommandGroupContainerState } from "$lib/components/command/primitive/command.svelte.js";
	import { createId } from "$lib/internal/create-id.js";

	const uid = $props.id();

	let {
		id = createId(uid),
		ref = $bindable(null),
		value = "",
		forceMount = false,
		children,
		child,
		...restProps
	}: CommandGroupProps = $props();

	const groupState = CommandGroupContainerState.create({
		id: { get current() { return id; } },
		ref: { get current() { return ref; }, set current(v) { (ref = v); } },
		forceMount: { get current() { return forceMount; } },
		value: { get current() { return value; } },
	});

	const mergedProps = $derived(mergeProps(restProps, groupState.props));
</script>

{#if child}
	{@render child({ props: mergedProps })}
{:else}
	<div {...mergedProps}>
		{@render children?.()}
	</div>
{/if}
