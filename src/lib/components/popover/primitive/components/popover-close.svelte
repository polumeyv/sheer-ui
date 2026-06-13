<script lang="ts">
	import { mergeProps } from "$lib/vendor/index.js";
	import type { PopoverCloseProps } from "$lib/components/popover/primitive/index.js";
	import { PopoverCloseState } from "$lib/components/popover/primitive/popover.svelte.js";
	import { createId } from "$lib/internal/create-id.js";

	const uid = $props.id();

	let {
		child,
		children,
		id = createId(uid),
		ref = $bindable(null),
		...restProps
	}: PopoverCloseProps = $props();

	const closeState = PopoverCloseState.create({
		id: { get current() { return id; } },
		ref: { get current() { return ref; }, set current(v) { (ref = v); } },
	});
	const mergedProps = $derived(mergeProps(restProps, closeState.props));
</script>

{#if child}
	{@render child({ props: mergedProps })}
{:else}
	<button {...mergedProps}>
		{@render children?.()}
	</button>
{/if}
